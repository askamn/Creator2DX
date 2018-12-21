import { Node } from "./Node";
import { Sprite } from "./Sprite";
import { ImageView } from "./ImageView";

const COCOS_2DX_DESIGN_RESOLUTION_WIDTH = 360;
const COCOS_2DX_DESIGN_RESOLUTION_HEIGHT = 640;

const CREATOR_DESIGN_RESOLUTION_WIDTH = 720;
const CREATOR_DESIGN_RESOLUTION_HEIGHT = 1280;

const SCALE_X = COCOS_2DX_DESIGN_RESOLUTION_WIDTH / CREATOR_DESIGN_RESOLUTION_WIDTH;
const SCALE_Y = COCOS_2DX_DESIGN_RESOLUTION_HEIGHT / CREATOR_DESIGN_RESOLUTION_HEIGHT;

const Header = `#pragma once

#include "cocos2d.h"
#include "ui/CocosGUI.h"

namespace MyAwesomeGame
{

class {%CLASSNAME%} : public cocos2d::Node
{
public:
	virtual bool init() override;
	CREATE_FUNC({%CLASSNAME%});
	
	void InitChildren();
};

}`;

const Class = `#include "CharacterSelectorUI.h"

namespace MyAwesomeGame {

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
	
}
`;

export class Parser {
	private json: Object;
	private output: string;

	private nodeNameCache: object;

	private className: string;
	private headerFile: string;
	private cppFile: string;

	constructor(data: string) {
		this.json = JSON.parse(data);
		this.output = "";
		this.nodeNameCache = {};
	}

	public Parse() {
		let object = this.json[0];

		// Verify that the type is a cc.Prefab
		if (object.__type__ != 'cc.Prefab') {
			console.log("Not a valid prefab");
			process.exit();
		}

		this.className = this.json[1]._name;
		// Assumption, this is the root node
		this.parseNode(this.json[1], true);

		let replacements = {
			'{%CLASSNAME%}': this.className,
			'{%PARSER_OUTPUT%}': this.output,
		};

		this.headerFile = Header.replace(/{%\w+%}/g, function (all) {
			return replacements[all] || all;
		});

		this.cppFile = Class.replace(/{%\w+%}/g, function (all) {
			return replacements[all] || all;
		});
	}

	private camelize(str: string) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
			return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
		}).replace(/\s+/g, '');
	}

	private parseNode(object, isRoot: boolean = false, parent: Node = null) {
		if (object.__type__ == 'cc.Node') {
			object._name = this.camelize(object._name);

			if (Object.keys(this.nodeNameCache).indexOf(object._name) > -1) {
				this.nodeNameCache[object._name]++;
				object._name += this.nodeNameCache[object._name].toString();
			} else {
				this.nodeNameCache[object._name] = 0;
			}

			let isParsed: boolean = false;
			let currentNode: Node = null;

			// Parse components
			for (let i = 0; i < object._components.length; ++i) {
				let component = this.json[object._components[i].__id__];

				if (component.__type__ == 'cc.Sprite' && !isParsed) {
					isParsed = true;
					let sprite: Sprite | ImageView = null;

					switch (component._type) {
						// Simple:
						case 0: {
							sprite = new Sprite(object._name, SCALE_X, SCALE_Y);
						}
							break;
						// Sliced:
						case 1: {
							sprite = new ImageView(object._name, SCALE_X, SCALE_Y);
						}
					}

					sprite.parent = parent;
					sprite.Create();
					sprite.setPosition(object._position);
					sprite.setScale(object._scale);
					sprite.setContentSize(object._contentSize);
					sprite.setAnchorPoint(object._anchorPoint);
					sprite.setColor(object._color);
					sprite.setOpacity(object._opacity);
					sprite.setRotation(object._rotationX);
					currentNode = sprite;
					
					this.output += sprite.GetCPPString();
				}
			}

			if (!isParsed) {
				let node = new Node((isRoot ? "this" : object._name), SCALE_X, SCALE_Y);
				
				node.parent = parent;
				node.Create();
				node.setPosition(object._position);
				node.setScale(object._scale);
				node.setContentSize(object._contentSize);
				node.setAnchorPoint(object._anchorPoint);
				node.setColor(object._color);
				node.setOpacity(object._opacity);
				node.setRotation(object._rotationX);
				currentNode = node;

				this.output += node.GetCPPString();
			}

			// Parse children
			for (let i = 0; i < object._children.length; ++i) {
				let child = this.json[object._children[i].__id__];
				this.parseNode(child, false, currentNode);
				this.output += currentNode.addChild(child._name);
			}
		}
	}

	public GetOutput(): string {
		return this.output;
	}

	public GetClassName(): string {
		return this.className;
	}

	public GetHeaderFileContents(): string {
		return this.headerFile;
	}

	public GetCPPFileContents(): string {
		return this.cppFile;
	}
}