// generate-version.js
const fs = require('fs');
const packageJson = require('./package.json');

const content = `
export const versionInfo = {
  version: '${packageJson.version}',
  buildTime: '${new Date().toISOString()}'
};
`;

fs.writeFileSync('./src/environments/version.ts', content);
