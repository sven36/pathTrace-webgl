import { Matrix } from "./Matrix";
import Vector3D from "./Vector3D";

export default class AreaLight {
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
    _sx: any;
    _sy: any;
    _rx: any = 0;
    _ry: any = 0;
    _rz: any = 0;
    constructor(pos, _color, _radius, _sx, _sy, _intensity) {
        this.type = 11,
            this.numOffset = 0,
            this._x = pos.x,
            this._y = pos.y,
            this._z = pos.z,
            this.numAll = 14,
            this._color = _color,
            this._radius = _radius,
            this._sx = _sx,
            this._sy = _sy,
            this._intensity = _intensity;
    }

    applyAry() {
        if (this.ldAry) {
            var vecSx = new Vector3D(0, 0, this._sx)
                , vecSy = new Vector3D(0, this._sy, 0)
                , mat = new Matrix;
            mat.appendRotation(this._rx, Vector3D.X_AXIS),
                mat.appendRotation(this._ry, Vector3D.Y_AXIS),
                mat.appendRotation(this._rz, Vector3D.Z_AXIS),
                vecSy = mat.transformVector(vecSy),
                vecSx = mat.transformVector(vecSx),
                this.ldAry[this.numOffset] = this._x,
                this.ldAry[this.numOffset + 1] = this._y,
                this.ldAry[this.numOffset + 2] = this._z,
                this.ldAry[this.numOffset + 3] = vecSy.x,
                this.ldAry[this.numOffset + 4] = vecSy.y,
                this.ldAry[this.numOffset + 5] = vecSy.z,
                this.ldAry[this.numOffset + 6] = vecSx.x,
                this.ldAry[this.numOffset + 7] = vecSx.y,
                this.ldAry[this.numOffset + 8] = vecSx.z,
                this.ldAry[this.numOffset + 9] = this._radius,
                this.ldAry[this.numOffset + 10] = this._intensity,
                this.ldAry[this.numOffset + 11] = this._color.x,
                this.ldAry[this.numOffset + 12] = this._color.y,
                this.ldAry[this.numOffset + 13] = this._color.z
        }
    }
}