
interface FBO {
    width: number;
    height: number;
    frameBuffer: WebGLFramebuffer;
    depthBuffer: WebGLRenderbuffer;
    texture: WebGLTexture;
}
export default class DisplayManager {
    static inst: any;
    viewDataDis: any;
    gl: any;
    private _program: any;
    shader: any;
    private _textureDic: any = {};
    setTextureNum: number = 0;
    fboArray: FBO[];

    constructor() {

    }

    static getInstance() {
        return this.inst || (this.inst = new DisplayManager(), this.inst)
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

    initArrayBufferForLaterUse(gl, data, num, type) { // 坐标、法线、纹理坐标专用
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        // 保留以后分配给属性变量所需的信息
        buffer.num = num;
        buffer.type = type;
        return buffer;
    }

    initElementArrayBufferForLaterUse(gl, data, type) { // 索引数据专用
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
            this.setTextureNum++)
    }

    testTexture(id, tex) {
        return this._textureDic[id] == tex || (this._textureDic[id] = tex,
            !1)
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

        const e1 = new Float32Array([   // 纹理坐标
            -0.747334361076355, -0.22725464403629303, 0.6243769526481628, -1.49466872215271, -9.679406609564012e-9, 0.9396926164627075, 0.3420201539993286, -1.9358813219128024e-8,    // v0-v1-v2-v3 front
            -0.664448082447052, 0.2556034028530121, -0.7022646069526672, -1.328896164894104, 0.0, 0.0, 0.0, 1.0,
        ])

        gl.uniformMatrix4fv(this.shader.program.u_NormalMatrix, false, e1);
        /* 计算模型视图投影矩阵 */
        //g_mvpMatrix.set(viewProjMatrix); // g_mvpMatrix -> viewProjMatrix
        //g_mvpMatrix.multiply(g_modelMatrix); // viewProjMatrix * g_modelMatrix
        const e2 = new Float32Array([   // 纹理坐标
            -2.091817617416382, -0.8481259346008301, -2.6369907259941101, -0.6243770122528076, 0.0, 3.5069806575775146, -0.34892967343330383, -0.3420201539993286,    // v0-v1-v2-v3 front
            -1.8598157167434692, 0.9539250135421753, 0.7164518237113953, 0.702264666557312, -5.598076343536377, 0.0, 13.282828330993652, 15,
        ])
        gl.uniformMatrix4fv(this.shader.program.u_MvpMatrix, false, e2);
        gl.drawElements(gl.TRIANGLES, this.viewDataDis.numIndices, this.viewDataDis.indexBuffer.type, 0);   // Draw
    }

}