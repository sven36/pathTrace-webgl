import AssetManager from "@/asset/AssetManager";
import MaterialInfo from "./MaterialInfo";
import Vector3D from "./Vector3D";
import Plane from "./Plane";
import { MaterialType } from "./Enum";
import Sphere from "./Sphere";
import PointLight from "./PointLight";
import AreaLight from "./AreaLight";

// ==================== 类型定义 ====================
interface ViewData {
    vertices: number[];
    uvs: number[];
    indexs: number[];
    treNum: number;
    vertexBuffer?: WebGLBuffer;
    uvBuffer?: WebGLBuffer;
    indexBuffer?: WebGLBuffer;
}

interface Geometry {
    numAry: number[];
    numOffset: number;
    numAll: number;
    applyAry(): void;
    material: MaterialInfo;
    type: MaterialType;
    id: number;
}

interface Light {
    ldAry: number[];
    numOffset: number;
    numAll: number;
    applyAry(): void;
    id: number;
    lightID: number;
    name: string;
}

interface Shader {
    program: WebGLProgram | null;
}

interface FBO {
    width: number;
    height: number;
    frameBuffer: WebGLFramebuffer;
    depthBuffer: WebGLRenderbuffer;
    texture: WebGLTexture;
}


export class PathTrace {
    // 渲染相关属性
    fboArray: FBO[] = [];
    viewWidth: number = 0;
    viewHeight: number = 0;
    viewData: ViewData;
    private _hdrTexture: WebGLTexture | null = null;
    texReady: boolean = false;
    gl!: WebGLRenderingContext;

    // 单例模式
    static inst: PathTrace;

    // 场景数据
    gemoAry: Geometry[] = [];
    lightAry: Light[] = [];
    numAry: number[] = [];
    mdAry: number[] = [];
    ldAry: number[] = [];
    private _materialAry: MaterialInfo[] = [];

    // 管理属性
    offset: number = 0;
    gemoAddID: number = 0;
    gemoDic: Record<string, Geometry> = {};
    lightOffset: number = 0;
    lightAddID: number = 0;
    lightDic: Record<string, Light> = {};

    // 渲染状态
    sdAry: number[] = [];
    setTextureNum: number = 0;
    setProgramNum: number = 0;
    private _program: WebGLProgram | null = null;
    count: number = 0;
    private _textureDic: Record<string, WebGLTexture> = {};
    dataTexture: WebGLTexture | null = null;
    shader: Shader = { program: null };


    static getInstance() {
        return this.inst || (this.inst = new PathTrace(), this.inst)
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
            this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, !1, 0, 0);
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
                this.gl.activeTexture(this.gl.TEXTURE0)
                break;
            case 1:
                this.gl.activeTexture(this.gl.TEXTURE1)
                break;
            case 2:
                this.gl.activeTexture(this.gl.TEXTURE2)
                break;
            case 3:
                this.gl.activeTexture(this.gl.TEXTURE3)
                break;
            case 4:
                this.gl.activeTexture(this.gl.TEXTURE4)
                break;
            case 5:
                this.gl.activeTexture(this.gl.TEXTURE5)
                break;
            case 6:
                this.gl.activeTexture(this.gl.TEXTURE6)
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
        this._textureDic[id] = tex
        return false;
    }


    initDataTexture(gl: WebGLRenderingContext) {
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
        this.addLight(light1)
        this.addLight(light2)
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
            this.lightDic[light.name] = light
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
        this.gemoDic[`${gemo.type}${gemo.id}`] = gemo
    }

    addGemos(arr = []) {
        for (let i = 0; i < arr.length; i++) {
            this.addGemo(arr[i]);
        }
    }


    async initBufferData(gl: WebGLRenderingContext) {
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
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img as TexImageSource);
        const magFilter = 0 == filter ? gl.LINEAR : gl.NEAREST;
        let minFilter: number = gl.LINEAR;
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
        } else {
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
        } else {
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

}
export default PathTrace;