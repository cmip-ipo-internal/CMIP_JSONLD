/* A test for the CMIP-JLD library */


// Load the jsonld.js library
const cld = require('cmip_jld');

// push each function into the global scope
Object.keys(cld).forEach(key => {
    global[key] = cld[key];
});

const data = {
    "@context": {
      "dc11": "http://purl.org/dc/elements/1.1/",
      "ex": "http://example.org/vocab#",
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "ex:contains": {
        "@type": "@id"
      }
    },
    "@graph": [
      {
        "@id": "http://example.org/library",
        "@type": "ex:Library",
        "ex:contains": "http://example.org/library/the-republic"
      },
      {
        "@id": "http://example.org/library/the-republic",
        "@type": "ex:Book",
        "dc11:creator": "Plato",
        "dc11:title": "The Republic",
        "ex:contains": "http://example.org/library/the-republic#introduction"
      },
      {
        "@id": "http://example.org/library/the-republic#introduction",
        "@type": "ex:Chapter",
        "dc11:description": "An introductory chapter on The Republic.",
        "dc11:title": "The Introduction"
      }
    ]
  }


const frame = {
    "@context": {
      "dc11": "http://purl.org/dc/elements/1.1/",
      "ex": "http://example.org/vocab#"
    },
    "@type": "ex:Library",
    "ex:contains": {
      "@type": "ex:Book",
      "ex:contains": {
        "@explicit":true,
        "@type": "ex:Chapter",
        "dc11:description":""
      }
    }
  }


  // now we can apply the frame and any cleaning functions we desire. 
  cld.jsonld.frame(data,frame)
        .then(printState)
        .then(stringify)
        .then(rmld)
        .then(untag)
        .then(flatten)
        .then(str2JSON)
        .then(printState)