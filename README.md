# CMIP_JSONLD
Package to process json-ld files in CMIP infrastructure. 

## Install 
```
npm i cmip_jld
```

## Documentation
This will be available at https://jsonld.mipcvs.dev

## Usage
```js
// Load the jsonld.js library
const cld = require('cmip_jld');

// push each function into the global scope
Object.keys(cld).forEach(key => {
    global[key] = cld[key];
});

// now chain all the post parsing functions we need. 
cld.jsonld.frame(data,frame)
        .then(stringify)
        .then(rmld) // removes @ tags
        .then(untag) // eliminates the prefixes
        .then(flatten) // Stops single entries being represented as objects
        .then(str2JSON)

 ```



## Development 
### regenerate the documentation (JSDOC or ESDOC)
`npm run docs`

### Update npm version number in package.json
`npm version <patch|minor|major>`

### publish
`npm publish`
