import * as fs from 'fs';
import * as path from 'path';

// This function takes a path-represented input file, and optional path-represented 
// output file and converts the json tokens in the input file into a css output file.
export default function convertFile(inputPath: path.ParsedPath, outputPath: path.ParsedPath | undefined) {
  // Only attempt to convert if the file is a json file
  if (inputPath.ext === '.json') {
    fs.readFile(path.format(inputPath), 'utf8', (err, data) => {
      if (err) {
        throw new Error(`Error reading file from disk: ${err}`)
      } else {
        // Parse json, then convert into an map of token names to token values
        const tokenJson = JSON.parse(data);
        const tokenSets = tokenJson["$metadata"]["tokenSetOrder"].map(
          (tokenSetName: string) => { return { name: tokenSetName, tokens: tokenJson[tokenSetName]}}
        );
        const tokens = parseTokensFromJSON(tokenJson);
        // console.log(tokenSets)

        // Create css string
        let cssString = '';
        tokenSets.forEach((tokenSet: {name: string | undefined, tokens: Record<string, any>}) => {
          if (tokenSet.name === 'global') {tokenSet.name = undefined;}
          const tokens = parseTokensFromJSON(tokenSet.tokens);
          cssString += `:root${tokenSet.name ? `.${tokenSet.name}`: ''} {\n`
          Object.keys(tokens).forEach((tokenName) => {
            // Hack to handle CSS font-family with fallback
            // console.log(tokens[tokenName])
            if (tokenName === '--fontFamily') {
              let cssRule = tokenSet.tokens['fontFamily'].description.split("font-family: ")[1];
              cssString += convertTokenToCSSVariable(`${tokenName}: ${cssRule};\n`);
              return;
            }
            cssString += convertTokenToCSSVariable(`${tokenName}: ${tokens[tokenName]};\n`);
          })
          cssString += `}\n`
        })
  
        // Write string to output file (create based off input path if output path not provided)
        if (outputPath) {
          outputPath.base = `${outputPath.base.split(".")[0]}.css`;
          fs.mkdir(outputPath.dir, {recursive: true}, (err) => {
            if (err) {throw new Error(`${err}`)}
            fs.writeFile(path.format(outputPath as path.ParsedPath), cssString, () => {console.log(`${path.format(inputPath)} => ${[path.format(outputPath as path.ParsedPath)]}`)});
          })
        } else {
          outputPath = inputPath;
          outputPath.base = `${outputPath.base.split(".")[0]}.css`;
          fs.mkdir(outputPath.dir, {recursive: true}, (err) => {
            if (err) {throw new Error(`${err}`)}
            fs.writeFile(path.format(inputPath), cssString, () => {console.log(`${path.format(inputPath)} => ${[path.format(outputPath as path.ParsedPath)]}`)});
          })
        }
      }
    });
  }
}

// This function takes a JSON object with groups of potentially nested tokens and
// flattens it into a map from token name to token value
// Ex: {gray: {00: {value: tokenValue}}} => {gray-00: tokenValue}
function parseTokensFromJSON(object: Record<string, any>, parent = '', tokens: Record<string, any> = {}) {
  for(let key in object) {
    // Escape Tokens Studio-specific keys
    if (key.startsWith("$")) {} else {
      // If the object has a value property, it's a token definition
      if (object[key]["value"]) {
        const tokenName = (parent !== '') ? `--${parent}-${key}` : `-${parent}-${key}`;
        const tokenValue = object[key].value;
        tokens[tokenName] = tokenValue;
      } else {
        // If the object doesn't have a value property, it's a token group, 
        // so parse that object for token definitions
        parseTokensFromJSON(object[key], key, tokens)
      }
    }

  }
  return tokens;
}

// This function takes in a token string of the form `tokenName: tokenValue;`
// where the token value could contain brackets and periods within the brackets
// indicating other tokens in a nested format, and converts those to css variables
// representing those tokens
// Ex: {gray.50} => var(--gray-50)
function convertTokenToCSSVariable(tokenString: string) {
  const periodSubRegEx = /\.(?![^}]*(\(|$))/g
  const openBracketRegEx = /\{/g;
  const closeBracketRegEx = /\}/g;
  return tokenString
    .replace(periodSubRegEx, '-')
    .replace(openBracketRegEx, 'var(--')
    .replace(closeBracketRegEx, ')');
}
