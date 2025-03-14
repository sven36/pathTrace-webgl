export default class Plane {
    pos: any;
    normal: any;
    size: any;
    _x: any;
    _y: any;
    _z: any;
    _sx: any;
    numAll: number;
    type: any;
    material: any;
    numAry: any = [];
    numOffset: number = 0;
    constructor(pos, normal, size, type, material) {
        this.pos = pos,
            this.normal = normal,
            this.size = size,
            this._x = this.pos.x,
            this._y = this.pos.y,
            this._z = this.pos.z,
            this._sx = this.size,
            this.numAll = 7,
            this.type = type,
            this.material = material;
    }

    applyAry() {
        this.numAry && (this.numAry[this.numOffset] = this.pos.x,
            this.numAry[this.numOffset + 1] = this.pos.y,
            this.numAry[this.numOffset + 2] = this.pos.z,
            this.numAry[this.numOffset + 3] = this.normal.x,
            this.numAry[this.numOffset + 4] = this.normal.y,
            this.numAry[this.numOffset + 5] = this.normal.z,
            this.numAry[this.numOffset + 6] = this.size)
    }
}