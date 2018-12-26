import { writeFileSync } from "fs";
import { Parser } from "./core/Parser";

var args = process.argv.slice(2);

var argKey = args[0];
var file = args[1];

if (argKey != '--file') {
	process.exit();
}

let parser = new Parser(file);

parser.Parse();

writeFileSync("./output/" + parser.GetClassName() + ".h", parser.GetHeaderFileContents());
writeFileSync("./output/" + parser.GetClassName() + ".cpp", parser.GetCPPFileContents());