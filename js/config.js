"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.Namespace = "MyAwesomeGame";
    Config.HeaderTemplate = "#pragma once\n\n#include \"cocos2d.h\"\n#include \"ui/CocosGUI.h\"\n\nnamespace {%NAMESPACE%}\n{\n\nclass {%CLASSNAME%} : public cocos2d::Node\n{\npublic:\n\tvirtual bool init() override;\n\n\tCREATE_FUNC({%CLASSNAME%});\n\n\tvoid InitChildren();\n};\n\n}";
    Config.CPPTemplate = "#include \"CharacterSelectorUI.h\"\n\n\tnamespace {%NAMESPACE%} {\n\t\n\tbool {%CLASSNAME%}::init()\n\t{\n\t\tif (!cocos2d::Node::init())\n\t\t{\n\t\t\treturn false;\n\t\t}\n\t\t\n\t\treturn true;\n\t}\n\t\t\n\tvoid {%CLASSNAME%}::InitChildren()\n\t{\n\t\t{%PARSER_OUTPUT%}\n\t}\n\t\t\n\t}";
    return Config;
}());
exports.Config = Config;