const { execSync } = require('child_process');
const { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } = require('fs');
const { join } = require('path');
const express = require('express');
const yaml = require('yaml');

/**
 * Basic colors for console output
 *
 * @type {{RED: string, BLUE: string, NOCOLOR: string, CYAN: string}}
 */
const color = {
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  NOCOLOR: '\x1b[0m',
  RED: '\x1b[31m'
};

/**
 * Execute a sync command
 *
 * @param {string} cmd
 * @param {object} settings
 * @param {string} settings.errorMessage
 * @returns {string}
 */
const runCmd = (cmd, { errorMessage = 'Skipping... {0}' } = {}) => {
  let stdout = '';

  try {
    stdout = execSync(cmd);
  } catch (e) {
    console.error(color.RED, errorMessage.replace('{0}', e.message), color.NOCOLOR);
  }

  return stdout.toString();
};

/**
 * Return a remote yml resource
 *
 * @param {string} resource
 * @param {object} options
 * @param {number} options.cacheTime
 * @param {string} options.file
 * @param {string} options.dir
 * @returns {{path: string, file: string, dir: string, isSuccess: boolean}}
 */
const getResource = (resource, { cacheTime = 300000, file = 'spec.yml', dir = join(process.cwd(), '.qpc') } = {}) => {
  const fullPath = join(dir, file);
  let isSuccess = false;

  // If exists for set amount of time return the cached resource
  if (existsSync(fullPath)) {
    const { ctime } = statSync(fullPath);

    if (new Date(ctime).getTime() + cacheTime > new Date().getTime()) {
      return { dir, file, path: fullPath, isSuccess: true };
    }
  }

  // Load the remote resource
  const contents = runCmd(`curl -sf ${resource}`);

  if (contents) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(fullPath, contents, { encoding: 'utf-8' });
    isSuccess = true;
  }

  return { dir, file, path: fullPath, isSuccess };
};

/**
 * Resolve a JSON $ref pointer within a spec object
 *
 * @param {object} spec
 * @param {object} obj
 * @returns {*}
 */
const resolveRef = (spec, obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (obj.$ref) {
    const parts = obj.$ref.replace(/^#\//, '').split('/');
    let result = spec;
    for (const part of parts) {
      result = result?.[part];
    }
    return result;
  }
  return obj;
};

/**
 * Generate a mock value from a Swagger 2.0 schema node, using property-level
 * examples where present and type-appropriate defaults elsewhere.
 *
 * @param {object} spec - full parsed spec (for $ref resolution)
 * @param {object} schema - the schema node to generate from
 * @param {Set<string>} [_visited] - tracks $refs already being resolved (prevents cycles)
 * @returns {*}
 */
const generateFromSchema = (spec, schema, _visited = new Set()) => {
  if (!schema) return null;

  // Resolve $ref, guarding against cycles
  if (schema.$ref) {
    if (_visited.has(schema.$ref)) return {};
    const visited = new Set(_visited).add(schema.$ref);
    const resolved = resolveRef(spec, schema);
    return generateFromSchema(spec, resolved, visited);
  }

  // Merge allOf entries
  if (schema.allOf) {
    return schema.allOf.reduce((acc, sub) => {
      const resolved = resolveRef(spec, sub);
      const generated = generateFromSchema(spec, resolved, _visited);
      return typeof generated === 'object' && generated !== null ? { ...acc, ...generated } : acc;
    }, {});
  }

  // Use the schema-level example if present
  if (schema.example !== undefined) return schema.example;

  switch (schema.type) {
    case 'object':
    case undefined: {
      const obj = {};
      for (const [key, propSchema] of Object.entries(schema.properties || {})) {
        obj[key] = generateFromSchema(spec, resolveRef(spec, propSchema), _visited);
      }
      return obj;
    }
    case 'array':
      return schema.items ? [generateFromSchema(spec, resolveRef(spec, schema.items), _visited)] : [];
    case 'string':
      return schema.enum ? schema.enum[0] : '';
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return false;
    default:
      return null;
  }
};

/**
 * Get mock response body and status for an operation
 *
 * @param {object} spec
 * @param {object} operation
 * @returns {{status: number, body: *}}
 */
const getMockResponse = (spec, operation) => {
  const responses = operation?.responses || {};
  const statusCode = Object.keys(responses).find(c => /^2/.test(String(c))) || '200';
  const response = resolveRef(spec, responses[statusCode]);
  const status = parseInt(statusCode, 10) || 200;

  if (!response) return { body: null, status };

  // Swagger 2.0: response-level examples keyed by MIME type
  if (response.examples?.['application/json'] !== undefined) {
    return { body: response.examples['application/json'], status };
  }

  // Generate from response schema
  if (response.schema) {
    return { body: generateFromSchema(spec, response.schema), status };
  }

  return { body: null, status };
};

/**
 * Build express middleware from a parsed Swagger 2.0 spec
 *
 * @param {object} spec
 * @returns {Function}
 */
const buildMockMiddleware = spec => {
  const router = express.Router();
  const basePath = spec.basePath || '';
  const paths = spec.paths || {};

  for (const [swaggerPath, methods] of Object.entries(paths)) {
    // Convert Swagger path params {param} to Express :param
    const expressPath = basePath + swaggerPath.replace(/\{(\w+)\}/g, ':$1');

    for (const [method, operation] of Object.entries(methods)) {
      const lowerMethod = method.toLowerCase();
      if (!router[lowerMethod]) continue;

      const { body, status } = getMockResponse(spec, operation);

      router[lowerMethod](expressPath, (_req, res) => {
        if (body === null) {
          res.status(status).end();
        } else {
          res.status(status).json(body);
        }
      });
    }
  }

  return router;
};

/**
 * Start the mock server
 *
 * @param {string} resource
 * @param {number} port
 */
const startMockServer = (resource, port) => {
  const { path: swaggerFile, isSuccess } = getResource(resource);

  if (!isSuccess && !existsSync(swaggerFile)) {
    console.error(color.RED, 'Failed to retrieve swagger spec', color.NOCOLOR);
    return;
  }

  const spec = yaml.parse(readFileSync(swaggerFile, 'utf8'));
  const app = express();

  app.use((req, _res, next) => {
    console.log('API response:', color.BLUE, req.method, color.CYAN, req.url, color.NOCOLOR);
    next();
  });

  app.use(buildMockMiddleware(spec));

  app.listen(port, () => console.log('API listening'));
};

/**
 * Get passed args
 *
 * @returns {object}
 */
const getArgs = () => {
  const args = {};

  process.argv.slice(2).forEach((arg, index, arr) => {
    if (!(index % 2)) {
      const trimmedArg = arg.replace(/-/g, '').trim();
      args[trimmedArg] = arr[index + 1];
    }
  });

  return args;
};

const { file, port } = getArgs();

if (file && port) {
  startMockServer(file, port);
} else {
  console.log(color.RED, 'apiMock requires args for "--file" and "--port"', color.NOCOLOR);
}
