export class Config {
	public static Namespace = "MyAwesomeGame";
	public static HeaderTemplate = `#pragma once
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
	public static CPPTemplate = `#include \"CharacterSelectorUI.h\"

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
}