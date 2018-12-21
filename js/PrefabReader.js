"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Parser_1 = require("./core/Parser");
var args = process.argv.slice(2);
var argKey = args[0];
var file = args[1];
if (argKey != '--file') {
    process.exit();
}
var parser = new Parser_1.Parser(file);
parser.Parse();
fs_1.writeFileSync("./output/" + parser.GetClassName() + ".h", parser.GetHeaderFileContents());
fs_1.writeFileSync("./output/" + parser.GetClassName() + ".cpp", parser.GetCPPFileContents());
