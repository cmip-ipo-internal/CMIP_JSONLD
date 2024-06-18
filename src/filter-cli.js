#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { search } = require('./filter.js');

// Function to handle command-line arguments and execute logic
function main() {
    // Check if enough arguments are provided
    if (process.argv.length < 4) {
        console.error('Usage: your-command <filepath> <string>');
        process.exit(1); // Exit with non-zero code indicating failure
    }

    // Extract filename and string argument from command line
    const filepath = process.argv[2];
    const searchString = process.argv.slice(3).join(' ');

    // Check if the filepath is a directory
    if (fs.lstatSync(filepath).isDirectory()) {
        // If it's a directory, redirect to graph.json inside that directory
        const graphPath = path.join(filepath, 'graph.json');
        readFileAndSearch(graphPath, searchString);
    } else {
        // Otherwise, read the content of the file
        readFileAndSearch(filepath, searchString);
    }
}

// Function to read file and perform search
function readFileAndSearch(filepath, searchString) {
    // Determine file extension
    const ext = path.extname(filepath).toLowerCase();

    // Read the content of the file
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filepath}: ${err.message}`);
            process.exit(1); // Exit with non-zero code indicating failure
        }

        let jsonData;
        try {
            // Parse JSON data if the file is .json or .jsonld
            if (ext === '.json' || ext === '.jsonld') {
                jsonData = JSON.parse(data);
            } else {
                console.error(`Unsupported file type: ${ext}`);
                process.exit(1); // Exit with non-zero code indicating failure
            }


            console.log(jsonData)
            console.log(searchString)

            // Example usage of search function
            const searchResult = search(jsonData, searchString);
            console.log('Search Result:', searchResult);

            // Additional logic can be added here based on your requirements
        } catch (parseError) {
            console.error(`Error parsing JSON in file ${filepath}: ${parseError.message}`);
            process.exit(1); // Exit with non-zero code indicating failure
        }
    });
}

module.exports = main;

// If this script is executed directly (node cli-script.js)
// run the main function
if (require.main === module) {
    main();
}
