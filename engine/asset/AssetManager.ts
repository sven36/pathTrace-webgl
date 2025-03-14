export enum LOAD_TYPE {
    BYTE_TYPE,
    XML_TYPE,
    IMG_TYPE
}

class AssetManager {
    private static inst: AssetManager | null = null
    _xhr: XMLHttpRequest
    _img: HTMLImageElement
    idle: boolean
    loadConfig: any;

    constructor() {
    }

    static getInstance(): AssetManager {
        return this.inst || (this.inst = new AssetManager(), this.inst);
    }

    startRequest(type: LOAD_TYPE, url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            switch (type) {
                case LOAD_TYPE.BYTE_TYPE:
                    xhr.open("GET", url, !0),
                        xhr.responseType = "arraybuffer";
                    xhr.send();
                    break;
                case LOAD_TYPE.XML_TYPE:
                    xhr.open("GET", url, !0),
                        xhr.responseType = "text";
                    xhr.send();
                case LOAD_TYPE.IMG_TYPE:
                    const _img = new Image;
                    _img.src = url;
                    _img.onload = (e) => {
                        resolve(_img);
                    }
                    break;
            }
        });
    }

    async load(url, type = LOAD_TYPE.IMG_TYPE) {
        const res = await this.startRequest(type, url);
        return res;

    }

    loadError() {
        this.idle = !0;
        this.loadConfig = null;
    }

    loadByteImg() {
        var t = new Blob([this._xhr.response], {
            type: "application/octet-binary"
        });
        this._img.src = URL.createObjectURL(t);
    }
}
export default AssetManager;
