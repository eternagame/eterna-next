import * as path from 'path';

import convertFile from './src/lib';

let inputPath: path.ParsedPath | undefined;
let outputPath: path.ParsedPath | undefined;

// Set up input and output paths
process.argv.forEach((val, index) => {
  if (index === 2) {
    inputPath = path.parse(val);
  }
  if (index === 3) {
    outputPath = path.parse(val);
  }
});

if (inputPath === undefined) {
  throw new Error('You must supply an input json file or directory of json files to convert.');
}

switch (inputPath.ext) {
  case '.json':
    // If the input is a json token file path, we're converting just that file
    // If no output path is provided, use the input path as a template
    if (!outputPath) {
      outputPath = { ...inputPath, ext: '.css' };
    }
    convertFile(inputPath, outputPath);
    break;
  /*
  We currently only handle a single.json file, so removed the directory handling
  until we refactor to a proper library structure
  case '':
    // If the input is a directory, we'll convert all the json token files in the directory
    readdir(path.format(inputPath), (err, files) => {
      if (err) {
        throw new Error(`Error reading files from disk: ${err.message}`);
      }
      // Loop over each file and convert. Special handling if a different
      // directory was passed in as the output directory
      files.forEach((file) => {
        // FIXME: inputPath shouldn't need a type cast here, fix with yargs input sanit
        const inputFile = path.parse(path.join(path.format(inputPath!), file));
        if (outputPath) {
          const outputFile = path.parse(path.join(path.format(outputPath), file));
          convertFile(inputFile, outputFile);
        } else {
          convertFile(inputFile, undefined);
        }
      });
    });
    break;
  */
  default:
    throw new Error('The provided input is not a json file or a directory.');
    break;
}
