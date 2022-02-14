import fragmentShader2D from "@shaders/fragment.shader"
import vertexShader2D from "@shaders/vertex.shader"
import "@styles/main.scss"

function createShader(gl, type, source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
	  return shader;
	}
 
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
 }
 
 function createProgram(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
	  return program;
	}
 
	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
 }
 
 function main() {
	// Get A WebGL context
	var canvas = document.querySelector("#main_canvas") as HTMLCanvasElement;
	const heightView = window.innerHeight
	const widthView = window.innerWidth
	var gl = canvas.getContext("webgl");
	canvas.width = widthView - 5
	canvas.height = heightView - 5
	if (!gl) {
	  return;
	}
 
	// Get the strings for our GLSL shaders
	var vertexShaderSource = vertexShader2D;
	var fragmentShaderSource = fragmentShader2D;
 
	// create GLSL shaders, upload the GLSL source, compile the shaders
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
 
	// Link the two shaders into a program
	var program = createProgram(gl, vertexShader, fragmentShader);
 
	  // look up where the vertex data needs to go.
	  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	  // look up uniform locations
	  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
	  var colorUniformLocation = gl.getUniformLocation(program, "u_color");
	
	  // Create a buffer to put three 2d clip space points in
	  var positionBuffer = gl.createBuffer();
	
	  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
	//   webglUtils.resizeCanvasToDisplaySize(gl.canvas);
	
	  // Tell WebGL how to convert from clip space to pixels
	  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	
	  // Clear the canvas
	  gl.clearColor(0, 0, 0, 0);
	  gl.clear(gl.COLOR_BUFFER_BIT);
	
	  // Tell it to use our program (pair of shaders)
	  gl.useProgram(program);
	
	  // Turn on the attribute
	  gl.enableVertexAttribArray(positionAttributeLocation);
	
	  // Bind the position buffer.
	  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
	  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	  var size = 2;          // 2 components per iteration
	  var type = gl.FLOAT;   // the data is 32bit floats
	  var normalize = false; // don't normalize the data
	  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	  var offset = 0;        // start at the beginning of the buffer
	  gl.vertexAttribPointer(
			positionAttributeLocation, size, type, normalize, stride, offset);
	
	  // set the resolution
	  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	
	  // draw 50 random rectangles in random colors
	  for (var ii = 0; ii < 100; ++ii) {
		 // Setup a random rectangle
		 // This will write to positionBuffer because
		 // its the last thing we bound on the ARRAY_BUFFER
		 // bind point
		 setRectangle(
			  gl, randomInt(widthView), randomInt(heightView), randomInt(300), randomInt(300));
	
		 // Set a random color.
		 gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
	
		 // Draw the rectangle.
		 var primitiveType = gl.TRIANGLES;
		 var offset = 0;
		 var count = 6;
		 gl.drawArrays(primitiveType, offset, count);
	  }
	}
	
	// Returns a random integer from 0 to range - 1.
	function randomInt(range) {
	  return Math.floor(Math.random() * range);
	}
	
	// Fill the buffer with the values that define a rectangle.
	function setRectangle(gl, x, y, width, height) {
	  var x1 = x;
	  var x2 = x + width;
	  var y1 = y;
	  var y2 = y + height;
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		  x1, y1,
		  x2, y1,
		  x1, y2,
		  x1, y2,
		  x2, y1,
		  x2, y2,
	  ]), gl.STATIC_DRAW);
	
}
 
 main();