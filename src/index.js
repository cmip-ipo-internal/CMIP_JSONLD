/*
A series of funcitons used for parsing CMIP JSON-LD
Author: Daniel Ellis (wolfiex)
Contact: wcrp-cmip.org < @technical
*/


const axios = require('axios');
const jsonld = require('jsonld');
const jmes = require('./cmipsearch.js');

const search = jmes.search;

///////////////////////////////////////////////////////
// File IO
///////////////////////////////////////////////////////


/**
 * Fetches a list of files from a GitHub repository.
 *
 * @param {string} owner - The GitHub owner or organization.
 * @param {string} repo - The repository name.
 * @param {string} [path=''] - The path within the repository (optional).
 * @param {string} branch - The branch name.
 * @returns {Promise<Object[]>} A Promise that resolves to an array of file objects.
 */
const listFiles = async (owner, repo, path = '', branch) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    try {
        const response = await axios.get(url);
        const files = response.data;
        files.forEach(file => {
            console.log(file.name);
        });
        return files;
    } catch (error) {
        console.error('Error fetching files:', error.message);
    }
};

/**
 * Reads the content of a file from a GitHub repository.
 *
 * @param {string} owner - The GitHub owner or organization.
 * @param {string} repo - The repository name.
 * @param {string} filePath - The path to the file within the repository.
 * @param {string} branch - The branch name.
 * @returns {Promise<string>} A Promise that resolves to the file content as a string.
 */
const readFileGH = async (owner, repo, filePath, branch) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    try {
        const response = await axios.get(url);
        const fileContent = Buffer.from(response.data.content, 'base64').toString('utf8');
        console.log(fileContent);
        return fileContent;
    } catch (error) {
        console.error('Error reading file:', error.message);
    }
};

/**
 * Reads a JSON file from the file system.
 *
 * @param {string} filename - The name of the file to read.
 * @returns {Promise<Object|null>} A Promise that resolves to the parsed JSON object or null if an error occurs.
 */
async function readFileFS(filename) {
    const fs = require('fs').promises;
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file ${filename}:`, err);
        return null;
    }
}


async function readFileURL(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Error fetching JSON from ${url}:`, err);
        return null;
    }
}

async function mergeFiles(promises) {
    try {
        const results = await Promise.all(promises);
        // Flatten the arrays into a single merged array
        return [].concat(...results);
    } catch (err) {
        console.error('Error merging files:', err);
        throw err;
    }
}


/**
 * Writes the content of a JSON object to a file.
 *
 * @param {Object} content - The JSON object to be written to the file.
 * @param {string} file - The name of the file to write to.
 */
function writeFile(content, file) {
    const fs = require('fs').promises;
    fs.writeFile(file, JSON.stringify(content, null, 4), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log('JSON data has been written to ' + file);
    });
}


///////////////////////////////////////////////////////
// Object Manipulation
///////////////////////////////////////////////////////

/**
 * Converts a JSON object to a string.
 *
 * @param {Object} jsonObject - The JSON object to be stringified.
 * @returns {string} The stringified JSON object.
 */
async function stringify(jsonObject) {
    return JSON.stringify(jsonObject, null, 2);
}

/**
 * Parses a JSON string and returns the corresponding JavaScript object.
 *
 * @param {string} jsonString - The JSON string to be parsed.
 * @returns {Object} The parsed JavaScript object.
 */
async function str2JSON(jsonString) {
    return JSON.parse(jsonString);
}


/**
 * Extracts the "@graph" property from a JSON object.
 *
 * @param {Object} jsonObject - The JSON object.
 * @returns {Promise<Object>} A Promise that resolves to the "@graph" property value.
 */
async function graphOnly(jsonObject) {
    return jsonObject['@graph'];
}


///////////////////////////////////////////////////////
// Data Massage
///////////////////////////////////////////////////////


// Regex strings
const removeAtTagsRegex = /("@[^"]*":\s*".*?"(?:,)?\s*)/g;
const untagRegex = /"(?!cmip:|@)[^@":]*:([^@"]*?)":/g;
const desingleRegex = /{\s*"([^"]*?)":\s*"(.+)"\s*}/g;

const removeNull = /,*\s*"(.*?)":\s*null\s*(,*)/g;

/**
 * Removes all JSON-LD prefixes from keys in a JSON object.
 *
 * @param {string} jsonString - The JSON string to be transformed.
 * @returns {string} The transformed JSON string without JSON-LD prefixes.
 */
async function untag(jsonString) {
    return jsonString.replace(untagRegex, '"$1":');
}

/**
 * Removes all "@" entries from a JSON object.
 *
 * @param {string} jsonString - The JSON string to be transformed.
 * @returns {string} The transformed JSON string without "@" entries.
 */
async function rmld(jsonString) {
    return jsonString.replace(removeAtTagsRegex, '');
}

/**
 * Removes all "null" valued entries from a JSON object.
 *
 * @param {string} jsonString - The JSON string to be transformed.
 * @returns {string} The transformed JSON string without "@" entries.
 */
async function rmnull(jsonString) {
    return jsonString.replace(removeNull, '');
}

/**
 * Removes single-key objects from a JSON object and returns their values.
 *
 * @param {string} jsonString - The JSON string to be transformed.
 * @returns {string} The transformed JSON string without single-key objects.
 */
async function flatten(jsonString) {
    return jsonString.replace(desingleRegex, '"$2"');
}


/**
 * Print the current state without breaking the chain
 * @param {Object} jsonObject - The JSON string to be transformed.
 * @returns {Object} The transformed JSON string without single-key objects.
 */
async function printState(jsonObject) {
    console.log(jsonObject)
    return jsonObject
}




module.exports = {
    listFiles,
    readFileGH,
    readFileFS,
    writeFile,
    stringify,
    str2JSON,
    graphOnly,
    untag,
    rmld,
    rmnull,
    flatten,
    printState,
    jsonld,
    axios,
    search
  };