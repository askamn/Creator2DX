"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
}
Config.Namespace = "MyAwesomeGame";
Config.HeaderTemplate = `#pragma once
#include \"cocos2d.h\"
#include \"ui/CocosGUI.h\"

namespace {%NAMESPACE%}
{

class {%CLASSNAME%} : public cocos2d::Node
{
public:
	virtual bool init() override;

	CREATE_FUNC({%CLASSNAME%});

	void InitChildren();

public:
	{%VARIABLES%}
};

}`;
Config.CPPTemplate = `#include \"CharacterSelectorUI.h\"

namespace {%NAMESPACE%} {

bool {%CLASSNAME%}::init()
{
	if (!cocos2d::Node::init())
	{
		return false;
	}
	
	return true;
}
	
void {%CLASSNAME%}::InitChildren()
{
	{%PARSER_OUTPUT%}
}
		
}`;
exports.Config = Config;
