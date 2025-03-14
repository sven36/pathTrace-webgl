import AssetManager, { LOAD_TYPE } from "@/asset/AssetManager";

export default class TextureManager {
    static inst: TextureManager;
    dic: any = {};
    constructor() {

    }

    static getInstance() {
        if (!this.inst) {
            this.inst = new TextureManager;
            return this.inst;
        }
        return this.inst;
    }

    public async getTexture(uri) {
        if (this.dic[uri]) {
            this.dic[uri].useNum++;
            return this.dic[uri];
        }
        const res = await AssetManager.getInstance().load(uri, LOAD_TYPE.IMG_TYPE);
        //const rect = new Rectangle(0,0,Math.pow(2, Math.ceil(Math.log(tex.width) / Math.log(2))),Math.pow(2, Math.ceil(Math.log(tex.height) / Math.log(2))));
        // if (rect.width != tex.width || rect.height != tex.height) {
        //     console.log("图片尺寸不为2幂");
        //     var i = UIManager.getInstance().getContext2D(rect.width, rect.height, !1);
        //     return i.drawImage(tex, 0, 0, tex.width, tex.height, 0, 0, rect.width, rect.height),
        //     this.getTexture(i.canvas, 0, 0)
        // }
        return res;
    }

}