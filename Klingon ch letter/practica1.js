// Alejandra Gavino-Dias
//Practcia 1

// Funcionalidad Javascript
// Funciones generales de webgl
/** *************************************
   VARIABLES GLOBALES
*****************************************/
var canvas = null; // variable que identifica el canvas donde se pinta
var gl = null; // variable contexto webgl2 de la aplicación

var vertexShader, fragmentShader, glProgram;

// Los datos de los vertices
var model = {
   vertices: [
     -0.2,    0.7,    0,  //0
     -0.06,   0.4,    0,  //1
     0.05,    0.12,   0,  //2
     0.13,   -0.025,  0,  //3
     0.2,    -0.055,  0,  //4
     0.25,   -0.04,   0,  //5
     0.39,    0.12,   0,  //6
     0.55,    0.32,   0,  //7
     0.77,    0.65,   0,  //8
     0.67,    0.35,   0,  //9
     0.61,    0.12,   0,  //10
     0.57,   -0.1,    0,  //11
     0.54,   -0.37,   0,  //12
     0.51,   -0.47,   0,  //13
     0.47,   -0.54,   0,  //14
     0.39,   -0.62,   0,  //15
     0.26,   -0.66,   0,  //16
     -0.15,  -0.66,   0,  //17
     -0.23,  -0.65,   0,  //18
     -0.33,  -0.6,    0,  //19
     -0.43,  -0.53,   0,  //20
     -0.48,  -0.47,   0,  //21
     -0.28,  -0.49,   0,  //22
     -0.24,  -0.49,   0,  //23
     0.22,   -0.49,   0,  //24
     0.32,   -0.46,   0,  //25
     0.35,   -0.42,   0,  //26
     0.35,   -0.21,   0,  //27
     -0.1,   -0.21,   0,  //28
     -0.1,    0.05,   0,  //29
     -0.26,   0.03,   0,  //30
     -0.43,  -0.04,   0,  //31
     -0.78,  -0.27,   0,  //32
     -0.64,  -0.05,   0,  //33
     -0.45,   0.21,   0,  //34
     -0.31,   0.45,   0,  //35
   ], 

   /**
    * He puesto los dos indices para poder hacer el contorno de la figura y que cuando la gire no desaparezca
    */
  // indices para gl.LINES
  "indicesLineas" : [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33, 34, 34, 35, 35, 0],
  // indices para gl.TRIANGLES
  indices: [
    0, 35, 1, 
    1, 35, 34,
    1, 34, 30, 
    34, 31, 30, 
    34, 31, 33, 
    33, 31, 32, 
    1, 30, 29, 
    1, 2, 29, 
    2, 29, 28, 
    28, 3, 2, 
    28, 3, 4, 
    28, 4, 27, 
    4, 5, 27, 
    5, 6, 10,
    6, 9, 10, 
    6, 7, 9, 
    7, 8, 9, 
    5, 10, 27, 
    10, 11, 27, 
    11, 12, 27, 
    12, 26, 27,
    12, 13, 26, 
    13, 14, 26, 
    25, 26, 14, 
    14, 24, 25, 
    14, 15, 24, 
    15, 16, 24, 
    16, 17, 24, 
    17, 23, 24, 
    17, 18, 23, 
    18, 19, 23, 
    19, 22, 23, 
    19, 20, 22, 
    20, 21, 22,
  ],
};

// variables y valores iniciales
var modelMatrix = glMatrix.mat4.create();
var traslacionX = 0; //Posicion inicial X
var traslacionY = 0; //Posicion inicial Y
var rotacionX = 0; //Rotacion inicial X
var rotacionY = 0; //Rotacion inicial Y
var escalaX = 1; //Escala inicial X
var escalaY = 1; //Escala inicial Y
var escalaXY = 1; //Escala inicial XY
anguloRotacion = 0; //Angulo de rotación inicial
var color = [0.0, 0.0, 0.0, 1.0]; // Color inicial

/****************/
/** FUNCIONES **/
/****************/
/** *************************************************
   initBuffers: iniciar los Bufferes
   En esta función crearemos el buffer de vértices y el buffer de índices
****************************************************/
// Inicializa los buffers
// Inicializa los buffers
function initBuffers() {
  model.idBufferVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(model.vertices),
    gl.STATIC_DRAW
  );

  model.idBufferIndices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(model.indices),
    gl.STATIC_DRAW
  );
}

function updateModelMatrix() {
  glMatrix.mat4.identity(modelMatrix);
  glMatrix.mat4.scale(modelMatrix, modelMatrix, [escalaX, escalaY, 1]);
  glMatrix.mat4.scale(modelMatrix, modelMatrix, [escalaXY, escalaXY, 1]);
  glMatrix.mat4.translate(modelMatrix, modelMatrix, [
    traslacionX,
    traslacionY,
    0,
  ]);
  glMatrix.mat4.rotateX(
    modelMatrix,
    modelMatrix,
    glMatrix.glMatrix.toRadian(rotacionX)
  );
  glMatrix.mat4.rotateY(
    modelMatrix,
    modelMatrix,
    glMatrix.glMatrix.toRadian(rotacionY)
  );
  glMatrix.mat4.rotateZ(
    modelMatrix,
    modelMatrix,
    glMatrix.glMatrix.toRadian(anguloRotacion)
  );
  draw();
}

// Resetea los valores de los sliders
function reset() {
  traslacionX = 0;
  traslacionY = 0;
  document.getElementById("sliderTX").value = 0;
  document.getElementById("sliderTY").value = 0;

  rotacionX = 0;
  rotacionY = 0;
  document.getElementById("sliderRX").value = 0;
  document.getElementById("sliderRY").value = 0;

  color = [0.0, 0.0, 0.0, 1.0];
  document.getElementById("sliderR").value = 0;
  document.getElementById("sliderG").value = 0;
  document.getElementById("sliderB").value = 0;
  document.getElementById("sliderAlfa").value = 255;

  escalaX = 1;
  escalaY = 1;
  escalaXY = 1;
  document.getElementById("sliderSX").value = 1;
  document.getElementById("sliderSY").value = 1;

  document.getElementById("sliderSXY").value = 1;

  anguloRotacion = 0;
  document.getElementById("sliderRXY").value = 0;
  document.getElementById("hexColor").value = "";

  updateModelMatrix();
  updateColor();
}

// Dibuja el modelo
function draw() {
  glProgram.vertexPositionAttribute = gl.getAttribLocation(
    glProgram,
    "aVertexPosition"
  );
  gl.enableVertexAttribArray(glProgram.vertexPositionAttribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer(
    glProgram.vertexPositionAttribute,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);

  // Pasa la matriz de modelo al vertex shader
  const modelMatrixLocation = gl.getUniformLocation(glProgram, "uModelMatrix");
  gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

  // Dibuja
  gl.drawElements(gl.LINES, model.indicesLineas.length, gl.UNSIGNED_SHORT, 0);
  // Para que no desaparezca la figura cuando la giro, dibujo el contorno
  gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
}

// Inicia WebGL y configura el canvas
function initWebGL() {
  canvas = document.getElementById("canvas");
  gl = canvas.getContext("webgl2");

  if (gl) {
    setupWebGL();
    initShaders();
    initBuffers();
    draw();

    // Añadir eventos para los sliders y botones
    document
      .getElementById("sliderR")
      .addEventListener("input", updateColor, false);
    document
      .getElementById("sliderG")
      .addEventListener("input", updateColor, false);
    document
      .getElementById("sliderB")
      .addEventListener("input", updateColor, false);
    document
      .getElementById("sliderAlfa")
      .addEventListener("input", updateColor, false);

    document.getElementById("sliderTX").addEventListener("input", function () {
      traslacionX = parseFloat(this.value);
      updateModelMatrix();
    });

    document.getElementById("sliderTY").addEventListener("input", function () {
      traslacionY = parseFloat(this.value);
      updateModelMatrix();
    });

    document.getElementById("sliderRX").addEventListener("input", function () {
      rotacionX = parseFloat(this.value);
      updateModelMatrix();
    });

    document.getElementById("sliderRY").addEventListener("input", function () {
      rotacionY = parseFloat(this.value);
      updateModelMatrix();
    });

    document.getElementById("sliderSX").addEventListener("input", function () {
      escalaX = parseFloat(this.value);
      updateModelMatrix();
    });

    document.getElementById("sliderSY").addEventListener("input", function () {
      escalaY = parseFloat(this.value);
      updateModelMatrix();
    });

    document.getElementById("sliderSXY").addEventListener("input", function () {
      escalaXY = parseFloat(this.value);
      updateModelMatrix();
    });

    document.getElementById("sliderRXY").addEventListener("input", function () {
      anguloRotacion = parseFloat(this.value);
      updateModelMatrix();
    });

    document.getElementById("reset").addEventListener("click", reset, false);
    document.getElementById("aleatorio").addEventListener("click", setColorAleatorio, false);
  } else {
    alert("webgl2 no está disponible");
  }
}

// Configura WebGL
function setupWebGL() {
  gl.clearColor(0.95, 0.95, 0.95, 1.0);
  gl.lineWidth(1.5);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);
}

// Inicializa los shaders y configura el color
function initShaders() {
  var fs_source = document.getElementById("shader-fs").innerHTML;
  var vs_source = document.getElementById("shader-vs").innerHTML;

  vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
  fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

  glProgram = gl.createProgram();
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);
  gl.linkProgram(glProgram);

  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
    alert("No se puede inicializar el Programa.");
  }

  gl.useProgram(glProgram);

  // Obtén la ubicación de la variable uniforme para el color
  colorLocation = gl.getUniformLocation(glProgram, "uColor");
  gl.uniform4f(colorLocation, 0.0, 0.0, 0.0, 1.0); // Color inicial negro
}

// Crea y compila cada shader
function makeShader(src, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Error de compilación del shader: " + gl.getShaderInfoLog(shader));
  }
  return shader;
}

// Función para actualizar el color en el shader
function updateColor() {
  // Obtener los valores actuales de los sliders
  var r = document.getElementById("sliderR").value;
  var g = document.getElementById("sliderG").value;
  var b = document.getElementById("sliderB").value;
  var alfa = document.getElementById("sliderAlfa").value;

  // Pasar el color actualizado al shader, dividiendo entre 255 para normalizar
  gl.uniform4f(colorLocation, r / 255, g / 255, b / 255, alfa / 255);

  setupWebGL(); // Limpia el buffer y vuelve a dibujar
  draw();
}

// Establece un color y un alfa aleatorio
function setColorAleatorio() {
  // Color aleatorio
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const alfa = Math.floor(Math.random() * 256);

  // Actualizar los sliders para el color aleatorio, funcionalidad del botón
  document.getElementById("sliderR").value = r;
  document.getElementById("sliderG").value = g;
  document.getElementById("sliderB").value = b;
  document.getElementById("sliderAlfa").value = alfa;
  document.getElementById("hexColor").value = "";

  gl.uniform4f(colorLocation, r / 255, g / 255, b / 255, alfa / 255);

  setupWebGL();
  draw();
}

// Convierte un color en formato HEX a RGB, funcionalidad del botón
function convertHexToRGB() {
  const hexInput = document.getElementById("hexColor").value;

  const hexPattern = /^#?([A-Fa-f0-9]{6})$/;
  if (!hexPattern.test(hexInput)) {
    document.getElementById("hexColor").value = "";
    alert("Por favor, ingresa un color en formato HEX válido (ej. #FFFFFF)");
    return;
  }

  const hex = hexInput.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  document.getElementById("sliderR").value = r;
  document.getElementById("sliderG").value = g;
  document.getElementById("sliderB").value = b;
  document.getElementById("sliderAlfa").value = 255;

  gl.uniform4f(colorLocation, r / 255, g / 255, b / 255, 1.0);

  setupWebGL();
  draw();
}
