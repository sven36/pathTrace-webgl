export default class Vector3D {
    y: number;
    x: number;
    z: number;
    w: number;
    static X_AXIS: Vector3D;
    static Y_AXIS: Vector3D;
    static Z_AXIS: Vector3D;
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x,
            this.y = y,
            this.z = z,
            this.w = w;
    }
}
Vector3D.X_AXIS = new Vector3D(1,0,0),
Vector3D.Y_AXIS = new Vector3D(0,1,0),
Vector3D.Z_AXIS = new Vector3D(0,0,1);