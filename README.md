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


## Using the CLI search 
To use this we specify a path (reading the graph.json file) / filename and a jmespath query string. e.g. 
```shell
cmip-filter JSONLD/scripts/output/MIP_organisations.json *[].cmip_acronym
``` 
will return
```js
Search Result: [
  'SOLARIS HEPPA', 'AER',             'AoR',         'AS-RCEC',
  'AUoT',          'AWI',             'BAS',         'BCC',
  'CAMS',          'CAS',             'CCCma',       'CCCR-IITM',
  'CEDA',          'CMCC',            'CNES',        'CSIRO',
  'DKRZ',          'DWD',             'EAWAG',       'ECMWF',
  'ESSO',          'FMI',             'FUBerlin',    'IACETH',
  'IFM-GEOMAR',    'ImperialCollege', 'INM',         'IPSL',
  'ISSI',          'JAXA',            'KIOST',       'KIT',
  'LLNL',          'LPC2E',           'MOHC',        'MPI-B',
  'MPI-M',         'MPS',             'MRI',         'NASA-GISS',
  'NASA-GSFC',     'NASA-JPL',        'NASA-LaRC',   'NCAR',
  'NCAS',          'NERC',            'NIWA',        'NOAA-NCEI',
  'NTU',           'NUIST',           'OSU',         'PCMDI',
  'PMOD',          'PNNL-JGCRI',      'PNNL-WACCEM', 'RSS',
  'SNU',           'THU',             'UA',          'UCI',
  'UColorado',     'UCSB',            'UHH',         'UoBergen',
  'UofMD',         'UoLeeds',         'UoM',         'UoMontreal',
  'UoOtago',       'UoOulu',          'UReading',    'UW',
  'VUA'
]
```


## Development 
### regenerate the documentation (JSDOC or ESDOC)
`npm run docs`

### Update npm version number in package.json
`npm version <patch|minor|major>`

### publish
`npm publish`
