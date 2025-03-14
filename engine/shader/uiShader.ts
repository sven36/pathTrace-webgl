import ShaderBase from "./shaderBase";

const vertexShader = "attribute vec3 v3Pos;attribute vec3 v2uv;uniform vec4 ui[50];uniform vec4 ui2[50];varying vec2 v_texCoord;void main(void){   vec4 data = ui2[int(v2uv.z)];   v_texCoord = vec2(v2uv.x * data.x + data.z, v2uv.y * data.y + data.w);   data = ui[int(v2uv.z)];   vec3 pos = vec3(0.0,0.0,0.0);   pos.xy = v3Pos.xy * data.zw * 2.0;   pos.x += data.x * 2.0 - 1.0;   pos.y += -data.y * 2.0 + 1.0;   vec4 vt0= vec4(pos, 1.0);   gl_Position = vt0;}";
const fragmentShader = " precision mediump float;\nuniform sampler2D s_texture;\nvarying vec2 v_texCoord;\nvoid main(void)\n{\nvec4 infoUv = texture2D(s_texture, v_texCoord.xy);\ninfoUv.xyz *= infoUv.w;\ngl_FragColor = infoUv;\n}";

const uiShader = new ShaderBase(vertexShader, fragmentShader)

uiShader.initShader = (gl) => {
    uiShader.attachShader(gl);
    gl.bindAttribLocation(uiShader.program, 0, "v3Position");
    gl.bindAttribLocation(uiShader.program, 1, "v2CubeTexST");
    gl.linkProgram(uiShader.program);
}
export default uiShader;