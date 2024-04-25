const { join } = require('path');
const { execSync } = require('child_process');
const { existsSync, mkdirSync, statSync, writeFileSync } = require('fs');
const mockApi = require('swagger-mock-api');
const express = require('express');

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
 * Start the mock server
 *
 * @param {string} resource
 * @param {number} port
 */
const startMockServer = (resource, port) => {
  const { path: swaggerFile } = getResource(resource);
  const app = express();

  app.use((...args) => {
    const request = args[1];
    const urlString = request?.req?.url || '';
    const methodString = request?.req?.method || '';
    console.log('API response:', color.BLUE, methodString, color.CYAN, urlString, color.NOCOLOR);

    return mockApi({
      swaggerFile,
      watch: false
    })(...args);
  });

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
