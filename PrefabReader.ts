import { writeFileSync, readFileSync } from "fs";
import { Parser } from "./core/Parser";

var args = process.argv.slice(2);

var argKey = args[0];
var file = args[1];

if (argKey != '--file') {
	process.exit();
}

let data: string = null;
// Try to open the file
try {
	data = readFileSync(file, 'utf-8');
} catch (e) {
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

let parser = new Parser(data);

parser.Parse();

writeFileSync("./output/" + parser.GetClassName() + ".h", parser.GetHeaderFileContents());
writeFileSync("./output/" + parser.GetClassName() + ".cpp", parser.GetCPPFileContents());