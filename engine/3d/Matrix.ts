import Vector3D from "./Vector3D";

export class Matrix {
    defaultArray: Float32Array;
    matrix: Float32Array;
    /**
     *  归一化
     */
    isIdentity: boolean;
    static tempM: Matrix;

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
    createPerspectiveMatrix(left: number, right: number, bottom: number, top: number, znear: number, zfar: number) {

    }
    /**
     * 通过给定的near和far平面下，很难去适当的决定4个参数（left, right, top, bottom），以在指定的窗口分辨率上进行透视投影。但你可以根据view角度的垂直/水平域和宽高比，width/height，简单的推导出这4个参数。然而这些推导受限于对称的透视投影矩阵
     */
    createPerspectiveMatrixFOV(rad, ratio, viewNear = 1, viewFar) {
        var top = 1 / Math.tan(rad / 2)
            , right = top / ratio
            , matrix = this.matrix;
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
            matrix[15] = 0
    }

    appendRotation = function (rot, vec3) {
        Matrix.tempM.identity(),
            Matrix.tempM.prependRotation(rot, vec3),
            this.append(Matrix.tempM)
    }

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
            this.matrix[15] = Matrix.tempM.matrix[15]
    }

    prepend(tempM) {
        var tempMatrix = tempM.matrix
            , matrix = this.matrix
            , matrix2 = this.matrix
            , n = matrix2[0]
            , i = matrix2[1]
            , o = matrix2[2]
            , s = matrix2[3]
            , h = matrix2[4]
            , c = matrix2[5]
            , u = matrix2[6]
            , d = matrix2[7]
            , p = matrix2[8]
            , f = matrix2[9]
            , l = matrix2[10]
            , _ = matrix2[11]
            , y = matrix2[12]
            , x = matrix2[13]
            , m = matrix2[14]
            , g = matrix2[15]
            , D = tempMatrix[0]
            , v = tempMatrix[1]
            , b = tempMatrix[2]
            , S = tempMatrix[3];
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
            matrix[15] = D * s + v * d + b * _ + S * g
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
            M)
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