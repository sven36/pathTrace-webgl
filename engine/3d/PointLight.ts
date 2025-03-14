export default class PointLight {
    type: number;
    _x: any;
    _y: any;
    _z: any;
    numAll: number;
    _color: any;
    _radius: any;
    _size: any;
    _intensity: any;
    ldAry: any;
    numOffset: any;
    constructor(pos, _color, _radius, _size, _intensity) {
        this.type = 10,
            this.numOffset = 0,
            this._x = pos.x,
            this._y = pos.y,
            this._z = pos.z,
            this.numAll = 9,
            this._color = _color,
            this._radius = _radius,
            this._size = _size,
            this._intensity = _intensity;
    }

    applyAry() {
        this.ldAry && (this.ldAry[this.numOffset] = this._x,
            this.ldAry[this.numOffset + 1] = this._y,
            this.ldAry[this.numOffset + 2] = this._z,
            this.ldAry[this.numOffset + 3] = this._size,
            this.ldAry[this.numOffset + 4] = this._radius,
            this.ldAry[this.numOffset + 5] = this._intensity,
            this.ldAry[this.numOffset + 6] = this._color.x,
            this.ldAry[this.numOffset + 7] = this._color.y,
            this.ldAry[this.numOffset + 8] = this._color.z)
    }
}