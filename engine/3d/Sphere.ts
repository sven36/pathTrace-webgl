export default class Sphere {
    numAll: number;
    type: any;
    material: any;
    center: any;
    r: any;
    _x: any;
    _y: any;
    _z: any;
    _sx: any;
    numAry: any = [];
    numOffset: number = 0;
    constructor(pos, sx, type, material) {
        this.center = pos,
            this.r = sx,
            this._x = pos.x,
            this._y = pos.y,
            this._z = pos.z,
            this._sx = sx,
            this.numAll = 4,
            this.type = type,
            this.material = material;
    }
    applyAry() {
        this.numAry && (this.numAry[this.numOffset] = this.center.x,
            this.numAry[this.numOffset + 1] = this.center.y,
            this.numAry[this.numOffset + 2] = this.center.z,
            this.numAry[this.numOffset + 3] = this.r)
    }
}