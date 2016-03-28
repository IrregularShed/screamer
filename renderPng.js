"use strict";
const Jimp = require("jimp");
let buffer;

function getColours(x, y) {
    let offset = x + y * 32 + 6144;
    let byte = buffer[offset];
    let ink = byte & 0b111;
    let paper = (byte & 0b111000) >> 3;
    let bright = (byte & 0b1000000) == 0b1000000;

    return { ink: getRGB(ink, bright), paper: getRGB(paper, bright) };
}

function getRGB(grb, bright) {
    let byteVal = (bright ? 0xff : 0xcc);
    
    return Jimp.rgbaToInt(
        (grb & 2) == 2 ? byteVal : 0,
        (grb & 4) == 4 ? byteVal : 0,
        (grb & 1) == 1 ? byteVal : 0,
        0xff
    );
}

function getOffset(y) {
    let attrOffset = (y % 8) * 256;
    y = Math.floor(y / 8);
    let lineOffset = (y % 8) * 32;
    y = Math.floor(y / 8);
    let chunkOffset = (y % 4) * 2048;

    return chunkOffset + attrOffset + lineOffset;
}

function getRenderedImage(data) {
    let image = new Jimp(256, 192);
    buffer = data;
    for (let y = 0; y < 192; y++) {
        let firstByte = getOffset(y);
        for (let x = 0; x < 32; x++) {
            let offset = firstByte + x;
            let cols = getColours(x, Math.floor(y / 8));
            let myByte = buffer[offset];
            for (let bit = 0; bit < 8; bit++) {
                if ((myByte & 0b10000000) == 0b10000000) {
                    image.setPixelColor(cols.ink, x * 8 + bit, y);
                } else {
                    image.setPixelColor(cols.paper, x * 8 + bit, y);
                }
                myByte = (myByte << 1);
            }
        }
    }
    
    return image;
}

module.exports = {
    ping: () => {
        console.log("pong")
    },
    renderBuffer: (data) => {
        let image = getRenderedImage(data);
        image.write(".\\hello.png"); // temp
    }
};