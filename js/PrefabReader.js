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
var data = null;
// Try to open the file
try {
    data = fs_1.readFileSync(file, 'utf-8');
}
catch (e) {
    console.log("File open error: " + file + "\nVerify that the file exists.");
    process.exit();
}
if (data === null) {
    console.log("File read error: " + file + "\nFailed to read file.");
    process.exit();
}
if (data.length === 0) {
    console.log("File read error: " + file + "\nEmpty file supplied.");
    process.exit();
}
var parser = new Parser_1.Parser(data);
parser.Parse();
fs_1.writeFileSync("./output/" + parser.GetClassName() + ".h", parser.GetHeaderFileContents());
fs_1.writeFileSync("./output/" + parser.GetClassName() + ".cpp", parser.GetCPPFileContents());
