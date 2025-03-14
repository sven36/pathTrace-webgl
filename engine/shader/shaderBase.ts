export default class ShaderBase {
    program: WebGLProgram;
    vShader: WebGLShader;
    vertexShader: string;
    fragmentShader: string;
    fShader: WebGLShader;
    bindLocation: (gl: WebGLRenderingContext) => void;
    initShader: (gl: WebGLRenderingContext) => void;
    constructor(vertexShader: string, fragmentShader: string) {
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }

    attachShader(gl: WebGLRenderingContext) {
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
        this.checkCompile(gl, this.vShader)
        gl.compileShader(this.fShader);
        this.checkCompile(gl, this.fShader)
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