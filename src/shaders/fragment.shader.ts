// text on GLSL
const fragmentShader2D: string = `
precision mediump float;

uniform vec4 u_color;

void main() {
   gl_FragColor = u_color;
}
`

export default fragmentShader2D