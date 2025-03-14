import { Matrix } from "@/3d/Matrix";
import Platform from "../platform/Platform";
import ppConfig from "@/config";
import PathTraceManager, { PathTrace } from "@/3d/PathTrace";
import pathTraceShader from "@/shader/pathTraceShader";
import displayShader from "@/shader/displayShader";
import DisplayManager from "@/3d/DisplayManager";

// ==================== 类型定义 ====================
interface FBO {
    width: number;
    height: number;
    frameBuffer: WebGLFramebuffer;
    depthBuffer: WebGLRenderbuffer;
    texture: WebGLTexture;
}

interface EngineParams {
    canvas?: HTMLCanvasElement | OffscreenCanvas;
    contextOption?: WebGLContextAttributes;
}

class ForwardEngine {
    gl: WebGLRenderingContext | null;
    platform: typeof Platform = Platform;
    viewMatrix: Matrix = new Matrix();
    inputManager: void;
    program: WebGLProgram;
    vShader: WebGLShader;
    fShader: WebGLShader;
    pathTraceManager: PathTrace;
    displayManager: DisplayManager;

    public async initEngine(params: EngineParams) {
        const canvasInst: OffscreenCanvas = Platform.getCanvas(params.canvas || params);
        const options: WebGLContextAttributes = {
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
        this.pathTraceManager = PathTraceManager.getInstance();
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
        pathTraceShader.initShader(this.gl);
        displayShader.initShader(this.gl);
        this.pathTraceManager.shader = pathTraceShader;
        this.displayManager.shader = displayShader;
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
        if (!this.gl) return;
        this.gl.clearColor(63 / 255, 63 / 255, 63 / 255, 1);
        this.gl.clearDepth(1);
        this.gl.clearStencil(0);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthMask(true);
        this.gl.enable(this.gl.BLEND);
        this.gl.frontFace(this.gl.CW);

        this.gl.clear(
            this.gl.COLOR_BUFFER_BIT |
            this.gl.DEPTH_BUFFER_BIT |
            this.gl.STENCIL_BUFFER_BIT
        );

        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.disable(this.gl.CULL_FACE);
    }


    getFbo(): FBO {
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
        res.frameBuffer = frameBuffer
        res.depthBuffer = depthBuffer
        res.texture = texture;
        return res;
    }
}
const ff = new ForwardEngine();
export default ff;
