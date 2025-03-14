export default class MaterialInfo {
    _glass: number;
    _tex: number;
    id: number;
    _baseColor: any;
    _roughness: any;
    _specular: any;
    _metallic: any;
    mdAry: number[];
    constructor(_baseColor, _roughness, _specular, _metallic, _tex = -1, _glass = 0) {
        this._glass = 0,
            this._tex = -1,
            this.id = 0,
            this._baseColor = _baseColor,
            this._roughness = _roughness,
            this._specular = _specular,
            this._metallic = _metallic,
            this._tex = _tex,
            this._glass = _glass
    }

    applyAry() {
        var t = 7 * this.id;
        this.mdAry && (0 <= this._tex ? this.mdAry[t] = this._tex : this.mdAry[t] = this._baseColor.x,
            this.mdAry[t + 1] = this._baseColor.y,
            this.mdAry[t + 2] = this._baseColor.z,
            this.mdAry[t + 3] = this._roughness,
            this.mdAry[t + 4] = this._specular,
            this.mdAry[t + 5] = this._metallic,
            this.mdAry[t + 6] = this._glass)
    }
}