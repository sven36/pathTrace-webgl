import ShaderBase from "./shaderBase";

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



const dShader = new ShaderBase(vertexShader, fragmentShader)

dShader.initShader = (gl) => {
    dShader.attachShader(gl);
    gl.bindAttribLocation(dShader.program, 0, "v3Pos"),
    gl.bindAttribLocation(dShader.program, 1, "v2Uv"),
    gl.bindAttribLocation(dShader.program, 2, "v3Nor"),
    gl.bindAttribLocation(dShader.program, 3, "v3Tan")
    gl.linkProgram(dShader.program);
}
export default dShader;