export default class Platform {
    public static window = window;
    public static document = window.document;
    public static isInit = false;
    public static currentCanvas;
    public static getCanvas(idOrInst) {
        let canvas;
        if (typeof idOrInst === 'string') {
            canvas = document.getElementById(idOrInst);
        } else {
            canvas = idOrInst || Platform.document.createElement('canvas');
        }
        Platform.currentCanvas = canvas;
        return canvas;
    }
}