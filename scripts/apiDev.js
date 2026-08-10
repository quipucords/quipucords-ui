const { execSync } = require('child_process');
const { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } = require('fs');
const { join } = require('path');
const express = require('express');
const yaml = require('js-yaml');

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
    return resolveRef(spec, result);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => resolveRef(spec, item));
  }
  const resolved = {};
  for (const [key, value] of Object.entries(obj)) {
    resolved[key] = resolveRef(spec, value);
  }
  return resolved;
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

  if (!response) return { body: {}, status };

  // Swagger 2.0: examples object keyed by MIME type
  if (response.examples?.['application/json'] !== undefined) {
    return { body: response.examples['application/json'], status };
  }

  // Schema-level example
  const schema = resolveRef(spec, response.schema);
  if (schema?.example !== undefined) {
    return { body: schema.example, status };
  }

  return { body: {}, status };
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
        res.status(status).json(body);
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

  const spec = yaml.load(readFileSync(swaggerFile, 'utf8'));
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
