const fs = require('fs');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerParser = require('swagger-parser');
const YAML = require('yamljs');
const cache = {
  tryAgainCount: 0
};

const serveDocs = (yamlFile = `${process.cwd()}/.qpc/quipucords/docs/swagger.yml`, port = 5050) => {
  if (fs.existsSync(yamlFile)) {
    const app = express();

    app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(YAML.load(yamlFile)));

    app.listen(port, () => {
      console.log(`\nYou can now view API docs in the browser.\n  Open: http://localhost:${port}/docs/api\n`);

      swaggerParser.validate(yamlFile, err => {
        if (err) {
          console.error(`  \x1b[31m${err.name}\n  \x1b[31m${err.message}\x1b[0m\n`);
        }
      });
    });
  } else if (cache.tryAgainCount < 10) {
    setTimeout(() => {
      console.info(`Locating swagger.yml...`);
      cache.tryAgainCount += 1;
      serveDocs();
    }, 1000);
  } else {
    console.info(`Swagger.yml doesn't exist`);
    process.exit();
  }
};

serveDocs();
