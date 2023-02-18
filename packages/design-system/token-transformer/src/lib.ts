// FIXME: All of these eslint-disables are because of the any type in the tokens Record<string, any>
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as fs from 'fs';
import * as path from 'path';

/**
 * This function takes a JSON object with groups of potentially nested tokens and
 * flattens it into a map from token name to token value
 * Ex: {gray: {00: {value: tokenValue}}} => {gray-00: tokenValue}
 *
 * @param object JSON object of tokens or groups of tokens
 * @param parent string, key of parent group for nested tokens
 * @param tokens returned flat map of tokens
 * @returns flat map of input tokens
 */
function parseTokensFromJSON(object: Record<string, any>, parent = '', tokens: Record<string, any> = {}) {
  Object.keys(object).forEach((key) => {
    // If the object has a value property, it's a token definition
    if (object[key].value) {
      const tokenName = (parent !== '') ? `--${parent}-${key}` : `--${key}`;
      const tokenValue = object[key].value;

      // If the value is an object (like type or shadow), the token
      // applies multiple properties and needs to be split up into
      // separate rules for CSS.
      if (typeof tokenValue === 'object') {
        for (const property of Object.keys(tokenValue)) {
          // eslint-disable-next-line no-param-reassign
          tokens[`${tokenName}-${property}`] = tokenValue[key];
        }
      } else {
        // eslint-disable-next-line no-param-reassign
        tokens[tokenName] = tokenValue;
      }
    } else {
      // If the object doesn't have a value property, it's a token group,
      // so parse that object for token definitions
      const parentPrefix = parent ? `${parent}-` : '';
      parseTokensFromJSON(object[key], `${parentPrefix}${key}`, tokens);
    }
  });
  return tokens;
}

/**
 * This function takes in a token string of the form `tokenName: tokenValue;`
 * where the token value could contain brackets and periods within the brackets
 * indicating other tokens in a nested format, and converts those to css variables
 * Ex: {gray.50} => var(--gray-50)
 *
 * @param tokenString string of the form `tokenName: tokenValue;`
 * @returns string formatted as css variable
 */
function convertTokenToCSSVariable(tokenString: string) {
  const periodSubRegEx = /\.(?![^}]*(\(|$))/g;
  const openBracketRegEx = /\{/g;
  const closeBracketRegEx = /\}/g;
  return tokenString
    .replace(periodSubRegEx, '-')
    .replace(openBracketRegEx, 'var(--')
    .replace(closeBracketRegEx, ')');
}

/**
 * Function to convert JSON tokens in input file into css variable output file
 * @param inputPath String describing path to token file to convert
 * @param outputPath String describing path to desired output file
 */
// eslint-disable-next-line max-len
export default function convertFile(inputPath: path.ParsedPath, outputPath: path.ParsedPath) {
  // Only attempt to convert if the file is a json file
  if (inputPath.ext === '.json') {
    fs.readFile(path.format(inputPath), 'utf8', (err, data) => {
      if (err) {
        throw new Error(`Error reading file from disk: ${err.message}`);
      } else {
        // Parse json, then convert into an array of token groups (themes)
        const tokenJson = JSON.parse(data);
        const tokenSets = tokenJson.$metadata.tokenSetOrder.map(
          (tokenSetName: string) => ({ name: tokenSetName, tokens: tokenJson[tokenSetName] }),
        );

        // Create css string
        let cssFormattedOutput = '';
        // FIXME: Record<string, any> should be properly typed with a Token type
        tokenSets.forEach((tokenSet: { name: string | undefined, tokens: Record<string, any> }) => {
          const theme = tokenSet.name === 'global' ? undefined : tokenSet.name;
          const tokens = parseTokensFromJSON(tokenSet.tokens);

          cssFormattedOutput += `:root${theme ? `.${theme}` : ''} {\n`;
          Object.keys(tokens).forEach((tokenName) => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            cssFormattedOutput += convertTokenToCSSVariable(`\t${tokenName}: ${tokens[tokenName]};\n`);
          });
          cssFormattedOutput += '}\n';
        });

        // Write string to output file
        // outputPath.base = `${outputPath.base.split('.')[0]}.css`;
        fs.mkdir(outputPath.dir, { recursive: true }, (error) => {
          if (error) { throw new Error(`${error.message}`); }
          fs.writeFile(path.format(outputPath), cssFormattedOutput, () => {
            // eslint-disable-next-line no-console
            console.log(`${path.format(inputPath)} => ${path.format(outputPath)}`);
          });
        });
      }
    });
  }
}
