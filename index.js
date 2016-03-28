"use strict";

const Jimp = require("jimp");
const rp = require("request-promise");
//const url = "http://www.worldofspectrum.org/pub/sinclair/screens/load/k/scr/KnightLore.scr";
const url = "http://www.worldofspectrum.org/pub/sinclair/screens/load/a/scr/AticAtac.scr";
//const url = "http://www.worldofspectrum.org/pub/sinclair/screens/load/j/scr/Jetpac.scr";

let imgBuffer = rp({url: url, encoding: null}).then((data) => {
    if (data.length != 6912) {
        throw new Error("Data retrieved not the valid size :/");
    }
    
    let renderer = require("./renderPng.js");
    renderer.renderBuffer(data);
    
}).catch((err) => {
    console.log("There was an error getting the item at the URL provided");
    console.log(err.message);
});

