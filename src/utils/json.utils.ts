import * as fs from 'fs';
import * as path from 'path';
import * as config from '../config';
import {Logger, LogLevel} from '../logger';
import {window} from 'vscode';

const logger: Logger = new Logger(`json.utils:`, config.logLevel);

/**
 * Converts json data to property array if data is an object.
 * @param data Json data array or object to convert.
 */
export function convertJsonData(data: any): any {
  if (!Array.isArray(data)) {
    // convert it to flat object properties array
    data = this.objectToPropertyArray(
      this.flattenObject(data, true)); // preserve parent path
  }
  return data;
}

/**
 * Flattens objects with nested properties for data view display.
 * @param obj Object to flatten.
 * @param preservePath Optional flag for generating key path.
 * @returns Flat Object.
 */
export function flattenObject (obj: any, preservePath: boolean = false): any {
  const flatObject: any = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      let children: any = {};
      Object.assign(children, this.flattenObject(obj[key], preservePath));
      Object.keys(children).forEach(childKey => {
        const propertyName: string = (preservePath) ? `${key}.${childKey}`: childKey;
        flatObject[propertyName] = children[childKey];
      });
    } 
    else if (Array.isArray(obj[key])) {
    
    } else if (obj[key]) {
      flatObject[key] = obj[key].toString();
    }
  });
  return flatObject;
}

/**
 * Converts an object to an array of property key/value objects.
 * @param obj Object to convert.
 */
export function objectToPropertyArray(obj: any): Array<any> {
  const properties: Array<any> = [];
  if (obj && obj !== undefined) {
    Object.keys(obj).forEach((key) => {
      properties.push({
        key: key,
        value: obj[key]
      });
    });
  }
  return properties;
}

/**
 * Converts .env or .properties config file
 * to an array of property key/value objects.
 * @param configString Config file content.
 */
export function configToPropertyArray(configString: string): Array<any> {
  const properties: Array<any> = [];
  if (configString && configString.length > 0) {
    const configLines: Array<string> = configString.split(/\r\n|\r|\n/);
    configLines.forEach(line => {
      if (line.length > 0 && !line.startsWith('#') && !line.startsWith('!')) { // skip comments        
        const keyValue: Array<string> = line.split('=');
        properties.push({
            key: keyValue[0] || '<space>',
            value: keyValue[1] || ''
          });
      }
    });
  }
  return properties;
}
