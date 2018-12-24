import { readFileSync, existsSync, exists } from "fs";

export class AssetDB {
	private static instance: AssetDB = null;

	public static i(): AssetDB {
		if (AssetDB.instance === null) {
			AssetDB.instance = new AssetDB();
		}

		return AssetDB.instance;
	}

	private importsPath: string;
	private UUIDMap: Object;

	private constructor() {}

	public LoadAssetDB(libraryPath: string) {
		let data: string = null;
		let assetDBPath: string = libraryPath + '/uuid-to-mtime.json';

		try {
			data = readFileSync(assetDBPath, 'utf-8');
		} catch (e) {
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

		if (!existsSync(this.importsPath)) {
			console.log("[LoadAssetDB]: Imports folder does not exist!", this.importsPath);
			process.exit();
		}
	}

	public GetAsset(uuid: string): string {
		let path = this.importsPath + '/' + uuid.slice(0, 2) + "/" + uuid + ".json";

		if (!existsSync(path)) {
			console.warn("[GetAsset]: " + path + " does not exist.");
			return "";
		}

		let data = readFileSync(path, 'utf-8');
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