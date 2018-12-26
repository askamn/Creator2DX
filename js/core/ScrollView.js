"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
class ScrollView extends Node_1.Node {
    Create(data = null) {
        this.createVariableName();
        this.cppString = this.getVariableDeclaration() + " = cocos2d::ui::ScrollView::create();\n";
        // DEBUG:
        this.cppString += this.variableName + "->setBackGroundColorType(cocos2d::ui::Layout::BackGroundColorType::SOLID);\n";
        this.cppString += this.variableName + "->setBackGroundColor(cocos2d::Color3B::WHITE);\n";
        if (data) {
            this.setPosition(data._position);
            this.setRotation(data._rotationX);
            this.setScale(data._scale);
            this.setAnchorPoint(data._anchorPoint);
            this.setContentSize(data._contentSize);
            this.setColor(data._color);
            this.setOpacity(data._opacity);
            this.setSkew(data._skewX, data._skewY);
        }
    }
    SetProperties(properties) {
        this.setDirection(properties.horizontal, properties.vertical);
        this.setInertiaEnabled(properties.inertia);
        this.setBounceEnabled(properties.elastic);
    }
    setPosition(position) {
        this.position = { x: position.x, y: position.y };
        position.x *= this.scaleX;
        position.y *= this.scaleY;
        if (this.parent) {
            this.cppString += this.variableName + "->setPosition(cocos2d::Vec2(" + position.x;
            this.cppString += " + " + this.parent.variableName + "->getContentSize().width / 2.0f, " + position.y;
            this.cppString += " + " + this.parent.variableName + "->getContentSize().height / 2.0f";
            this.cppString += "));\n";
        }
        else {
            this.cppString += this.variableName + "->setPosition(cocos2d::Vec2(" + position.x + " + this->getParent()->getContentSize().width / 2.0f, " + position.y + " + this->getParent()->getContentSize().height / 2.0f));\n";
        }
    }
    setDirection(horizontal, vertical) {
        if (horizontal && vertical) {
            this.direction = ScrollView.SCROLL_DIRECTIONS.indexOf("BOTH");
        }
        else if (horizontal) {
            this.direction = ScrollView.SCROLL_DIRECTIONS.indexOf("HORIZONTAL");
        }
        else if (vertical) {
            this.direction = ScrollView.SCROLL_DIRECTIONS.indexOf("VERTICAL");
        }
        else {
            this.direction = ScrollView.SCROLL_DIRECTIONS.indexOf("NONE");
        }
        this.cppString += this.variableName + "->setDirection(cocos2d::ui::ScrollView::Direction::" + ScrollView.SCROLL_DIRECTIONS[this.direction] + ");\n";
    }
    setInertiaEnabled(inertia) {
        this.inertia = inertia;
        let value = (this.inertia ? "true" : "false");
        this.cppString += this.variableName + "->setInertiaScrollEnabled(" + value + ");\n";
    }
    setBounceEnabled(elastic) {
        this.elastic = elastic;
        let value = (this.elastic ? "true" : "false");
        this.cppString += this.variableName + "->setBounceEnabled(" + value + ");\n";
    }
    setInnerContainerSize(contentNode) {
        this.innerContainerSize = contentNode._contentSize;
        this.innerContainerSize.width *= this.scaleX;
        this.innerContainerSize.height *= this.scaleY;
        this.cppString += this.variableName + "->setInnerContainerSize(cocos2d::Size(" + this.innerContainerSize.width + ", " + this.innerContainerSize.height + "));\n";
    }
}
ScrollView.SCROLL_DIRECTIONS = ['NONE', 'VERTICAL', 'HORIZONTAL', 'BOTH'];
exports.ScrollView = ScrollView;
