const fs = require('fs');
const { join } = require('path');

module.exports = {
  root: true,
  ignorePatterns: fs
    .readFileSync(join(__dirname, './.gitignore'), 'utf8')
    .split('\n'),
  extends: [
    'plugin:@eternagame/vue3-typescript',
    'plugin:@eternagame/nx-typescript',
  ],
};
