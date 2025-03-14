'use strict';

class Vector3D {
    y;
    x;
    z;
    w;
    static X_AXIS;
    static Y_AXIS;
    static Z_AXIS;
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x,
            this.y = y,
            this.z = z,
            this.w = w;
    }
}
Vector3D.X_AXIS = new Vector3D(1, 0, 0),
    Vector3D.Y_AXIS = new Vector3D(0, 1, 0),
    Vector3D.Z_AXIS = new Vector3D(0, 0, 1);

class Matrix {
    defaultArray;
    matrix;
    /**
     *  归一化
     */
    isIdentity;
    static tempM;
    constructor() {
        this.isIdentity = true;
        this.defaultArray = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        this.matrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    /**
     *  归一化
     */
    identity() {
        this.matrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    /**
     * @zh 创建透视投影矩阵。
     * @param left 视椎左边界。
     * @param right 视椎右边界。
     * @param bottom 视椎底边界。
     * @param top 视椎顶边界。
     * @param zNear 视椎近边界。
     * @param zFar 视椎远边界。
     */
    createPerspectiveMatrix(left, right, bottom, top, znear, zfar) {
    }
    /**
     * 通过给定的near和far平面下，很难去适当的决定4个参数（left, right, top, bottom），以在指定的窗口分辨率上进行透视投影。但你可以根据view角度的垂直/水平域和宽高比，width/height，简单的推导出这4个参数。然而这些推导受限于对称的透视投影矩阵
     */
    createPerspectiveMatrixFOV(rad, ratio, viewNear = 1, viewFar) {
        var top = 1 / Math.tan(rad / 2), right = top / ratio, matrix = this.matrix;
        matrix[0] = right,
            matrix[1] = 0,
            matrix[2] = 0,
            matrix[3] = 0,
            matrix[4] = 0,
            matrix[5] = top,
            matrix[6] = 0,
            matrix[7] = 0,
            matrix[8] = 0,
            matrix[9] = 0,
            matrix[10] = viewFar / (viewFar - viewNear),
            matrix[11] = 1,
            matrix[12] = 0,
            matrix[13] = 0,
            // znear * zRange
            matrix[14] = viewNear * viewFar / (viewNear - viewFar),
            matrix[15] = 0;
    }
    appendRotation = function (rot, vec3) {
        Matrix.tempM.identity(),
            Matrix.tempM.prependRotation(rot, vec3),
            this.append(Matrix.tempM);
    };
    append(tempM) {
        Matrix.tempM.matrix[0] = tempM.matrix[0],
            Matrix.tempM.matrix[1] = tempM.matrix[1],
            Matrix.tempM.matrix[2] = tempM.matrix[2],
            Matrix.tempM.matrix[3] = tempM.matrix[3],
            Matrix.tempM.matrix[4] = tempM.matrix[4],
            Matrix.tempM.matrix[5] = tempM.matrix[5],
            Matrix.tempM.matrix[6] = tempM.matrix[6],
            Matrix.tempM.matrix[7] = tempM.matrix[7],
            Matrix.tempM.matrix[8] = tempM.matrix[8],
            Matrix.tempM.matrix[9] = tempM.matrix[9],
            Matrix.tempM.matrix[10] = tempM.matrix[10],
            Matrix.tempM.matrix[11] = tempM.matrix[11],
            Matrix.tempM.matrix[12] = tempM.matrix[12],
            Matrix.tempM.matrix[13] = tempM.matrix[13],
            Matrix.tempM.matrix[14] = tempM.matrix[14],
            Matrix.tempM.matrix[15] = tempM.matrix[15],
            Matrix.tempM.prepend(this),
            this.matrix[0] = Matrix.tempM.matrix[0],
            this.matrix[1] = Matrix.tempM.matrix[1],
            this.matrix[2] = Matrix.tempM.matrix[2],
            this.matrix[3] = Matrix.tempM.matrix[3],
            this.matrix[4] = Matrix.tempM.matrix[4],
            this.matrix[5] = Matrix.tempM.matrix[5],
            this.matrix[6] = Matrix.tempM.matrix[6],
            this.matrix[7] = Matrix.tempM.matrix[7],
            this.matrix[8] = Matrix.tempM.matrix[8],
            this.matrix[9] = Matrix.tempM.matrix[9],
            this.matrix[10] = Matrix.tempM.matrix[10],
            this.matrix[11] = Matrix.tempM.matrix[11],
            this.matrix[12] = Matrix.tempM.matrix[12],
            this.matrix[13] = Matrix.tempM.matrix[13],
            this.matrix[14] = Matrix.tempM.matrix[14],
            this.matrix[15] = Matrix.tempM.matrix[15];
    }
    prepend(tempM) {
        var tempMatrix = tempM.matrix, matrix = this.matrix, matrix2 = this.matrix, n = matrix2[0], i = matrix2[1], o = matrix2[2], s = matrix2[3], h = matrix2[4], c = matrix2[5], u = matrix2[6], d = matrix2[7], p = matrix2[8], f = matrix2[9], l = matrix2[10], _ = matrix2[11], y = matrix2[12], x = matrix2[13], m = matrix2[14], g = matrix2[15], D = tempMatrix[0], v = tempMatrix[1], b = tempMatrix[2], S = tempMatrix[3];
        matrix[0] = D * n + v * h + b * p + S * y,
            matrix[1] = D * i + v * c + b * f + S * x,
            matrix[2] = D * o + v * u + b * l + S * m,
            matrix[3] = D * s + v * d + b * _ + S * g,
            D = tempMatrix[4],
            v = tempMatrix[5],
            b = tempMatrix[6],
            S = tempMatrix[7],
            matrix[4] = D * n + v * h + b * p + S * y,
            matrix[5] = D * i + v * c + b * f + S * x,
            matrix[6] = D * o + v * u + b * l + S * m,
            matrix[7] = D * s + v * d + b * _ + S * g,
            D = tempMatrix[8],
            v = tempMatrix[9],
            b = tempMatrix[10],
            S = tempMatrix[11],
            matrix[8] = D * n + v * h + b * p + S * y,
            matrix[9] = D * i + v * c + b * f + S * x,
            matrix[10] = D * o + v * u + b * l + S * m,
            matrix[11] = D * s + v * d + b * _ + S * g,
            D = tempMatrix[12],
            v = tempMatrix[13],
            b = tempMatrix[14],
            S = tempMatrix[15],
            matrix[12] = D * n + v * h + b * p + S * y,
            matrix[13] = D * i + v * c + b * f + S * x,
            matrix[14] = D * o + v * u + b * l + S * m,
            matrix[15] = D * s + v * d + b * _ + S * g;
    }
    prependRotation(rot, vec3) {
        var a, r, n, i, o, s, h, c, u, d, p, f, l, _, y, x, m, g, D, v, b, S, w, T, M = this.matrix, A = this.matrix, I = vec3.x, B = vec3.y, L = vec3.z, P = Math.sqrt(I * I + B * B + L * L);
        return Math.abs(P) < 1e-6 ? null : (I *= P = 1 / P,
            B *= P,
            L *= P,
            a = Math.sin(rot * Math.PI / 180),
            n = 1 - (r = Math.cos(rot * Math.PI / 180)),
            i = A[0],
            o = A[1],
            s = A[2],
            h = A[3],
            c = A[4],
            u = A[5],
            d = A[6],
            p = A[7],
            f = A[8],
            l = A[9],
            _ = A[10],
            y = A[11],
            x = I * I * n + r,
            m = B * I * n + L * a,
            g = L * I * n - B * a,
            D = I * B * n - L * a,
            v = B * B * n + r,
            b = L * B * n + I * a,
            S = I * L * n + B * a,
            w = B * L * n - I * a,
            T = L * L * n + r,
            M[0] = i * x + c * m + f * g,
            M[1] = o * x + u * m + l * g,
            M[2] = s * x + d * m + _ * g,
            M[3] = h * x + p * m + y * g,
            M[4] = i * D + c * v + f * b,
            M[5] = o * D + u * v + l * b,
            M[6] = s * D + d * v + _ * b,
            M[7] = h * D + p * v + y * b,
            M[8] = i * S + c * w + f * T,
            M[9] = o * S + u * w + l * T,
            M[10] = s * S + d * w + _ * T,
            M[11] = h * S + p * w + y * T,
            A !== M && (M[12] = A[12],
                M[13] = A[13],
                M[14] = A[14],
                M[15] = A[15]),
            M);
    }
    transformVector(pos) {
        var vec3 = new Vector3D;
        vec3.x = this.matrix[0] * pos.x + this.matrix[4] * pos.y + this.matrix[8] * pos.z + this.matrix[12] * pos.w,
            vec3.y = this.matrix[1] * pos.x + this.matrix[5] * pos.y + this.matrix[9] * pos.z + this.matrix[13] * pos.w,
            vec3.z = this.matrix[2] * pos.x + this.matrix[6] * pos.y + this.matrix[10] * pos.z + this.matrix[14] * pos.w,
            vec3.w = this.matrix[3] * pos.x + this.matrix[7] * pos.y + this.matrix[11] * pos.z + this.matrix[15] * pos.w;
        return vec3;
    }
}
Matrix.tempM = new Matrix();

class Platform {
    static window = window;
    static document = window.document;
    static isInit = false;
    static currentCanvas;
    static getCanvas(idOrInst) {
        let canvas;
        if (typeof idOrInst === 'string') {
            canvas = document.getElementById(idOrInst);
        }
        else {
            canvas = idOrInst || Platform.document.createElement('canvas');
        }
        Platform.currentCanvas = canvas;
        return canvas;
    }
}

const ppConfig = {
    viewNear: 1,
    viewFar: 1000,
};

var LOAD_TYPE;
(function (LOAD_TYPE) {
    LOAD_TYPE[LOAD_TYPE["BYTE_TYPE"] = 0] = "BYTE_TYPE";
    LOAD_TYPE[LOAD_TYPE["XML_TYPE"] = 1] = "XML_TYPE";
    LOAD_TYPE[LOAD_TYPE["IMG_TYPE"] = 2] = "IMG_TYPE";
})(LOAD_TYPE || (LOAD_TYPE = {}));
class AssetManager {
    static inst = null;
    _xhr;
    _img;
    idle;
    loadConfig;
    constructor() {
    }
    static getInstance() {
        return this.inst || (this.inst = new AssetManager(), this.inst);
    }
    startRequest(type, url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                }
                else {
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
                    xhr.open("GET", url, true),
                        xhr.responseType = "arraybuffer";
                    xhr.send();
                    break;
                case LOAD_TYPE.XML_TYPE:
                    xhr.open("GET", url, true),
                        xhr.responseType = "text";
                    xhr.send();
                case LOAD_TYPE.IMG_TYPE:
                    const _img = new Image;
                    _img.src = url;
                    _img.onload = (e) => {
                        resolve(_img);
                    };
                    break;
            }
        });
    }
    async load(url, type = LOAD_TYPE.IMG_TYPE) {
        const res = await this.startRequest(type, url);
        return res;
    }
    loadError() {
        this.idle = true;
        this.loadConfig = null;
    }
    loadByteImg() {
        var t = new Blob([this._xhr.response], {
            type: "application/octet-binary"
        });
        this._img.src = URL.createObjectURL(t);
    }
}

class MaterialInfo {
    _glass;
    _tex;
    id;
    _baseColor;
    _roughness;
    _specular;
    _metallic;
    mdAry;
    constructor(_baseColor, _roughness, _specular, _metallic, _tex = -1, _glass = 0) {
        this._glass = 0,
            this._tex = -1,
            this.id = 0,
            this._baseColor = _baseColor,
            this._roughness = _roughness,
            this._specular = _specular,
            this._metallic = _metallic,
            this._tex = _tex,
            this._glass = _glass;
    }
    applyAry() {
        var t = 7 * this.id;
        this.mdAry && (0 <= this._tex ? this.mdAry[t] = this._tex : this.mdAry[t] = this._baseColor.x,
            this.mdAry[t + 1] = this._baseColor.y,
            this.mdAry[t + 2] = this._baseColor.z,
            this.mdAry[t + 3] = this._roughness,
            this.mdAry[t + 4] = this._specular,
            this.mdAry[t + 5] = this._metallic,
            this.mdAry[t + 6] = this._glass);
    }
}

class Plane {
    pos;
    normal;
    size;
    _x;
    _y;
    _z;
    _sx;
    numAll;
    type;
    material;
    numAry = [];
    numOffset = 0;
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
            this.numAry[this.numOffset + 6] = this.size);
    }
}

var MaterialType;
(function (MaterialType) {
    MaterialType[MaterialType["SPHERE"] = 0] = "SPHERE";
    MaterialType[MaterialType["BOX"] = 1] = "BOX";
    MaterialType[MaterialType["PLANE"] = 2] = "PLANE";
    MaterialType[MaterialType["CAP"] = 4] = "CAP";
    MaterialType[MaterialType["CYLINDER"] = 3] = "CYLINDER";
    MaterialType[MaterialType["CAPPEDCONE"] = 5] = "CAPPEDCONE";
    MaterialType[MaterialType["RECTANGLE"] = 6] = "RECTANGLE";
})(MaterialType || (MaterialType = {}));

class Sphere {
    numAll;
    type;
    material;
    center;
    r;
    _x;
    _y;
    _z;
    _sx;
    numAry = [];
    numOffset = 0;
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
            this.numAry[this.numOffset + 3] = this.r);
    }
}

class PointLight {
    type;
    _x;
    _y;
    _z;
    numAll;
    _color;
    _radius;
    _size;
    _intensity;
    ldAry;
    numOffset;
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
            this.ldAry[this.numOffset + 8] = this._color.z);
    }
}

class AreaLight {
    type;
    _x;
    _y;
    _z;
    numAll;
    _color;
    _radius;
    _size;
    _intensity;
    ldAry;
    numOffset;
    _sx;
    _sy;
    _rx = 0;
    _ry = 0;
    _rz = 0;
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
            var vecSx = new Vector3D(0, 0, this._sx), vecSy = new Vector3D(0, this._sy, 0), mat = new Matrix;
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
                this.ldAry[this.numOffset + 13] = this._color.z;
        }
    }
}

class PathTrace {
    // 渲染相关属性
    fboArray = [];
    viewWidth = 0;
    viewHeight = 0;
    viewData;
    _hdrTexture = null;
    texReady = false;
    gl;
    // 单例模式
    static inst;
    // 场景数据
    gemoAry = [];
    lightAry = [];
    numAry = [];
    mdAry = [];
    ldAry = [];
    _materialAry = [];
    // 管理属性
    offset = 0;
    gemoAddID = 0;
    gemoDic = {};
    lightOffset = 0;
    lightAddID = 0;
    lightDic = {};
    // 渲染状态
    sdAry = [];
    setTextureNum = 0;
    setProgramNum = 0;
    _program = null;
    count = 0;
    _textureDic = {};
    dataTexture = null;
    shader = { program: null };
    static getInstance() {
        return this.inst || (this.inst = new PathTrace(), this.inst);
    }
    update(fbo) {
        if (!this.texReady) {
            return;
        }
        if (this.shader.program && this._hdrTexture) {
            this.gl.useProgram(this.shader.program);
            if (this._program !== this.shader.program) {
                this._program = this.shader.program;
            }
            this.gl.uniform3fv(this.gl.getUniformLocation(this.shader.program, "camPos"), [150, 220, -150]);
            this.gl.uniform3fv(this.gl.getUniformLocation(this.shader.program, "camUvw"), [-0.7, 0, -0.7, -0.5, 0.7, 0.5, 0.5, 0.7, -0.5]);
            this.gl.uniform3fv(this.gl.getUniformLocation(this.shader.program, "dof"), [0, 0, 300]);
            var weight = this.count / (this.count + 1);
            this.gl.uniform1fv(this.gl.getUniformLocation(this.shader.program, "weight"), [weight]);
            this.gl.uniform1fv(this.gl.getUniformLocation(this.shader.program, "time"), [Math.random()]);
            this.gl.uniform2fv(this.gl.getUniformLocation(this.shader.program, "ran"), [Math.random(), Math.random()]);
            this.gl.uniform2fv(this.gl.getUniformLocation(this.shader.program, "area"), [Math.random(), Math.random()]);
            this.gl.uniform1fv(this.gl.getUniformLocation(this.shader.program, "sd"), this.numAry);
            this.gl.uniform1fv(this.gl.getUniformLocation(this.shader.program, "ld"), this.ldAry);
            this.setRenderTexture(this.shader, "baseTexture", fbo.texture, 0);
            this.setRenderTexture(this.shader, "hdrTexture", this._hdrTexture, 1);
            this.setRenderTexture(this.shader, "dataTexture", this.dataTexture, 2);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.viewData.vertexBuffer);
            this.gl.enableVertexAttribArray(0);
            this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.viewData.indexBuffer);
            this.gl.drawElements(this.gl.TRIANGLES, this.viewData.treNum, 5123, 0);
            this.count++;
        }
    }
    setRenderTexture(shader, id, tex, index) {
        if (this.testTexture(id, tex)) {
            return;
        }
        switch (index) {
            case 0:
                this.gl.activeTexture(this.gl.TEXTURE0);
                break;
            case 1:
                this.gl.activeTexture(this.gl.TEXTURE1);
                break;
            case 2:
                this.gl.activeTexture(this.gl.TEXTURE2);
                break;
            case 3:
                this.gl.activeTexture(this.gl.TEXTURE3);
                break;
            case 4:
                this.gl.activeTexture(this.gl.TEXTURE4);
                break;
            case 5:
                this.gl.activeTexture(this.gl.TEXTURE5);
                break;
            case 6:
                this.gl.activeTexture(this.gl.TEXTURE6);
                break;
        }
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.uniform1i(this.gl.getUniformLocation(shader.program, id), index);
        this.setTextureNum++;
    }
    testTexture(id, tex) {
        if (this._textureDic[id] == tex) {
            return true;
        }
        this._textureDic[id] = tex;
        return false;
    }
    initDataTexture(gl) {
        this.gemoAry = new Array,
            this.lightAry = new Array,
            this.numAry = new Array,
            this.mdAry = new Array,
            this.ldAry = new Array,
            this.lightOffset = 0,
            this.lightAddID = 0,
            this.offset = 0,
            this.gemoAddID = 0,
            this._materialAry = [],
            this._materialAry.push(new MaterialInfo(new Vector3D(1, 1, 1), 1, 1, 0), new MaterialInfo(new Vector3D(1, 0, 0), 1, 0, 0), new MaterialInfo(new Vector3D(0, 1, 0), 1, 0, 0), new MaterialInfo(new Vector3D(3, 3, 3), .1, 1, 0), new MaterialInfo(new Vector3D(0, 1, 0), .2, 1, 0), new MaterialInfo(new Vector3D(1, 1, 1), .1, 1, 1), new MaterialInfo(new Vector3D(1, .71, .29), .3, 1, 1), new MaterialInfo(new Vector3D(.95, .93, .88), .3, 1, 1), new MaterialInfo(new Vector3D(.95, .64, .54), .05, 1, 1), new MaterialInfo(new Vector3D(1, 1, 1), 1, 0, 0), new MaterialInfo(new Vector3D(1, 1, 1), 1, 1, 0, 2), new MaterialInfo(new Vector3D(1, 1, 1), 1, 1, 0, 0), new MaterialInfo(new Vector3D(1, 1, 1), 1, 1, 0, -1, 1.5));
        const plane = new Plane(new Vector3D(0, 0, 0), new Vector3D(0, 1, 0), 200, MaterialType.PLANE, this._materialAry[11]);
        this.addGemo(plane);
        this.addGemo(new Sphere(new Vector3D(0, 30, 0), 30, MaterialType.SPHERE, this._materialAry[0]));
        this.addGemo(new Sphere(new Vector3D(-90, 20, 0), 20, MaterialType.SPHERE, this._materialAry[6]));
        this.addGemo(new Sphere(new Vector3D(0, 30, 80), 30, MaterialType.SPHERE, this._materialAry[6]));
        this.addGemo(new Sphere(new Vector3D(-80, 20, -70), 20, MaterialType.SPHERE, this._materialAry[6]));
        const light1 = new PointLight(new Vector3D(10 * Math.random() - 50, 100 + 10 * Math.random(), 50 + 10 * Math.random()), new Vector3D(1, 1, 1), 50, 8, 100);
        const light2 = new AreaLight(new Vector3D(150, 0, -100), new Vector3D(1, 1, 1), 200, 20, 20, 100);
        this.addLight(light1);
        this.addLight(light2);
        this.texReady = true;
    }
    addLight(light) {
        light.ldAry = this.ldAry,
            light.numOffset = this.lightOffset,
            this.lightOffset += light.numAll,
            light.applyAry(),
            light.id = this.lightAddID++,
            light.lightID = this.lightAry.length,
            this.lightAry.push(light),
            this.lightDic[light.name] = light;
    }
    addGemo(gemo) {
        gemo.numAry = this.numAry;
        gemo.numOffset = this.offset;
        this.offset += gemo.numAll,
            gemo.applyAry(),
            gemo.material.mdAry = this.mdAry,
            gemo.materialID = gemo.material.id = this.gemoAry.length,
            gemo.material.applyAry(),
            gemo.id = this.gemoAddID++,
            this.gemoAry.push(gemo);
        this.gemoDic[`${gemo.type}${gemo.id}`] = gemo;
    }
    addGemos(arr = []) {
        for (let i = 0; i < arr.length; i++) {
            this.addGemo(arr[i]);
        }
    }
    async initBufferData(gl) {
        this.gl = gl;
        this.viewData = {
            vertices: [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0],
            uvs: [0, 0, 0, 1, 1, 1, 1, 0],
            indexs: [0, 1, 2, 0, 2, 3],
            treNum: 6,
        };
        this.viewData.vertexBuffer = this.bindBuffer(gl, this.viewData.vertices);
        this.viewData.uvBuffer = this.bindBuffer(gl, this.viewData.uvs);
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.viewData.indexs), gl.STATIC_DRAW);
        this.viewData.indexBuffer = indexBuffer;
        const res = await Promise.all([this.setTexture("./img/hdr_079.png"), this.setTexture("./img/tex.jpg")]);
        if (res) {
            this._hdrTexture = res[0];
            this.dataTexture = res[1];
        }
    }
    async setTexture(url, wrap = 0, filter = 0, mipMap = 0) {
        if (this._textureDic[url]) {
            return this._textureDic[url];
        }
        const img = await AssetManager.getInstance().load(url);
        const gl = this.gl;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        const magFilter = 0 == filter ? gl.LINEAR : gl.NEAREST;
        let minFilter = gl.LINEAR;
        if (0 == filter) {
            switch (mipMap) {
                case 0:
                    minFilter = gl.LINEAR;
                    break;
                case 1:
                    minFilter = gl.LINEAR_MIPMAP_LINEAR;
                    break;
                case 2:
                    minFilter = gl.LINEAR_MIPMAP_NEAREST;
                    break;
            }
        }
        else {
            switch (mipMap) {
                case 0:
                    minFilter = gl.NEAREST;
                    break;
                case 1:
                    minFilter = gl.NEAREST_MIPMAP_LINEAR;
                    break;
                case 2:
                    minFilter = gl.NEAREST_MIPMAP_NEAREST;
                    break;
            }
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        if (wrap === 0) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        if (mipMap !== 0) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        this._textureDic[url] = tex;
        return tex;
    }
    bindBuffer(gl, arr) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
        return buffer;
    }
    initArrayBufferForLaterUse(gl, data, num, type) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        // 保留以后分配给属性变量所需的信息
        buffer.num = num;
        buffer.type = type;
        return buffer;
    }
    initElementArrayBufferForLaterUse(gl, data, type) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        buffer.type = type;
        return buffer;
    }
}

class ShaderBase {
    program;
    vShader;
    vertexShader;
    fragmentShader;
    fShader;
    bindLocation;
    initShader;
    constructor(vertexShader, fragmentShader) {
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }
    attachShader(gl) {
        if (!this.vertexShader || !this.fragmentShader) {
            console.error('no vertexShader or fragmentShader');
            return;
        }
        this.program = gl.createProgram();
        this.vShader = gl.createShader(gl.VERTEX_SHADER);
        this.fShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.vShader, this.vertexShader);
        gl.shaderSource(this.fShader, this.fragmentShader);
        gl.compileShader(this.vShader);
        this.checkCompile(gl, this.vShader);
        gl.compileShader(this.fShader);
        this.checkCompile(gl, this.fShader);
        gl.attachShader(this.program, this.vShader);
        gl.attachShader(this.program, this.fShader);
        return this.program;
    }
    checkCompile(gl, shader) {
        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled || gl.isContextLost()) {
            const err = gl.getShaderInfoLog(shader);
            console.error('compile shader error', err);
            //gl.deleteShader(shader);
        }
    }
}

const vertexShader$1 = `attribute vec3 v3Pos;

varying vec2 vPosition;//位置
void main(void){
    vec4 vt0= vec4(v3Pos, 1.0);
    vPosition = vec2(v3Pos.x,v3Pos.y);
    gl_Position = vt0;
}
`;
const fragmentShader0 = `precision highp float;

uniform vec3 camPos;
uniform vec3 camUvw[3];
uniform vec3 dof;

uniform float weight;
uniform float time;
uniform vec2 ran;
uniform vec2 area;
uniform float sd[400];
uniform float ld[60];
uniform sampler2D baseTexture;
uniform sampler2D hdrTexture;
uniform sampler2D dataTexture;

varying vec2 vPosition;//位置

#define saturate(x) clamp(x, 0.0, 1.0)
#define SIZE 512.0
#define DATASIZE 512.0
#define PI         3.14159265359
#define invPI     0.3183098861837697
#define invTWO_PI     0.15915494309
#define BOUND 5
#define MAX_LOOP 30

struct Ray {
    vec3 o;
    vec3 d;
    float t;
    bool isHit;
    vec3 pos;
    vec3 normal;
    int mID;
    vec4 emissive;
    vec2 uv;
};
struct Material{
    vec3 baseColor;
    float roughness;
    float specular;
    float metallic;
    float glass;
};
struct Ary2V3d{
    vec3 v0;
    vec3 v1;
};

struct Node{
    int left;
    int right;
    int leaf;
    vec3 aa;
    vec3 bb;
};

struct Tri{
    vec3 v0;
    vec3 v1;
    vec3 v2;
};

struct Gemo{
    vec3 tm;
    vec3 v0;
    vec3 v1;
    vec3 v2;
};

struct BrdfPdf{
    vec3 color;
    float pdf;
};

vec2 seed;
float rand(){
    seed -= vec2(ran.x * ran.y);
    return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 getuv(vec3 p){
    float theta = acos(p.y);
    float phi = atan(p.z, p.x);
    if (phi < 0.0) {
        phi += 2.0 * PI;
    }
    vec2 s;
    s.x = 1.0 - phi * invTWO_PI;
    s.y = theta * invPI;
    return s;
}
vec3 TangentToWorld(vec3 Vec, vec3 TangentZ){
    vec3 UpVector = vec3(1.0, 0.0, 0.0);
    if (abs(TangentZ.z) < 0.999){
        UpVector = vec3(0.0, 0.0, 1.0);
    }
    vec3 TangentX = cross(UpVector,TangentZ);
    TangentX = normalize(TangentX);
    vec3 TangentY = cross(TangentZ,TangentX);
    return TangentX*(Vec.x) + TangentY*(Vec.y) + TangentZ*(Vec.z);
}

vec3 getHdr(vec4 src)
{
    vec3 outc = vec3(1.0,1.0,1.0);
    float e = src.w * 255.0 - 128.0;
    e = pow(2.0,e);
    outc.x = src.x * e;
    outc.y = src.y * e;
    outc.z = src.z * e;
    return outc;
}

vec3 getDir(){
    float f = dof.z;
    float d = 500.0;
    vec2 p = vec2(vPosition.x*SIZE + ran.x - 0.5,vPosition.y*SIZE + ran.y - 0.5) * 0.5;
    p = p * f / d;
    //vec3 dir = camU * p.x + camV * p.y - camW * d;
    //vec3 dir = camU * (p.x-dof.x) + camV * (p.y-dof.y) - camW * f;
    vec3 dir = camUvw[0] * (p.x-dof.x) + camUvw[1] * (p.y-dof.y) - camUvw[2] * f;
    

    dir = normalize(dir);
    return dir;
}


vec3 getBoxNormal(int face_hit){
    if (face_hit == 0) 
        return (vec3(-1.0, 0.0, 0.0));    // -x face
    else if (face_hit == 1) 
        return (vec3(0.0, -1.0, 0.0));    // -y face
    else if (face_hit == 2)
        return (vec3(0.0, 0.0, -1.0));    // -z face
    else if (face_hit == 3)
        return (vec3(1.0, 0.0, 0.0));    // +x face
    else if (face_hit == 4)
        return (vec3(0.0, 1.0, 0.0));    // +y face
    else if (face_hit == 5)
        return (vec3(0.0, 0.0, 1.0));    // +z face
    else
        return vec3(0.0, 0.0, 0.0);
}

bool hitNode(Ray ray, Node node){
    vec3 aa = node.aa;
    vec3 bb = node.bb - node.aa;

    float x0 = aa.x; float x1 = aa.x + bb.x; float y0 = aa.y; float y1 = aa.y + bb.y; float z0=aa.z; float z1 = aa.z + bb.z;
    float ox = ray.o.x; float oy = ray.o.y; float oz = ray.o.z;
    float dx = ray.d.x; float dy = ray.d.y; float dz = ray.d.z;

    float tx_min, ty_min, tz_min;
    float tx_max, ty_max, tz_max;

    float a = 1.0 / dx;
    if (a >= 0.0) {
        tx_min = (x0 - ox) * a;
        tx_max = (x1 - ox) * a;
    }else {
        tx_min = (x1 - ox) * a;
        tx_max = (x0 - ox) * a;
    }

    float b = 1.0 / dy;
    if (b >= 0.0) {
        ty_min = (y0 - oy) * b;
        ty_max = (y1 - oy) * b;
    }else {
        ty_min = (y1 - oy) * b;
        ty_max = (y0 - oy) * b;
    }

    float c = 1.0 / dz;
    if (c >= 0.0) {
        tz_min = (z0 - oz) * c;
        tz_max = (z1 - oz) * c;
    }else {
        tz_min = (z1 - oz) * c;
        tz_max = (z0 - oz) * c;
    }

    float t0, t1;

    int face_in, face_out;


    if (tx_min > ty_min) {
        t0 = tx_min;
        face_in = (a >= 0.0) ? 0 : 3;
    }else {
        t0 = ty_min;
        face_in = (b >= 0.0) ? 1 : 4;
    }

    if (tz_min > t0) {
        t0 = tz_min;
        face_in = (c >= 0.0) ? 2 : 5;
    }

    // find smallest exiting t value
    if (tx_max < ty_max) {
        t1 = tx_max;
        face_out = (a >= 0.0) ? 3 : 0;
    }else {
        t1 = ty_max;
        face_out = (b >= 0.0) ? 4 : 1;
    }

    if (tz_max < t1) {
        t1 = tz_max;
        face_out = (c >= 0.0) ? 5 : 2;
    }

    if (t0 < t1 && t1 > 0.0) {  // condition for a hit
        if (t0 > 0.0) {
            if(t0 < ray.t ){
                return true;
            }
        } else {
            if(t0 < ray.t ){
                return true;
            }
        }
    }
    return false;

}

void intersectBox(inout Ray ray, vec3 aa,vec3 bb,int mID){
    float x0 = aa.x; float x1 = aa.x + bb.x; float y0 = aa.y; float y1 = aa.y + bb.y; float z0=aa.z; float z1 = aa.z + bb.z;
    float ox = ray.o.x; float oy = ray.o.y; float oz = ray.o.z;
    float dx = ray.d.x; float dy = ray.d.y; float dz = ray.d.z;

    float tx_min, ty_min, tz_min;
    float tx_max, ty_max, tz_max;

    float a = 1.0 / dx;
    if (a >= 0.0) {
        tx_min = (x0 - ox) * a;
        tx_max = (x1 - ox) * a;
    }else {
        tx_min = (x1 - ox) * a;
        tx_max = (x0 - ox) * a;
    }

    float b = 1.0 / dy;
    if (b >= 0.0) {
        ty_min = (y0 - oy) * b;
        ty_max = (y1 - oy) * b;
    }else {
        ty_min = (y1 - oy) * b;
        ty_max = (y0 - oy) * b;
    }

    float c = 1.0 / dz;
    if (c >= 0.0) {
        tz_min = (z0 - oz) * c;
        tz_max = (z1 - oz) * c;
    }else {
        tz_min = (z1 - oz) * c;
        tz_max = (z0 - oz) * c;
    }

    float t0, t1;

    int face_in, face_out;


    if (tx_min > ty_min) {
        t0 = tx_min;
        face_in = (a >= 0.0) ? 0 : 3;
    }else {
        t0 = ty_min;
        face_in = (b >= 0.0) ? 1 : 4;
    }

    if (tz_min > t0) {
        t0 = tz_min;
        face_in = (c >= 0.0) ? 2 : 5;
    }

    // find smallest exiting t value
    if (tx_max < ty_max) {
        t1 = tx_max;
        face_out = (a >= 0.0) ? 3 : 0;
    }else {
        t1 = ty_max;
        face_out = (b >= 0.0) ? 4 : 1;
    }

    if (tz_max < t1) {
        t1 = tz_max;
        face_out = (c >= 0.0) ? 5 : 2;
    }

    if (t0 < t1 && t1 > 0.0) {  // condition for a hit
        if (t0 > 0.0) {
            if(t0 < ray.t ){
                ray.isHit = true;
                ray.t = t0;
                ray.pos = ray.o + ray.d * t0;
                ray.normal = getBoxNormal(face_in);
                ray.mID = mID;
            }
        } else {
            if(t0 < ray.t ){
                ray.isHit = true;
                ray.t = t1;
                ray.pos = ray.o + ray.d * t1;
                ray.normal = getBoxNormal(face_out);
                ray.mID = mID;
            }
        }
    }

}


bool intersectSphere(inout Ray ray, vec3 sphereCenter, float sphereRadius,int mID) {
    vec3 toSphere = ray.o - sphereCenter;
    float a = dot(ray.d, ray.d);
    float b = 2.0 * dot(toSphere, ray.d);
    float c = dot(toSphere, toSphere) - sphereRadius*sphereRadius;
    float discriminant = b*b - 4.0*a*c;

    if(discriminant > 0.0) {
        float t = (-b - sqrt(discriminant)) / (2.0 * a);
        if(t > 0.0 && t < ray.t){
            ray.isHit = true;
            ray.t = t;
            ray.pos = ray.o + ray.d * t;
            ray.normal = normalize(ray.pos - sphereCenter);
            ray.mID = mID;
            ray.uv = getuv(ray.normal);

            return true;
        }
    }
    return false;
}

void intersectPlane(inout Ray ray,vec3 a,vec3 n,float size,int mID){
    if(dot(ray.d,n) > 0.0){
        return;
    }
    float t = dot(a - ray.o,n) / dot(ray.d,n);
    if (t > 0.0 && t < ray.t) {
        vec3 pos = ray.o + ray.d * t;
        if(abs(pos.x - a.x) > size || abs(pos.y - a.y) > size || abs(pos.z - a.z) > size ){
            return;
        }

        ray.isHit = true;
        ray.t = t;
        ray.normal = n;
        ray.pos = ray.o + ray.d * t;
        ray.mID = mID;
        ray.uv = vec2(1.0-(pos.x - a.x)/size,(pos.z - a.z)/size)*2.0;
    }
}
bool intersectRectangle3D(inout Ray ray,vec3 p0,vec3 a, vec3 b, int mID){
    vec3 normal = normalize(cross(a,b));
    float t = dot((p0 - ray.o),normal) / dot(ray.d,normal);

    if (t <= 0.0001)
        return false;

    vec3 p = ray.o + t * ray.d;
    vec3 d = p - p0;

    float ddota = dot(d,a);

    float a_len_squared = dot(a,a);
    float b_len_squared = dot(b,b);

    if (ddota < 0.0 || ddota > a_len_squared)
        return false;

    float ddotb = dot(d,b);

    if (ddotb < 0.0 || ddotb > b_len_squared)
        return false;

    if (t > 0.0 && t < ray.t) {
        ray.isHit = true;
        ray.t = t;
        ray.normal = normal;
        ray.pos = ray.o + ray.d * t;
        ray.mID = mID;
        
        vec3 n = cross( b, a );
        vec3 q = cross( ray.d, p0-ray.o );
        
        float i = 1.0/ dot(ray.d,n);
        
        float u = dot( q, a )*i;
        float v = dot( q, b )*i;

        ray.uv = vec2(u,v);

        return true;
    }
    return false;
}

mat4 rotationAxisAngle( vec3 v, float angle ){
    float s = sin( angle );
    float c = cos( angle );
    float ic = 1.0 - c;

    return mat4( v.x*v.x*ic + c,     v.y*v.x*ic - s*v.z, v.z*v.x*ic + s*v.y, 0.0,
                 v.x*v.y*ic + s*v.z, v.y*v.y*ic + c,     v.z*v.y*ic - s*v.x, 0.0,
                 v.x*v.z*ic - s*v.y, v.y*v.z*ic + s*v.x, v.z*v.z*ic + c,     0.0,
                 0.0,                0.0,                0.0,                1.0 );
}

mat4 translate( float x, float y, float z ){
    return mat4( 1.0, 0.0, 0.0, 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 0.0, 0.0, 1.0, 0.0,
                 x,   y,   z,   1.0 );
}
mat4 inverse( in mat4 m ){
    return mat4(
        m[0][0], m[1][0], m[2][0], 0.0,
        m[0][1], m[1][1], m[2][1], 0.0,
        m[0][2], m[1][2], m[2][2], 0.0,
        -dot(m[0].xyz,m[3].xyz),
        -dot(m[1].xyz,m[3].xyz),
        -dot(m[2].xyz,m[3].xyz),
        1.0 );
}
/*射线，大小，旋转，位置*/
void intersectObb(inout Ray ray,vec3 rad,vec4 rotation,vec3 pos,int mID) {
    
    mat4 rot = rotationAxisAngle( normalize(rotation.xyz), rotation.w );
    mat4 tra = translate( pos.x, pos.y, pos.z );
    mat4 txi = tra * rot; 
    mat4 txx = inverse( txi );

    // convert from ray to box space
    vec3 rdd = (txx*vec4(ray.d,0.0)).xyz;
    vec3 roo = (txx*vec4(ray.o,1.0)).xyz;

    // ray-box intersection in box space
    vec3 m = 1.0/rdd;
    vec3 n = m*roo;
    vec3 k = abs(m)*rad;
    
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;

    float tN = max( max( t1.x, t1.y ), t1.z );
    float tF = min( min( t2.x, t2.y ), t2.z );
    
    if( tN > tF || tF < 0.0) 
        return;
    

    vec3 nor = -sign(rdd)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);

    if(tN <= 0.0){
        return;
    }
    // convert to ray space
    nor = (txi * vec4(nor,0.0)).xyz;

    

    if (tN < ray.t) {
        ray.isHit = true;
        ray.t = tN;
        ray.normal = nor;
        ray.pos = ray.o + ray.d * tN;
        ray.mID = mID;

        vec3 opos = (txx*vec4(ray.pos,1.0)).xyz;
		vec3 onor = (txx*vec4(nor,0.0)).xyz;

        if(abs(onor.x) > 0.1){
            ray.uv = 0.025*opos.yz + 0.5;
        }else if(abs(onor.y) > 0.1){
            ray.uv = 0.025*opos.zx + 0.5;
        }else if(abs(onor.z) > 0.1){
            ray.uv = 0.025*opos.xy + 0.5;
        }
    }
}

void intersectCylinder(inout Ray ray, vec3 pa, vec3 pb, float ra ,int mID){
    vec3 ro = ray.o;
    vec3 rd = ray.d; 
    vec3 ba = pb-pa;

    vec3  oc = ro - pa;

    float baba = dot(ba,ba);
    float bard = dot(ba,rd);
    float baoc = dot(ba,oc);
    
    float k2 = baba            - bard*bard;
    float k1 = baba*dot(oc,rd) - baoc*bard;
    float k0 = baba*dot(oc,oc) - baoc*baoc - ra*ra*baba;
    
    float h = k1*k1 - k2*k0;

    if( h < 0.0 ) {
        return;
    }

    h = sqrt(h);
    float t = (-k1-h)/k2;

    // body
    
    float y = baoc + t*bard;
    
    if(t > 0.0 && y>0.0 && y<baba && t < ray.t){
        ray.isHit = true;
        ray.t = t;
        ray.normal = (oc+t*rd - ba*y/baba)/ra;
        ray.pos = ray.o + ray.d * t;
        ray.mID = mID;
        //ray.uv = getuv(ray.normal);
        ray.uv.x = y / baba;
        vec3 base = TangentToWorld(vec3(1.0,0.0,0.0),normalize(ba));
        ray.uv.y = acos(dot(base,ray.normal)) / PI;
        return;
    } 
    
    // caps
    t = ( ((y<0.0) ? 0.0 : baba) - baoc)/bard;
    if(t > 0.0 && abs(k1+k2*t)<h && t < ray.t){
        ray.isHit = true;
        ray.t = t;
        ray.normal = normalize(ba*sign(y)/baba);
        ray.pos = ray.o + ray.d * t;
        ray.mID = mID;
        vec3 base = TangentToWorld(vec3(1.0,0.0,0.0),ray.normal);
        if(y > 0.0){
            vec3 pp = (ray.pos-pb)/ra;
            float ps = length(pp);
            float ss = dot(pp,base);
            ray.uv = vec2(ss,sqrt(ps * ps - ss * ss));
        }else{
            vec3 pp = (ray.pos-pa)/ra;
            float ps = length(pp);
            float ss = dot(pp,base);
            ray.uv = vec2(ss,sqrt(ps * ps - ss * ss));
        }
        
    }

}

// compute normal
vec3 capNormal( in vec3 pos, in vec3 a, in vec3 b, in float r )
{
    vec3  ba = b - a;
    vec3  pa = pos - a;
    float h = clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
    return normalize((pa - h*ba)/r);
}

void intersectCap(inout Ray ray, vec3 pa, vec3 pb, float r ,int mID)
{
    vec3 ro = ray.o;
    vec3 rd = ray.d; 

    vec3  ba = pb - pa;
    vec3  oa = ro - pa;

    float baba = dot(ba,ba);
    float bard = dot(ba,rd);
    float baoa = dot(ba,oa);
    float rdoa = dot(rd,oa);
    float oaoa = dot(oa,oa);

    float a = baba      - bard*bard;
    float b = baba*rdoa - baoa*bard;
    float c = baba*oaoa - baoa*baoa - r*r*baba;
    float h = b*b - a*c;
    if( h>=0.0 )
    {
        float t = (-b-sqrt(h))/a;

        float y = baoa + t*bard;
        
        // body
        if( y>0.0 && y<baba && t > 0.0 && t < ray.t){
            ray.isHit = true;
            ray.t = t;
            ray.pos = ray.o + ray.d * t;
            ray.normal = capNormal(ray.pos,pa,pb,t);
            ray.mID = mID;
            ray.uv.x = y / baba;
            vec3 base = TangentToWorld(vec3(1.0,0.0,0.0),normalize(ba));
            ray.uv.y = acos(dot(base,ray.normal)) / PI;
            return;
        } 

        // caps
        vec3 oc = (y<=0.0) ? oa : ro - pb;
        b = dot(rd,oc);
        c = dot(oc,oc) - r*r;
        h = b*b - c;
        t = -b - sqrt(h);
        if( h>0.0 && t > 0.0 && t < ray.t){
            ray.isHit = true;
            ray.t = t;
            ray.pos = ray.o + ray.d * t;
            ray.normal = capNormal(ray.pos,pa,pb,t);
            ray.mID = mID;
            //ray.uv = getuv(TangentToWorld(ray.normal,-normalize(ba)));
            ray.uv = getuv(ray.normal);
        }
    }
}
float dot2( in vec3 v ) { return dot(v,v); }
void intersectCappedCone( inout Ray ray, vec3  pa, vec3  pb, float ra, float rb,int mID ){
    vec3 ro = ray.o;
    vec3 rd = ray.d; 

    vec3  ba = pb - pa;
    vec3  oa = ro - pa;
    vec3  ob = ro - pb;
    
    float baba = dot(ba,ba);
    float rdba = dot(rd,ba);
    float oaba = dot(oa,ba);
    float obba = dot(ob,ba);
    
    float t = 0.0;
    //caps
    if( oaba<0.0 )
    {
        // example of delayed division
        t = -oaba/rdba;
        if( dot2(oa*rdba-rd*oaba)<(ra*ra*rdba*rdba) && t > 0.0 && t < ray.t )
        {
            ray.isHit = true;
            ray.t = t;
            ray.pos = ray.o + ray.d * t;
            ray.normal = normalize(-ba*inversesqrt(baba));
            ray.mID = mID;

            vec3 base = TangentToWorld(vec3(1.0,0.0,0.0),ray.normal);
            vec3 pp = (ray.pos-pa)/ra;
            float ps = length(pp);
            float ss = dot(pp,base);
            ray.uv = vec2(ss,sqrt(ps * ps - ss * ss));
            return;// vec4(-oaba/rdba,-ba*inversesqrt(baba));
        }
    }
    else if( obba>0.0 )
    {
        // example of NOT delayed division
        t =-obba/rdba;
        if( dot2(ob+rd*t)<(rb*rb) && t > 0.0 && t < ray.t)
        {
            ray.isHit = true;
            ray.t = t;
            ray.pos = ray.o + ray.d * t;
            ray.normal = normalize(ba*inversesqrt(baba));
            ray.mID = mID;

            
            return;// vec4(t,ba*inversesqrt(baba));
        }
    }
    
    
    // body
    float rr = rb - ra;
    float hy = baba + rr*rr;
    vec3  oc = oa*rb - ob*ra;
    
    float ocba = dot(oc,ba);
    float ocrd = dot(oc,rd);
    float ococ = dot(oc,oc);
    
    float k2 = baba*baba      - hy*rdba*rdba; // the gap is rdrd which is 1.0
    float k1 = baba*baba*ocrd - hy*rdba*ocba;
    float k0 = baba*baba*ococ - hy*ocba*ocba;

    float h = k1*k1 - k2*k0;
    if( h<0.0 ) return;

    t = (-k1-sign(rr)*sqrt(h))/(k2*rr);
    
    float y = oaba + t*rdba;
    if( y>0.0 && y<baba && t > 0.0 && t < ray.t ) 
    {
        ray.isHit = true;
        ray.t = t;
        ray.pos = ray.o + ray.d * t;
        ray.normal = normalize(baba*(baba*(oa+t*rd)-rr*ba*ra)-ba*hy*y);
        ray.mID = mID;
        ray.uv.x = y / baba;
        vec3 base = TangentToWorld(vec3(1.0,0.0,0.0),normalize(ba));
        ray.uv.y = acos(dot(base,ray.normal)) / PI;
        return;
    }
    
}


void hitTri(inout Ray ray,Tri tri,int mID){
    float a = tri.v0.x - tri.v1.x, b = tri.v0.x - tri.v2.x, c = ray.d.x, d = tri.v0.x - ray.o.x;
    float e = tri.v0.y - tri.v1.y, f = tri.v0.y - tri.v2.y, g = ray.d.y, h = tri.v0.y - ray.o.y;
    float i = tri.v0.z - tri.v1.z, j = tri.v0.z - tri.v2.z, k = ray.d.z, l = tri.v0.z - ray.o.z;

    float m = f * k - g * j, n = h * k - g * l, p = f * l - h * j;
    float q = g * i - e * k, s = e * j - f * i;

    float inv_denom = 1.0 / (a * m + b * q + c * s);

    float e1 = d * m - b * n - c * p;
    float beta = e1 * inv_denom;

    if (beta < 0.0){
        return;
    }

    float r = e * l - h * i;
    float e2 = a * n + d * q + c * r;
    float gamma = e2 * inv_denom;

    if (gamma < 0.0){
        return;
    }
    if (beta + gamma > 1.0){
        return;
    }
    float e3 = a * p - b * r + d * s;
    float t = e3 * inv_denom;

    if (t < 0.0001){
        return;
    } 

    if (ray.t > t)
    {
        ray.isHit = true;
        ray.t = t;
        ray.pos = ray.o + ray.d * t;
        ray.normal = -normalize(cross( tri.v1-tri.v0, tri.v2-tri.v0 ));
        ray.mID = mID;
    }

}

void intersectTri( inout Ray ray, vec3 v0, vec3 v1, vec3 v2 ,int mID){
    vec3 ro = ray.o;
    vec3 rd = ray.d; 

    vec3 v1v0 = v1 - v0;
    vec3 v2v0 = v2 - v0;
    vec3 rov0 = ro - v0;

    vec3  n = cross( v1v0, v2v0 );
    vec3  q = cross( rov0, rd );
    float d = 1.0/dot( rd, n );
    float u = d*dot( -q, v2v0 );
    float v = d*dot(  q, v1v0 );
    float t = d*dot( -n, rov0 );


    if( u<0.0 || u>1.0 || v<0.0 || (u+v)>1.0 ) 
        return;

    if(t > 0.0 && t < ray.t ) {
        ray.isHit = true;
        ray.t = t;
        ray.pos = ray.o + ray.d * t;
        ray.normal = -normalize(n);
        ray.mID = mID;
    }
    
}




float random(vec3 scale, float seed) {
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}
vec3 cosineWeightedDirection(float seed, vec3 normal) {
    float u = random(vec3(12.9898, 78.233, 151.7182), seed);
    float v = random(vec3(63.7264, 10.873, 623.6736), seed);
    float r = sqrt(u);
    float angle = 6.283185307179586 * v;
    vec3 sdir, tdir;
    if (abs(normal.x)<.5) {
        sdir = cross(normal, vec3(1,0,0));
    }else {
        sdir = cross(normal, vec3(0,1,0));
    }
    tdir = cross(normal, sdir);
    return r*cos(angle)*sdir + r*sin(angle)*tdir + sqrt(1.-u)*normal;
}
vec3 uniformlyRandomDirection(float seed) {
    float u = random(vec3(12.9898, 78.233, 151.7182), seed);
    float v = random(vec3(63.7264, 10.873, 623.6736), seed);
    float z = 1.0 - 2.0 * u;
    float r = sqrt(1.0 - z * z);
    float angle = 6.283185307179586 * v;
    return vec3(r * cos(angle), r * sin(angle), z);
}
vec3 uniformlyRandomVector(float seed) {
    return uniformlyRandomDirection(seed) * sqrt(random(vec3(36.7539, 50.3658, 306.2759), seed));
}


vec3 CosineSampleHemisphere(float u1, float u2){
    vec3 dir;
    float r = sqrt(u1);
    float phi = 2.0 * PI * u2;
    dir.x = r * cos(phi);
    dir.y = r * sin(phi);
    dir.z = sqrt(max(0.0, 1.0 - dir.x*dir.x - dir.y*dir.y));

    return dir;
}


vec3 ImportanceSampleGGX(float Roughness,vec3 N,vec2 E) {

    // float u = random(vec3(12.9898, 78.233, 151.7182), seed.x);
    // float v = random(vec3(63.7264, 10.873, 623.6736), seed.y);
    // vec2 E = vec2(u,v);

    float m = Roughness * Roughness;
    float m2 = m * m;

    float Phi = 2.0 * PI * E.x;
    float CosTheta = sqrt((1.0 - E.y) / (1.0 + (m2 - 1.0) * E.y));
    float SinTheta = sqrt(1.0 - CosTheta * CosTheta);

    vec3 H = vec3(0.0, 0.0, 0.0);
    H.x = SinTheta * cos(Phi);
    H.y = SinTheta * sin(Phi);
    H.z = CosTheta;

    return normalize(TangentToWorld(vec3(H.x, H.y, H.z),N));
}

float SchlickFresnel(float u)
{
    float m = clamp(1.0 - u, 0.0, 1.0);
    float m2 = m * m;
    return m2 * m2*m; // pow(m,5)
}

vec4 GlassDir(vec3 N,float galss,vec3 d){
    vec3 ffnormal = dot(N, d) <= 0.0 ? N : N * -1.0;
    float n1 = 1.0;
    float n2 = galss;
    float R0 = (n1 - n2) / (n1 + n2);
    R0 *= R0;
    float theta = dot(-d, ffnormal);
    float prob =  R0 + (1.0 - R0) * SchlickFresnel(theta);
    vec3 dir;


    float eta = dot(N, ffnormal) > 0.0 ? (n1 / n2) : (n2 / n1);
    vec3 transDir = normalize(refract(d, ffnormal, eta));
    float cos2t = 1.0 - eta * eta * (1.0 - theta * theta);


    if (cos2t < 0.0 || rand() < prob) // Reflection
    {
        dir = normalize(reflect(d, ffnormal));
    }
    else
    {
        dir = transDir;
        //dir = ImportanceSampleGGX(0.3,dir,vec2(rand(),rand()));
    }
    
    return vec4(dir,2.0);
}

vec4 SampleDir(vec3 N,vec3 V, float Roughness,float Metallic,vec2 seed){

    float u = random(vec3(12.9898, 78.233, 151.7182), seed.x);
    float v = random(vec3(63.7264, 10.873, 623.6736), seed.y);
    vec2 E = vec2(u,v);

    vec3 dir;

    float probability = rand();
    float diffuseRatio = 0.5 * (1.0 - Metallic);


    vec3 UpVector = abs(N.z) < 0.999 ? vec3(0, 0, 1) : vec3(1, 0, 0);
    vec3 TangentX = normalize(cross(UpVector, N));
    vec3 TangentY = cross(N, TangentX);

    float type = 0.0;
    if (probability < diffuseRatio){ // sample diffuse
        dir = CosineSampleHemisphere(E.x, E.y);
        dir = TangentX * dir.x + TangentY * dir.y + N * dir.z;
        dir = normalize(dir);
        type = 0.0;
    }else{
        dir = ImportanceSampleGGX(Roughness,V,E);
        type = 1.0;
    }
    return vec4(dir,type);
}


vec3 getData(int i,int j){
    float off = 0.5/256.0;
    return texture2D(dataTexture,vec2(off + float(i)/256.0,off+float(j)/256.0)).xyz;
}
vec3 getDataById(int id){
    float ox = fract(float(id) / DATASIZE);
    float oy = floor(float(id) / DATASIZE)/DATASIZE;
    float off = 0.5/DATASIZE;
    return texture2D(dataTexture,vec2(off + ox,off+oy)).xyz;
}
Node getNodeByID(int id){
    Node node;

    vec3 info = getDataById(200*512 + id*3);
    node.left = int(info.x);
    node.right = int(info.y);
    node.leaf = int(info.z);

    node.aa = getDataById(200*512 + id*3 + 1);
    node.bb = getDataById(200*512 + id*3 + 2);
    
    return node;
}

Tri getTriByID(int id){
    Tri tri;
    tri.v0 = getDataById(300*512 + id*3);
    tri.v1 = getDataById(300*512 + id*3 + 1);
    tri.v2 = getDataById(300*512 + id*3 + 2);
    return tri;
}

int getArrayIdx(inout int stackAry[MAX_LOOP],int idx){
    for(int i = 0;i < MAX_LOOP;i++){
        if(i == idx){
            return stackAry[i];
        }
    }
    return -1;
}

void setArrayIdx(inout int stackAry[MAX_LOOP],int idx,int val){
    for(int i = 0;i < MAX_LOOP;i++){
        if(i == idx){
            stackAry[i] = val;
            return;
        }
    }
    
}


void testKDScene(inout Ray ray){
    int stackAry[MAX_LOOP];
    stackAry[0] = 0;

    int stackPtr = 1;

    for(int i = 0;i < MAX_LOOP;i++){
        if(stackPtr <= 0){
            break;
        }
        stackPtr--;
        Node fn = getNodeByID(getArrayIdx(stackAry,stackPtr));
        //Node fn = getNodeByID(stackAry[stackPtr]);
        if (hitNode(ray,fn)){
            if (fn.left > 0 && fn.right > 0){
                //stackAry[stackPtr] = fn.left;
                setArrayIdx(stackAry,stackPtr,fn.left);
                stackPtr++;
                //stackAry[stackPtr] = fn.right;
                setArrayIdx(stackAry,stackPtr,fn.right);
                stackPtr++;
            }else if (fn.leaf > 0){
                Tri tri = getTriByID(fn.leaf);
                //intersectTri(ray, tri.v0,tri.v1,tri.v2,0);
                hitTri(ray,tri,0);
            }
        }
    }
    
    return;
}
Gemo getGemoByTexture(int mID){
    Gemo m;
    m.tm = getDataById(100*512 + mID*4);
    m.v0 = getDataById(100*512 + mID*4 + 1);
    m.v1 = getDataById(100*512 + mID*4 + 2);
    m.v2 = getDataById(100*512 + mID*4 + 3);
    return m;
}

void testTextureScene(inout Ray ray){
    for(int i=0;i<30;i++){
        Gemo m = getGemoByTexture(i);
        if(int(m.tm.x) == 0){
            intersectSphere(ray, m.v0, m.v1.x,int(m.tm.y));
        }else if(int(m.tm.x) == 1){
            intersectPlane(ray, m.v0, m.v1,m.v2.x,int(m.tm.y));
        }else if(int(m.tm.x) == 2){
            intersectObb(ray,m.v2,vec4(m.v1,m.tm.z),m.v0,int(m.tm.y));
        }else if(int(m.tm.x) == 3){
            intersectCap(ray,m.v0,m.v1,m.v2.x,int(m.tm.y));
        }else if(int(m.tm.x) == 4){
            intersectCylinder(ray,m.v0,m.v1,m.v2.x,int(m.tm.y));
        }else if(int(m.tm.x) == 5){
            intersectCappedCone(ray,m.v0,m.v1,m.v2.x,m.v2.y,int(m.tm.y));
        }else{
            break;
        }
    }
}




void testLightSphere(inout Ray ray,vec3 pos,float lightsize,float intensity,vec3 color){
    if(intersectSphere(ray,pos,lightsize,-1)){
        float t = ray.t;
        float area = 4.0 * PI * lightsize * lightsize;
        float pdf = (t * t) / area;
        ray.emissive = vec4(color*intensity,pdf);
    }

}
void testLightArea(inout Ray ray,vec3 pos,vec3 dirA,vec3 dirB,float intensity,vec3 color){
    //intersectRectangle3D(inout Ray ray,vec3 p0,vec3 a, vec3 b, int mID){
    if(intersectRectangle3D(ray,pos,dirA,dirB,-1)){
        vec3 n = normalize(cross(dirA,dirB));
        float area = length(cross(dirA,dirB));
        float t = ray.t;
        float pdf = 1000000.0;
        if(dot(n,normalize(ray.d)) > 0.0){
            pdf = (t * t) / (area * abs(dot(n,normalize(ray.d))));
        }
        ray.emissive = vec4(color*intensity,pdf);
    }
    
}

void testLight(inout Ray ray){
    testLightSphere(ray,vec3(ld[0],ld[1],ld[2]),ld[3],ld[5],vec3(ld[6],ld[7],ld[8]));
    testLightArea(ray,vec3(ld[9],ld[10],ld[11]),vec3(ld[12],ld[13],ld[14]),vec3(ld[15],ld[16],ld[17]),ld[19],vec3(ld[20],ld[21],ld[22]));
    }

void testBaseScene(inout Ray ray){
    intersectPlane(ray, vec3(sd[0],sd[1],sd[2]), vec3(sd[3],sd[4],sd[5]),sd[6],0);
    intersectSphere(ray,vec3(sd[7],sd[8],sd[9]), sd[10], 3);
    intersectSphere(ray,vec3(sd[11],sd[12],sd[13]), sd[14], 3);
    intersectSphere(ray,vec3(sd[15],sd[16],sd[17]), sd[18], 5);
    intersectSphere(ray,vec3(sd[19],sd[20],sd[21]), sd[22], 8);
    intersectObb(ray,vec3(20.0,20.0,20.0),vec4(1.0,1.0,1.0,0.0),vec3(80.0,20.0,0.0),8);
    intersectCap(ray,vec3(80.0,10.0,-35.0),vec3(80.0,30.0,-35.0),8.0,6);
    intersectCappedCone(ray,vec3(-0.0,0.0,-120.0),vec3(-0.0,60.0,-120.0),20.0,0.0,6);
}


void testScene(inout Ray ray,bool tf){
    testLight(ray);
    testBaseScene(ray);
}

vec3 texUv(vec2 uv,int id){
    
    uv.xy += vec2(20.0,20.0);
    uv = fract(uv);
    uv.xy *= 0.248;
    uv.x += mod(float(id),4.0) * 0.25 + 0.002;
    uv.y += floor(float(id) / 4.0) * 0.25 + 0.002;
    
    vec3 color = pow(texture2D( dataTexture, uv).xyz,vec3(2.2));
    return color;
}

Material getMatrial(int mID,vec2 uv){
    
    if(mID == 0)
        return Material(texUv(uv,3),1.0,0.0,0.0,0.0);
    else if (mID == 1)
        return Material(vec3(0.56,0.57,0.58),0.3,1.0,1.0,0.0);
    else if (mID == 2)
        return Material(vec3(0.91,0.92,0.92),0.3,1.0,1.0,0.0);
    else if (mID == 3)
        return Material(vec3(1.0,1.0,1.0),0.1,1.0,0.0,0.0);
    else if (mID == 4)
        return Material(vec3(0.0,1.0,0.0),0.2,1.0,0.0,0.0);
    else if (mID == 5)
        return Material(vec3(1.0,1.0,1.0),0.1,1.0,1.0,0.0);
    else if (mID == 6)//金
        return Material(vec3(1.0,0.71,0.29),0.3,1.0,1.0,0.0);
    else if (mID == 7)//银
        return Material(vec3(0.95,0.93,0.88),0.3,1.0,1.0,0.0);
    else if (mID == 8)//铜
        return Material(vec3(0.95,0.64,0.54),0.05,1.0,1.0,0.0);
    else if (mID == 10)
        return Material(vec3(1.0,1.0,1.0),1.0,0.0,0.0,1.5);
    else if (mID == 11)
        return Material(texUv(uv,0),1.0,0.0,0.0,0.0);
    else if (mID == 12)
        return Material(texUv(uv,1),1.0,0.0,0.0,0.0);
    else if (mID == 13)
        return Material(texUv(uv,2),1.0,0.0,0.0,0.0);
    else if (mID == 14)
        return Material(texUv(uv,3),1.0,0.0,0.0,0.0);
    else
        return Material(vec3(1.0,1.0,1.0),1.0,0.0,0.0,0.0);
}


bool shadow(vec3 pos,vec3 dir,float t){
    Ray ray;
    ray.d  = dir;
    ray.o = pos + dir * 0.01;
    ray.t = t;
    ray.isHit = false;
    //ray.shadow = true;
    testBaseScene(ray);
    return ray.isHit;

}

float getAttenuation( vec3 lightPosition, vec3 vertexPosition, float lightRadius )
{
    float r                = lightRadius;
    vec3 L                = lightPosition - vertexPosition;
    float dist            = length(L);
    float d                = max( dist - r, 0.0 );
    L                    /= dist;
    float denom            = d / r + 1.0;
    float attenuation    = 1.0 / (denom*denom);
    float cutoff        = 0.0052;
    attenuation            = (attenuation - cutoff) / (1.0 - cutoff);
    attenuation            = max(attenuation, 0.0);
    
    return attenuation;
}



vec3 Diffuse_Lambert( vec3 DiffuseColor )
{
    return DiffuseColor * (1.0 / PI);
}

float D_GGX( float Roughness, float NoH )
{
    float m = Roughness * Roughness;
    float m2 = m * m;
    float d = ( NoH * m2 - NoH ) * NoH + 1.0;    // 2 mad
    return m2 / ( PI*d*d );                    // 4 mul, 1 rcp
}

float Vis_Smith( float Roughness, float NoV, float NoL )
{
    float a = Roughness * Roughness ;
    float a2 = a*a;

    float Vis_SmithV = NoV + sqrt( NoV * (NoV - NoV * a2) + a2 );
    float Vis_SmithL = NoL + sqrt( NoL * (NoL - NoL * a2) + a2 );
    return 1.0 / ( Vis_SmithV * Vis_SmithL );
}

vec3 F_Schlick( vec3 SpecularColor, float VoH )
{
    float Fc = pow( 1.0 - VoH, 5.0 );
    return Fc + (1.0 - Fc) * SpecularColor;
    //return saturate( 50.0 * SpecularColor.y ) * Fc + (1.0 - Fc) * SpecularColor;
}

vec3 brdf(vec3 N,vec3 L,vec3 V,vec3 inColor,Material m){
    
    vec3 uBaseColor = m.baseColor;
    float uRoughness = m.roughness;
    float uSpecular = m.specular;
    float uMetallic = m.metallic;
    N = normalize(N);
    L = normalize(L);
    V = normalize(V);
    //vec3 N                  = normalize( vNormal );
    //vec3 L                  = normalize( uLightPosition - vPosition );
    //vec3 V                  = normalize( uCamPosition - vPosition );
    vec3 H                    = normalize(V + L);
    
    float NoL                = saturate( dot( N, L ) );
    float NoV                = saturate( dot( N, V ) );
    float VoH                = saturate( dot( V, H ) );
    float NoH                = saturate( dot( N, H ) );

    vec3 diffuseColor        = uBaseColor - uBaseColor * uMetallic;
    vec3 specularColor        = mix( vec3( 0.08 * uSpecular ), uBaseColor, uMetallic );

    // Microfacet specular = D*G*F / (4*NoL*NoV) = D*Vis*F
    // Vis = G / (4*NoL*NoV)
    
    float D         = D_GGX(uRoughness,NoH);
    float Vis       = Vis_Smith(uRoughness,NoV,NoL);
    vec3  F         = F_Schlick(specularColor,VoH);

    vec3 diffuse    = Diffuse_Lambert(diffuseColor);
    //vec3 diffuse    = Diffuse_OrenNayar(diffuseColor,uRoughness,NoV, NoL,VoH);
    vec3 specular   = D * Vis * F;
    vec3 color      = inColor * ( diffuse + specular ) * NoL;

    return color;
}

vec3 brdfDiffuse(vec3 N,vec3 L,vec3 V,vec3 inColor,Material m){
    return inColor * invPI * saturate( dot( N, L ) );
}

Ary2V3d calculatePointLight(vec3 pos,vec3 normal,vec3 lightpos,float lightsize,float intensity,vec3 color){
    float lightArea = 4.0 * PI * lightsize * lightsize;
    vec3 pointlight = lightpos+ uniformlyRandomVector(time - 53.0) * lightsize;
    vec3 lightdir = normalize(pointlight - pos);
    float d = length(pointlight - pos);
    Ary2V3d avd;
    avd.v0 = vec3(0.0,0.0,0.0);
    avd.v1 = lightdir;
    if(!shadow(pos,lightdir,d)){

        float pdf =  (d*d) / lightArea;
        avd.v0 = color*intensity / pdf;
    }
    return avd;
}

Ary2V3d areaPointLight(vec3 pos,vec3 normal,vec3 lightpos,vec3 lightdirA,vec3 lightdirB,float intensity,vec3 color){
    float lightArea = length(cross(lightdirA,lightdirB));
    vec3 n = normalize(cross(lightdirA,lightdirB));
    vec3 pointlight = lightpos + lightdirA * area.x + lightdirB * area.y;

    vec3 lightdir = normalize(pointlight - pos);
    float s = saturate(dot(n,lightdir));
    float d = length(pointlight - pos);

    Ary2V3d avd;
    avd.v0 = vec3(0.0,0.0,0.0);
    avd.v1 = lightdir;
    if(!shadow(pos,lightdir,d)){
        float pdf = (d*d) /(lightArea*s) ;
        avd.v0 = color*intensity / pdf;
    }
    return avd;

}

//#directLight
vec3 directLight(vec3 pos,vec3 lastPos,vec3 normal,Material m){
    Ary2V3d avd;
    vec3 color = vec3(0.0,0.0,0.0);
    avd = calculatePointLight(pos,normal,vec3(ld[0],ld[1],ld[2]),ld[3],ld[5],vec3(ld[6],ld[7],ld[8]));
    color += brdf(normal,avd.v1,normalize(lastPos - pos),avd.v0,m);
    avd = areaPointLight(pos,normal,vec3(ld[9],ld[10],ld[11]),vec3(ld[12],ld[13],ld[14]),vec3(ld[15],ld[16],ld[17]),ld[19],vec3(ld[20],ld[21],ld[22]));
    color += brdf(normal,avd.v1,normalize(lastPos - pos),avd.v0,m);
    return color;
    }
//#directLight_end

BrdfPdf brdf3_d(vec3 N,vec3 L,vec3 V,Material m){
    vec3 uBaseColor     = m.baseColor;
    float uMetallic     = m.metallic;
    vec3 diffuseColor   = uBaseColor - uBaseColor * uMetallic;
    N = normalize(N);
    L = normalize(L);
    float NoL   = saturate( dot( N, L ) );

    //#lambert = DiffuseColor * NoL / PI
    //#pdf = NoL / PI
    vec3 color = vec3(0.0,0.0,0.0);
    if(NoL > 0.0){
        color = diffuseColor;
    }

    BrdfPdf bf;
    bf.color = color;
    bf.pdf = NoL / PI;
          
    return bf;
}

BrdfPdf brdf3_s(vec3 N,vec3 L,vec3 V,Material m){
    
    vec3 uBaseColor = m.baseColor;
    float uRoughness = m.roughness;
    float uSpecular = m.specular;
    float uMetallic = m.metallic;
    N = normalize(N);
    L = normalize(L);
    V = normalize(V);
    //vec3 N                  = normalize( vNormal );
    //vec3 L                  = normalize( uLightPosition - vPosition );
    //vec3 V                  = normalize( uCamPosition - vPosition );
    vec3 H                    = normalize(V + L);
    
    float NoL                = saturate( dot( N, L ) );
    float NoV                = saturate( dot( N, V ) );
    float VoH                = saturate( dot( V, H ) );
    float NoH                = saturate( dot( N, H ) );

    //vec3 diffuseColor        = uBaseColor - uBaseColor * uMetallic;
    vec3 specularColor        = mix( vec3( 0.08 * uSpecular ), uBaseColor, uMetallic );

    // Microfacet specular = D*G*F / (4*NoL*NoV) = D*Vis*F
    // Vis = G / (4*NoL*NoV)

    // Microfacet specular = D*G*F / (4*NoL*NoV)
    // pdf = D * NoH / (4 * VoH)
    
    float D         = D_GGX(uRoughness,NoH);
    float Vis       = Vis_Smith(uRoughness,NoV,NoL);
    vec3  F         = F_Schlick(specularColor,VoH);

    vec3 specular   = Vis * F;
    float ss = 4.0 * NoL * VoH /(VoH + 0.001);
    specular *= ss;
    vec3 color      = ( specular ) * NoL;

    BrdfPdf bf;
    bf.color = color;
    bf.pdf = D * NoH / (4.0 * VoH);

    return bf;
}

float powerHeuristic(float a, float b){
    float t = a * a;
    return t / (b*b + t);
}
vec3 EmitterSample(int depth,bool specularBounce,float brdfPdf,float lightPdf,vec3 emission)
{
    vec3 Le;

    if (depth == 0 || specularBounce)
        Le = emission;
    else
        Le = powerHeuristic(brdfPdf, lightPdf) * emission / lightPdf;

    return Le;
}

vec3 calculate(vec3 o,vec3 d,float t){
    Ray ray;
    ray.d  = d;
    ray.o = o;
    ray.t = t;
    ray.isHit = false;
    
    vec3 ac = vec3(0.0,0.0,0.0);
    float sc = 1.0;
    vec3 lastNormal;
    vec3 lastPos = o;
    //Material ms[5];
    //vec3 baseColor;float roughness;float specular;float metallic;
    Material m;

    
    vec3 radiance = vec3(0.0);
    vec3 throughput = vec3(1.0);
    bool specularBounce = true;
    float lastRoughness = 1.0;

    for(int count=0;count<BOUND;count++){
        testScene(ray,count == 0);

        m = getMatrial(ray.mID,ray.uv);

        float r = m.roughness;
        if(count > 0 && lastRoughness > r){
            r = lastRoughness;
        }
        m.roughness = r;

        vec3 color = vec3(0.0,0.0,0.0);
        Ary2V3d avd;
        float brdfPdf;
        if (ray.isHit){

            lastRoughness = m.roughness;
            
            if(ray.mID < 0){
                radiance += EmitterSample(count,specularBounce,brdfPdf,ray.emissive.w,ray.emissive.xyz) * throughput;
                break;
            }
            
            vec4 newd;
            if(m.glass > 0.0){
                specularBounce = true;
                newd = GlassDir(ray.normal,m.glass,ray.d);
                brdfPdf = 1.0;
                throughput *= m.baseColor;
            }else{
                specularBounce = false;
                radiance += directLight(ray.pos,lastPos,ray.normal,m) * throughput;
            
                newd = SampleDir(ray.normal,normalize(reflect(ray.d, ray.normal)),r,m.metallic,vec2(ran.x+float(count),ran.y+float(count)));

                int type = int(newd.w);
                BrdfPdf brdf;
                if(type == 0){
                    brdf = brdf3_d(ray.normal,-ray.d,newd.xyz,m);
                }else if(type == 1){
                    brdf = brdf3_s(ray.normal,-ray.d,newd.xyz,m);
                }
                throughput *= brdf.color;
                brdfPdf = brdf.pdf;

            }
           

            ray.isHit = false;
            ray.d = newd.xyz;
            ray.o = ray.pos + ray.d * 0.05;
            ray.t = 10000000.0;
            //ray.sOrd = int(newd.w);
            ray.mID = 0;
            lastNormal = ray.normal;
            lastPos = ray.pos;
        }else{

            vec3 hdrColor = getHdr(texture2D( hdrTexture, getuv(ray.d)));
            //traces[count].directColor = hdrColor;//vec3(1.2,1.2,1.2) * 50.0;
            //traces[count].pos = ray.o + ray.d * 10000.0;
            //traces[count].sOrd = ray.sOrd;
            radiance += hdrColor * throughput;
            break;
        }
    }
    
    return max(radiance,vec3(0.0,0.0,0.0));
}

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st) {    
    return smoothstep(0.02, 0.0, abs(st.y - st.x));
}

void main(void){

      vec3 color = calculate(camPos,getDir(),10000000.0);

  vec3 texture = texture2D(baseTexture, gl_FragCoord.xy / 512.0).xyz;
  color = mix(color, texture, weight);
  gl_FragColor = vec4(color, 1.0);

}`;
const pathShader = new ShaderBase(vertexShader$1, fragmentShader0);
pathShader.initShader = (gl) => {
    const program = pathShader.attachShader(gl);
    gl.bindAttribLocation(program, 0, "v3Pos"),
        gl.bindAttribLocation(program, 1, "v2Uv"),
        gl.bindAttribLocation(program, 2, "v3Nor"),
        gl.bindAttribLocation(program, 3, "v3Tan");
    gl.linkProgram(program);
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked || gl.isContextLost()) {
        const err = gl.getProgramInfoLog(program);
        console.error('linke program error', err);
    }
    pathShader.program = program;
};

const vertexShader = `
attribute vec3 v3Pos;
attribute vec2 v2Uv;

varying vec2 vUv;//uv
void main(void){
    vec4 vt0    = vec4(v3Pos, 1.0);
    vUv         = v2Uv;
    gl_Position = vt0;
}
`;
const fragmentShader = `precision highp float;

uniform sampler2D baseTexture;
varying vec2 vUv;//uv

vec3 toneMap(vec3 src){
	vec3 color = src / (1.0 + src);
	color = pow(color,vec3(1.0/2.2,1.0/2.2,1.0/2.2));
	return color;
}
vec3 toneMap2(in vec3 c)
{
	float luminance = 0.3*c.x + 0.6*c.y + 0.1*c.z;
	vec3 color =  c * 1.0/(1.0 + luminance/1.5);
    color = pow(color,vec3(1.0/2.2,1.0/2.2,1.0/2.2));
	return color;
}


void main(void){
    vec3 color      = texture2D(baseTexture, vUv).xyz;
    color = toneMap(color);
    gl_FragColor    = vec4(color,1.0);
}`;
const dShader = new ShaderBase(vertexShader, fragmentShader);
dShader.initShader = (gl) => {
    dShader.attachShader(gl);
    gl.bindAttribLocation(dShader.program, 0, "v3Pos"),
        gl.bindAttribLocation(dShader.program, 1, "v2Uv"),
        gl.bindAttribLocation(dShader.program, 2, "v3Nor"),
        gl.bindAttribLocation(dShader.program, 3, "v3Tan");
    gl.linkProgram(dShader.program);
};

class DisplayManager {
    static inst;
    viewDataDis;
    gl;
    _program;
    shader;
    _textureDic = {};
    setTextureNum = 0;
    fboArray;
    constructor() {
    }
    static getInstance() {
        return this.inst || (this.inst = new DisplayManager(), this.inst);
    }
    initBufferData(gl) {
        this.gl = gl;
        this.viewDataDis = {
            vertices: [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0],
            uvs: [0, 0, 0, 1, 1, 1, 1, 0],
            indexs: [0, 1, 2, 0, 2, 3],
            treNum: 6,
        };
        this.viewDataDis.vertexBuffer = this.bindBuffer(gl, this.viewDataDis.vertices);
        this.viewDataDis.uvBuffer = this.bindBuffer(gl, this.viewDataDis.uvs);
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.viewDataDis.indexs), gl.STATIC_DRAW);
        this.viewDataDis.indexBuffer = indexBuffer;
    }
    initArrayBufferForLaterUse(gl, data, num, type) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        // 保留以后分配给属性变量所需的信息
        buffer.num = num;
        buffer.type = type;
        return buffer;
    }
    initElementArrayBufferForLaterUse(gl, data, type) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        buffer.type = type;
        return buffer;
    }
    update(fbo) {
        if (this.gl && this.shader.program) {
            this.gl.useProgram(this.shader.program);
            const gl = this.gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.viewDataDis.vertexBuffer);
            //v3Pos
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.viewDataDis.uvBuffer);
            gl.enableVertexAttribArray(1);
            gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
            this.setRenderTexture(this.shader, "baseTexture", fbo.texture, 0);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.viewDataDis.indexBuffer);
            this.gl.drawElements(this.gl.TRIANGLES, this.viewDataDis.treNum, 5123, 0);
        }
    }
    setRenderTexture(shader, id, tex, index, isText = true) {
        isText && this.testTexture(id, tex) || (0 == index ? this.gl.activeTexture(this.gl.TEXTURE0) : 1 == index ? this.gl.activeTexture(this.gl.TEXTURE1) : 2 == index ? this.gl.activeTexture(this.gl.TEXTURE2) : 3 == index ? this.gl.activeTexture(this.gl.TEXTURE3) : 4 == index ? this.gl.activeTexture(this.gl.TEXTURE4) : 5 == index ? this.gl.activeTexture(this.gl.TEXTURE5) : 6 == index && this.gl.activeTexture(this.gl.TEXTURE6),
            this.gl.bindTexture(this.gl.TEXTURE_2D, tex),
            this.gl.uniform1i(this.gl.getUniformLocation(shader.program, id), index),
            this.setTextureNum++);
    }
    testTexture(id, tex) {
        return this._textureDic[id] == tex || (this._textureDic[id] = tex,
            false);
    }
    bindBuffer(gl, arr) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
        return buffer;
    }
    testR() {
        const gl = this.gl;
        this.gl.useProgram(this.shader.program);
        const buffer = this.viewDataDis.vertexBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.viewDataDis.vertexBuffer);
        gl.vertexAttribPointer(this.shader.program.a_Position, buffer.num, buffer.type, false, 0, 0);
        gl.enableVertexAttribArray(this.shader.program.a_Position);
        const buffer2 = this.viewDataDis.normalBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.viewDataDis.normalBuffer);
        gl.vertexAttribPointer(this.shader.program.a_Normal, buffer2.num, buffer2.type, false, 0, 0);
        gl.enableVertexAttribArray(this.shader.program.a_Normal);
        const e1 = new Float32Array([
            -0.747334361076355, -0.22725464403629303, 0.6243769526481628, -1.49466872215271, -9.679406609564012e-9, 0.9396926164627075, 0.3420201539993286, -1.9358813219128024e-8, // v0-v1-v2-v3 front
            -0.664448082447052, 0.2556034028530121, -0.7022646069526672, -1.328896164894104, 0.0, 0.0, 0.0, 1.0,
        ]);
        gl.uniformMatrix4fv(this.shader.program.u_NormalMatrix, false, e1);
        /* 计算模型视图投影矩阵 */
        //g_mvpMatrix.set(viewProjMatrix); // g_mvpMatrix -> viewProjMatrix
        //g_mvpMatrix.multiply(g_modelMatrix); // viewProjMatrix * g_modelMatrix
        const e2 = new Float32Array([
            -2.091817617416382, -0.8481259346008301, -2.63699072599411, -0.6243770122528076, 0.0, 3.5069806575775146, -0.34892967343330383, -0.3420201539993286, // v0-v1-v2-v3 front
            -1.8598157167434692, 0.9539250135421753, 0.7164518237113953, 0.702264666557312, -5.598076343536377, 0.0, 13.282828330993652, 15,
        ]);
        gl.uniformMatrix4fv(this.shader.program.u_MvpMatrix, false, e2);
        gl.drawElements(gl.TRIANGLES, this.viewDataDis.numIndices, this.viewDataDis.indexBuffer.type, 0); // Draw
    }
}

class ForwardEngine {
    gl;
    platform = Platform;
    viewMatrix = new Matrix();
    inputManager;
    program;
    vShader;
    fShader;
    pathTraceManager;
    displayManager;
    async initEngine(params) {
        const canvasInst = Platform.getCanvas(params.canvas || params);
        const options = {
            alpha: false,
            antialias: true,
            depth: true,
            stencil: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
            desynchronized: true,
            ...params.contextOption
        };
        this.gl = canvasInst.getContext('webgl', options);
        this.gl.getExtension("OES_element_index_uint");
        //OES_texture_float 是WebGL的一个扩展，它允许在片段着色器中使用浮点数纹理。这对于需要更高精度计算的图形处理任务非常有用，因为标准的8位或16位整数纹理可能无法提供足够的精度。
        //具体来说，这个扩展允许您在纹理中存储浮点数数据，例如颜色、深度、法线、高度图等。这样，您可以在片段着色器中执行各种复杂的计算，如高级光照、体积渲染、模拟流体动力学等。
        this.gl.getExtension("OES_texture_float");
        canvasInst.width = 512;
        canvasInst.height = 512;
        this.gl.viewport(0, 0, 512, 512);
        this.viewMatrix = new Matrix();
        this.viewMatrix.createPerspectiveMatrixFOV(60 * Math.PI / 180, canvasInst.width / canvasInst.height, ppConfig.viewNear, ppConfig.viewFar);
        this.pathTraceManager = PathTrace.getInstance();
        this.displayManager = DisplayManager.getInstance();
        this.pathTraceManager.viewWidth = canvasInst.width;
        this.pathTraceManager.viewHeight = canvasInst.width;
        //fbo shader
        this.pathTraceManager.fboArray.push(this.getFbo());
        this.pathTraceManager.fboArray.push(this.getFbo());
        this.displayManager.fboArray = this.pathTraceManager.fboArray;
        this.pathTraceManager.initBufferData(this.gl);
        this.displayManager.initBufferData(this.gl);
        this.pathTraceManager.initDataTexture(this.gl);
        // 着色器初始化
        pathShader.initShader(this.gl);
        dShader.initShader(this.gl);
        this.pathTraceManager.shader = pathShader;
        this.displayManager.shader = dShader;
    }
    update() {
        if (!this.pathTraceManager.texReady || !this.pathTraceManager.shader) {
            return;
        }
        // 第一通道：渲染到 FBO
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pathTraceManager.fboArray[0].frameBuffer);
        this.gl.viewport(0, 0, this.pathTraceManager.fboArray[0].width, this.pathTraceManager.fboArray[0].height);
        this.pathTraceManager.update(this.pathTraceManager.fboArray[1]);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        // 第二通道：渲染到屏幕
        this.displayManager.update(this.pathTraceManager.fboArray[0]);
        // 交换 FBO
        this.pathTraceManager.fboArray.reverse();
    }
    clearContext() {
        if (!this.gl)
            return;
        this.gl.clearColor(63 / 255, 63 / 255, 63 / 255, 1);
        this.gl.clearDepth(1);
        this.gl.clearStencil(0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthMask(true);
        this.gl.enable(this.gl.BLEND);
        this.gl.frontFace(this.gl.CW);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT |
            this.gl.DEPTH_BUFFER_BIT |
            this.gl.STENCIL_BUFFER_BIT);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.disable(this.gl.CULL_FACE);
    }
    getFbo() {
        const width = this.pathTraceManager.viewWidth;
        const height = this.pathTraceManager.viewHeight;
        //帧缓冲区
        const gl = this.gl;
        const frameBuffer = gl.createFramebuffer();
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
        //‌GL_TEXTURE_MIN_FILTER‌：当纹理图像被缩小或放大时使用的过滤方式。常用的值有gl.NEAREST和gl.LINEAR。前者使用最近的纹理像素值，后者使用周围4个像素的加权平均值。
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //渲染缓冲区
        const depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        //创建深度和模板渲染缓冲区对象
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        //附加渲染缓冲区对象。
        //一般情况下，无需从缓冲区采样数据，使用渲染缓冲区对象；需要从缓冲区采样如颜色或深度值，则使用纹理附件。
        //attachment参数必须设置为帧缓冲对象的一个附件点，例如COLOR_ATTACHMENT0、DEPTH_ATTACHMENT、STENCIL_ATTACHMENT+和+DEPTH_STENCIL_ATTACHMENT
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        const res = Object.create(null);
        res.width = width;
        res.height = height;
        res.frameBuffer = frameBuffer;
        res.depthBuffer = depthBuffer;
        res.texture = texture;
        return res;
    }
}
const ff = new ForwardEngine();

window.Engine = ff;
