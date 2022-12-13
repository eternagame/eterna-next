import * as fs from 'fs';
import * as path from 'path';

import { default as convertFile } from './src/lib';

let inputPath: path.ParsedPath | undefined, outputPath: path.ParsedPath | undefined;

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
    convertFile(inputPath, outputPath);
    break;
  case '':
      // If the input is a directory, we'll convert all the json token files in the directory
      fs.readdir(path.format(inputPath), (err, files) => {
        if (err) {
          throw new Error(`Error reading files from disk: ${err}`)
        }
        // Loop over each file and convert. Special handling if a different
        // directory was passed in as the output directory
        files.forEach((file) => {
          let inputFile = path.parse(path.join(path.format(inputPath as path.ParsedPath), file));
          if (outputPath) {
            let outputFile = path.parse(path.join(path.format(outputPath), file));
            convertFile(inputFile, outputFile);
          } else {
            convertFile(inputFile, undefined);
          }
        })
      })
      break;
  default:
    throw new Error('The provided input is not a json file or a directory.');
    break;
}

