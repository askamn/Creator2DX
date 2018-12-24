"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./Node");
var ScrollView = /** @class */ (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScrollView.prototype.Create = function (data) {
        if (data === void 0) { data = null; }
        this.cppString = "auto " + this.name + " = cocos2d::ui::ScrollView::create();\n";
        // DEBUG:
        this.cppString += this.name + "->setBackGroundColorType(cocos2d::ui::Layout::BackGroundColorType::SOLID);\n";
        this.cppString += this.name + "->setBackGroundColor(cocos2d::Color3B::WHITE);\n";
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
    };
    ScrollView.prototype.SetProperties = function (properties) {
        this.setDirection(properties.horizontal, properties.vertical);
        this.setInertiaEnabled(properties.inertia);
        this.setBounceEnabled(properties.elastic);
    };
    ScrollView.prototype.setPosition = function (position) {
        this.position = { x: position.x, y: position.y };
        position.x *= this.scaleX;
        position.y *= this.scaleY;
        if (this.parent) {
            this.cppString += this.name + "->setPosition(cocos2d::Vec2(" + position.x;
            this.cppString += " + " + this.parent.name + "->getContentSize().width / 2.0f, " + position.y;
            this.cppString += " + " + this.parent.name + "->getContentSize().height / 2.0f";
            this.cppString += "));\n";
        }
        else {
            this.cppString += this.name + "->setPosition(cocos2d::Vec2(" + position.x + " + this->getParent()->getContentSize().width / 2.0f, " + position.y + " + this->getParent()->getContentSize().height / 2.0f));\n";
        }
    };
    ScrollView.prototype.setDirection = function (horizontal, vertical) {
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
        this.cppString += this.name + "->setDirection(cocos2d::ui::ScrollView::Direction::" + ScrollView.SCROLL_DIRECTIONS[this.direction] + ");\n";
    };
    ScrollView.prototype.setInertiaEnabled = function (inertia) {
        this.inertia = inertia;
        var value = (this.inertia ? "true" : "false");
        this.cppString += this.name + "->setInertiaScrollEnabled(" + value + ");\n";
    };
    ScrollView.prototype.setBounceEnabled = function (elastic) {
        this.elastic = elastic;
        var value = (this.elastic ? "true" : "false");
        this.cppString += this.name + "->setBounceEnabled(" + value + ");\n";
    };
    ScrollView.prototype.setInnerContainerSize = function (contentNode) {
        this.innerContainerSize = contentNode._contentSize;
        this.innerContainerSize.width *= this.scaleX;
        this.innerContainerSize.height *= this.scaleY;
        this.cppString += this.name + "->setInnerContainerSize(cocos2d::Size(" + this.innerContainerSize.width + ", " + this.innerContainerSize.height + "));\n";
    };
    ScrollView.SCROLL_DIRECTIONS = ['NONE', 'VERTICAL', 'HORIZONTAL', 'BOTH'];
    return ScrollView;
}(Node_1.Node));
exports.ScrollView = ScrollView;
