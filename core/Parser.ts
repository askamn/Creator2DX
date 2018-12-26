import { readFileSync, existsSync } from "fs";
import { Node } from "./Node";
import { Sprite } from "./Sprite";
import { ImageView } from "./ImageView";
import { resolve } from "path";
import { AssetDB } from "./AssetDB";
import { Label } from "./Label";
import { Button } from "./Button";
import { ICCLabel } from "./creator/interfaces/ICCLabel";
import { ICCSprite } from "./creator/interfaces/ICCSprite";
import { ICCColor } from "./creator/interfaces/ICCColor";
import { Config } from "../config";
import { ScrollView } from "./ScrollView";
import { ICCScrollView } from "./creator/interfaces/ICCScrollView";
import { ICCNode } from "./creator/interfaces/ICCNode";
import { EditBox } from "./EditBox";
import { ICCEditBox } from "./creator/interfaces/ICCEditBox";

export class CPPTypes {
	public static Node = "cocos2d::Node";
	public static Button = "cocos2d::ui::Button";
	public static Sprite = "cocos2d::Sprite";
	public static ImageView = "cocos2d::ui::ImageView";
	public static ScrollView = "cocos2d::ui::ScrollView";
	public static Label = "cocos2d::Label";
	public static EditBox = "cocos2d::ui::EditBox";
}

export enum Components {
	Sprite = 1,
	Button,
	Label,
	Widget,
	ScrollView,
	EditBox,
}

const COCOS_2DX_DESIGN_RESOLUTION_WIDTH = 360;
const COCOS_2DX_DESIGN_RESOLUTION_HEIGHT = 640;

const CREATOR_DESIGN_RESOLUTION_WIDTH = 720;
const CREATOR_DESIGN_RESOLUTION_HEIGHT = 1280;

const SCALE_X = COCOS_2DX_DESIGN_RESOLUTION_WIDTH / CREATOR_DESIGN_RESOLUTION_WIDTH;
const SCALE_Y = COCOS_2DX_DESIGN_RESOLUTION_HEIGHT / CREATOR_DESIGN_RESOLUTION_HEIGHT;

export interface CPPVariable {
	name: string;
	type: string;
}

export class Parser {
	private json: Object;
	private output: string;

	private nodeNameCache: object;

	private className: string;
	private headerFile: string;
	private cppFile: string;

	private libraryFolder: string;
	private variableCache: CPPVariable[];
	private variables: string;

	constructor(filePath: string) {
		let data: string = null;

		// Try to open the file
		try {
			data = readFileSync(filePath, 'utf-8');
		} catch (e) {
			console.log("File open error: " + filePath + "\nVerify that the file exists.");
			process.exit();
		}

		if (data === null) {
			console.log("File read error: " + filePath + "\nFailed to read file.");
			process.exit();
		}

		if (data.length === 0) {
			console.log("File read error: " + filePath + "\nEmpty file supplied.");
			process.exit();
		}

		this.json = JSON.parse(data);
		this.output = "";
		this.nodeNameCache = {};
		this.variableCache = [];

		// Make sure that the asset database exists
		let absolutePathBits = resolve(filePath).split('/');
		this.libraryFolder = absolutePathBits.slice(0, absolutePathBits.length - 1).join('/') + '/library';

		if (!existsSync(this.libraryFolder)) {
			console.log("Asset library folder does not exist in the prefab directory.\nPlease make sure that you copy the library directory of your Cocos Creator project in the sample as the input prefab.");
			process.exit();
		}

		AssetDB.i().LoadAssetDB(this.libraryFolder);
	}

	public Parse() {
		let object = this.json[0];

		// Verify that the type is a cc.Prefab
		if (object.__type__ != 'cc.Prefab') {
			console.log("Not a valid prefab");
			process.exit();
		}

		for (var key in this.json) {
			if (this.json[key]._name) {
				this.json[key].__name = this.json[key]._name;
			}
		}

		this.className = this.json[1]._name;
		// Assumption, this is the root node
		this.parseNode(this.json[1], true);
		this.constructVariables();

		let replacements = {
			'{%CLASSNAME%}': this.className,
			'{%PARSER_OUTPUT%}': this.output,
			'{%NAMESPACE%}': Config.Namespace,
			'{%VARIABLES%}': this.variables
		};

		this.headerFile = Config.HeaderTemplate.replace(/{%\w+%}/g, function (all) {
			return replacements[all] || all;
		});

		this.cppFile = Config.CPPTemplate.replace(/{%\w+%}/g, function (all) {
			return replacements[all] || all;
		});
	}

	private camelize(str: string) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
			return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
		}).replace(/\s+/g, '');
	}

	private isSprite(component) {
		return component.__type__ == 'cc.Sprite';
	}

	private isButton(component) {
		return component.__type__ == 'cc.Button';
	}

	private isLabel(component) {
		return component.__type__ == 'cc.Label';
	}

	private isScrollView(component) {
		return component.__type__ == 'cc.ScrollView';
	}

	private isEditBox(component) {
		return component.__type__ == 'cc.EditBox';
	}

	private isNode(component) {
		return component.__type__ == 'cc.Node';
	}

	private hasButtonComponent(object) {
		for (let i = 0; i < object._components.length; ++i) {
			let component = this.json[object._components[i].__id__];

			if (this.isButton(component)) {
				return true;
			}
		}

		return false;
	}

	private parseScrollView(object: ICCNode, component: ICCScrollView, parent: Node): ScrollView {
		let scrollview: ScrollView = new ScrollView(object._name, SCALE_X, SCALE_Y);

		// Only parse the sprite if it has a sprite frame
		scrollview.parent = parent;
		scrollview.Create(object);
		scrollview.SetProperties(component);
		scrollview.setInnerContainerSize(this.json[component.content.__id__]);

		this.output += scrollview.GetCPPString();

		// Now parse the content node
		try {
			for (let i = 0; i < object._children.length; ++i) {
				let child: ICCNode = this.json[object._children[i].__id__];

				if (child.__name == 'view') {
					for (let j = 0; j < child._children.length; ++j) {
						let subchild: ICCNode = this.json[child._children[j].__id__];

						if (subchild.__name == 'content') {
							this.parseNode(subchild, false, scrollview);
							throw ("Sup");
						}
					}
				}
			}

			console.warn("Failed to find content node in scrollview");
		} catch (noobException) {
			// Ignored
		}

		return scrollview;
	}

	private parseSprite(object: ICCNode, component: ICCSprite, parent: Node): Sprite | ImageView {
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

		// Only parse the sprite if it has a sprite frame
		if (component._spriteFrame) {
			sprite.parent = parent;
			sprite.spriteFrameUUID = component._spriteFrame.__uuid__;
			sprite.Create(object);

			this.output += sprite.GetCPPString();
		} else {
			console.warn("Spriteframe of sprite is undefined or null");
		}

		return sprite;
	}

	private parseLabel(object: ICCNode, component: ICCLabel, parent: Node): Label {
		let label = new Label(object._name, SCALE_X, SCALE_Y);
		label.parent = parent;
		label.SetProperties(component, object._color);
		label.Create(object);

		this.output += label.GetCPPString();

		return label;
	}

	private parseEditBox(object: ICCNode, component: ICCEditBox, parent: Node): EditBox {
		let editBox = new EditBox(object._name, SCALE_X, SCALE_Y);
		editBox.parent = parent;
		editBox.SetProperties(component, object._contentSize);
		editBox.Create(object);

		this.output += editBox.GetCPPString();

		return editBox;
	}

	private parseButton(object: ICCNode, parent: Node): Button {
		let spriteFrameUUID: string = null;
		let buttonText: string = null;
		let button: Button = null;
		let textColor: ICCColor = null;

		let ccsprite: ICCSprite;
		let cclabel: ICCLabel = null;

		// First find the sprite
		for (let i = 0; i < object._components.length; ++i) {
			let component = this.json[object._components[i].__id__];

			if (this.isSprite(component)) {
				spriteFrameUUID = component._spriteFrame.__uuid__;
			}
		}

		// If the sprite frame uuid is still null, try find a "base" node with a sprite component
		for (let i = 0; i < object._children.length; ++i) {
			let child = this.json[object._children[i].__id__];
			if (child.__name == "base") {
				spriteFrameUUID = this.getComponent(child, Components.Sprite)._spriteFrame.__uuid__;
			} else if (child.__name == "label") {
				cclabel = this.getComponent(child, Components.Label);
				textColor = child._color;
			}
		}

		if (cclabel == null || spriteFrameUUID == null) {
			console.warn("Missing text or sprite frame for cc.Button.", buttonText, spriteFrameUUID);
			return null;
		}

		// Create a new label
		let label = new Label(object._name + "_label", SCALE_X, SCALE_Y, true);
		label.SetProperties(cclabel, textColor);

		this.output += label.GetCPPString();

		button = new Button(object._name, SCALE_X, SCALE_Y);
		button.spriteFrameUUID = spriteFrameUUID;
		button.parent = parent;
		button.Create(object);
		button.setTextLabel(label.name);
		this.output += button.GetCPPString();

		return button;
	}

	private getComponent(object, type: Components) {
		switch (type) {
			case Components.Sprite: {
				for (let i = 0; i < object._components.length; ++i) {
					let component = this.json[object._components[i].__id__];

					if (this.isSprite(component)) {
						return component;
					}
				}
			} break;

			case Components.Label: {
				for (let i = 0; i < object._components.length; ++i) {
					let component = this.json[object._components[i].__id__];

					if (this.isLabel(component)) {
						return component;
					}
				}
			} break;

			case Components.Button: {
				for (let i = 0; i < object._components.length; ++i) {
					let component = this.json[object._components[i].__id__];

					if (this.isButton(component)) {
						return component;
					}
				}
			} break;

			case Components.ScrollView: {
				for (let i = 0; i < object._components.length; ++i) {
					let component = this.json[object._components[i].__id__];

					if (this.isScrollView(component)) {
						return component;
					}
				}
			} break;

			case Components.EditBox: {
				for (let i = 0; i < object._components.length; ++i) {
					let component = this.json[object._components[i].__id__];

					if (this.isEditBox(component)) {
						return component;
					}
				}
			} break;
		}

		return null;
	}

	private parseNode(object, isRoot: boolean = false, parent: Node = null): Node {
		if (this.isNode(object)) {
			object._name = this.camelize(object._name);
			object.__name = object._name;

			if (Object.keys(this.nodeNameCache).indexOf(object._name) > -1) {
				this.nodeNameCache[object._name]++;
				object._name += this.nodeNameCache[object._name].toString();
			} else {
				this.nodeNameCache[object._name] = 0;
			}

			let cppVariable: CPPVariable = { name: object._name, type: "" };

			let isParsed: boolean = false;
			let isButton: boolean = false;
			let currentNode: Node = null;

			// First check if this has a button component
			if (this.hasButtonComponent(object)) {
				isParsed = true;
				isButton = true;
				cppVariable.type = CPPTypes.Button;
				this.variableCache.push(cppVariable);
				currentNode = this.parseButton(object, parent);
			} else {
				// Parse components
				for (let i = 0; i < object._components.length; ++i) {
					let component = this.json[object._components[i].__id__];

					if (this.isSprite(component) && !isParsed) {
						// Sprite Component
						isParsed = true;
						cppVariable.type = (component._type == 0) ? CPPTypes.Sprite : CPPTypes.ImageView;
						this.variableCache.push(cppVariable);
						currentNode = this.parseSprite(object, component, parent);
					} else if (this.isScrollView(component) && !isParsed) {
						// ScrollView Component
						isParsed = true;
						cppVariable.type = CPPTypes.ScrollView;
						this.variableCache.push(cppVariable);
						currentNode = this.parseScrollView(object, component, parent);

						return currentNode;
					} else if (this.isLabel(component) && !isParsed) {
						// Label Component
						isParsed = true;
						cppVariable.type = CPPTypes.Label;
						this.variableCache.push(cppVariable);
						currentNode = this.parseLabel(object, component, parent);
					} else if (this.isEditBox(component) && !isParsed) {
						console.log("Found an editbox; Parsing...");
						// EditBox Component
						isParsed = true;
						cppVariable.type = CPPTypes.EditBox;
						this.variableCache.push(cppVariable);
						currentNode = this.parseEditBox(object, component, parent);

						// No need to parse editBox's chidlren
						return currentNode;
					}
				}
			}

			if (!isParsed) {
				let node = new Node((isRoot ? "this" : object._name), SCALE_X, SCALE_Y);
				node.parent = parent;
				node.Create(object);

				cppVariable.type = CPPTypes.Node;
				this.variableCache.push(cppVariable);
				currentNode = node;

				this.output += node.GetCPPString();
			}

			if (currentNode == null) {
				console.log(object, isParsed);
			}

			//if (currentNode) {
				// Parse children
				for (let i = 0; i < object._children.length; ++i) {
					let child = this.json[object._children[i].__id__];

					// If this node had a button component, we would have already parsed their label and base child nodes
					if (isButton && child.__name == "base" || child.__name == "label") {
						continue;
					}

					let node = this.parseNode(child, false, currentNode);
					this.output += currentNode.addChild(node.variableName);
				}
			//}
			
			return currentNode;
		}

		return null;
	}

	private constructVariables() {
		this.variables = '';

		for (let i = 0; i < this.variableCache.length; i++) {
			this.variables += this.variableCache[i].type + "* m_" + this.variableCache[i].name + " = nullptr;\n";
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