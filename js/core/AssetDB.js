"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class AssetDB {
    constructor() { }
    static i() {
        if (AssetDB.instance === null) {
            AssetDB.instance = new AssetDB();
        }
        return AssetDB.instance;
    }
    LoadAssetDB(libraryPath) {
        let data = null;
        let assetDBPath = libraryPath + '/uuid-to-mtime.json';
        try {
            data = fs_1.readFileSync(assetDBPath, 'utf-8');
        }
        catch (e) {
            console.log("[LoadAssetDB]: File open error: " + assetDBPath + "\nVerify that the file exists.");
            process.exit();
        }
        if (data === null) {
            console.log("[LoadAssetDB]: File read error: " + assetDBPath + "\nFailed to read file.");
            process.exit();
        }
        if (data.length === 0) {
            console.log("[LoadAssetDB]: File read error: " + assetDBPath + "\nEmpty file supplied.");
            process.exit();
        }
        this.UUIDMap = JSON.parse(data);
        this.importsPath = libraryPath + '/imports';
        if (!fs_1.existsSync(this.importsPath)) {
            console.log("[LoadAssetDB]: Imports folder does not exist!", this.importsPath);
            process.exit();
        }
    }
    GetAsset(uuid) {
        let path = this.importsPath + '/' + uuid.slice(0, 2) + "/" + uuid + ".json";
        if (!fs_1.existsSync(path)) {
            console.warn("[GetAsset]: " + path + " does not exist.");
            return "";
        }
        let data = fs_1.readFileSync(path, 'utf-8');
        let json = JSON.parse(data);
        switch (json.__type__) {
            case 'cc.SpriteFrame': {
                let pathBits = this.UUIDMap[json.content.texture].relativePath.split('/');
                return 'sprites/' + pathBits[pathBits.length - 1];
            }
            case 'cc.TTFFont': {
                return 'fonts/' + json._name + '.ttf';
            }
        }
    }
}
AssetDB.instance = null;
exports.AssetDB = AssetDB;
