//Alejandra Gavino-Dias González

// Funcionalidad Javascript
// Funciones generales de webgl
/** *************************************
   VARIABLES GLOBALES
*****************************************/
var canvas = null; // variable que identifica el canvas donde se pinta
var gl = null; // variable contexto webgl2 de la aplicación

var vertexShader, fragmentShader, glProgram;

var maxDepth = 0; // Establece la profundidad inicial a 1

// Triángulo inicial
var initialTriangle = {
  vertices: [],
  colors: [
    1.0,
    0.0,
    0.0, // Rojo
    0.0,
    1.0,
    0.0, // Verde
    0.0,
    0.0,
    1.0, // Azul
  ],
};

/****************/
/** FUNCIONES **/
/****************/
function generateKochVertices(vertices, depth) {
  if (depth === 0) {
    return vertices;
  }

  let newVertices = [];
  for (let i = 0; i < vertices.length; i += 6) {
    let x1 = vertices[i],
      y1 = vertices[i + 1];
    let x2 = vertices[i + 3],
      y2 = vertices[i + 4];

    // Calcular puntos intermedios
    let xA = x1 + (x2 - x1) / 3;
    let yA = y1 + (y2 - y1) / 3;

    let xB = x1 + ((x2 - x1) * 2) / 3;
    let yB = y1 + ((y2 - y1) * 2) / 3;

    // Punto en el "pico" del fractal
    let dx = xB - xA;
    let dy = yB - yA;
    let xC = xA + dx / 2 - (dy * Math.sqrt(3)) / 2;
    let yC = yA + dy / 2 + (dx * Math.sqrt(3)) / 2;

    // Añadir los nuevos puntos
    newVertices.push(x1, y1, 0, xA, yA, 0);
    newVertices.push(xA, yA, 0, xC, yC, 0);
    newVertices.push(xC, yC, 0, xB, yB, 0);
    newVertices.push(xB, yB, 0, x2, y2, 0);
  }

  return generateKochVertices(newVertices, depth - 1);
}

/****************************************************
   initBuffers: iniciar los Bufferes
   En esta función crearemos el buffer de vértices y el buffer de índices
****************************************************/
function initBuffers(model) {
  // Inicializamos los vértices del triángulo equilátero
  const sideLength = 1;
  const height = (Math.sqrt(3) / 2) * sideLength;
  model.vertices = [
    -sideLength / 2,
    -height / 2,
    0, // Vértice 1
    sideLength / 2,
    -height / 2,
    0, // Vértice 2
    sideLength / 2,
    -height / 2,
    0, // Vértice 2 de nuevo, para cerrar el triángulo
    0,
    height / 2,
    0, // Vértice 3
    0,
    height / 2,
    0, // Vértice 3 de nuevo
    -sideLength / 2,
    -height / 2,
    0, // Vértice 1 de nuevo para cerrar el triángulo
  ];

  // Generamos el fractal de Koch con la profundidad actual
  model.vertices = generateKochVertices(model.vertices, maxDepth);

  // Buffer de vértices
  model.bufferVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, model.bufferVertices);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(model.vertices),
    gl.STATIC_DRAW
  );

  // Buffer de colores
  model.bufferColors = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, model.bufferColors);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(model.colors),
    gl.STATIC_DRAW
  );
}

/** *************************************************
   draw (model): Enlazar los bufferes a los vértices declarados
   
****************************************************/
function draw(model) {
  gl.bindBuffer(gl.ARRAY_BUFFER, model.bufferVertices);

  glProgram.vertexPositionAttribute = gl.getAttribLocation(
    glProgram,
    "aVertexPosition"
  );
  if (glProgram.vertexPositionAttribute !== -1) {
    gl.enableVertexAttribArray(glProgram.vertexPositionAttribute);
    gl.vertexAttribPointer(
      glProgram.vertexPositionAttribute,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, model.bufferColors);
  glProgram.vertexColorAttribute = gl.getAttribLocation(
    glProgram,
    "aVertexColor"
  );
  if (glProgram.vertexColorAttribute !== -1) {
    gl.enableVertexAttribArray(glProgram.vertexColorAttribute);
    gl.vertexAttribPointer(
      glProgram.vertexColorAttribute,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  // Dibujar todas las líneas generadas por el fractal
  gl.drawArrays(gl.LINES, 0, model.vertices.length / 3);
}
/** *************************************************
==> Identifica el canvas y su contexto de webgl2
****************************************************/
function initWebGL() {
  /**
   Identificar el canvas y probar si admite el navegador webgl
   */
  canvas = document.getElementById("canvas");

  /** Obtener el contexto GL**/
  gl = canvas.getContext("webgl2");

  if (gl) {
    // Funciones a ejecutar
    setupWebGL();
    initShaders();
    initBuffers(initialTriangle);
    draw(initialTriangle);
  } else {
    alert("webgl2 no esta disponible");
  }
}

/******************************************************
Limpia el buffer de color y configura el viewport
*******************************************************/

function setupWebGL() {
  //Color de fondo del contexto
  // -- son RGB - canal alpha que define la opacidad de un pixel.
  //                    1.0 opaco
  // Para qué sirve el canal alpha?-- para trabajar en capas
  gl.clearColor(0, 0, 0, 1.0); // color del fondo

  // rellena el buffer de color con el color indicado por clearColor
  // y pintalo
  gl.clear(gl.COLOR_BUFFER_BIT);

  //Crea un viewport del tamaño del canvas
  gl.viewport(0, 0, canvas.width, canvas.height);
}

/******************************************************
Compila cada uno de los shaders, los linka y obtiene una referencia
al programa con los shaders añadidos y compilados
*******************************************************/

function initShaders() {
  // Esta función inicializa los shaders

  //1.Obtengo la referencia de los shaders
  var fs_source = document.getElementById("shader-fs").innerHTML;
  var vs_source = document.getElementById("shader-vs").innerHTML;
  //2. Compila los shaders
  vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
  fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

  //3. Crea un programa
  glProgram = gl.createProgram();

  //4. Adjunta al programa cada shader
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);
  gl.linkProgram(glProgram);

  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
    alert("No se puede inicializar el Programa .");
  }

  //5. Usa el programa
  gl.useProgram(glProgram);
}

/******************************************************
Crea cada shader y lo compila
*******************************************************/

function makeShader(src, type) {
  //COMPILAMOS EL VS
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Error de compilación del shader: " + gl.getShaderInfoLog(shader));
  }
  return shader;
}

function updateDepth(value) {
  maxDepth = parseInt(value);
  document.getElementById("sliderValue").textContent = value; // Actualiza el valor mostrado en el HTML

  initBuffers(initialTriangle); // Regenera el fractal
  setupWebGL(); // Limpia el canvas

  setColorBasedOnDepth(maxDepth); // Cambia el color según la profundidad
  draw(initialTriangle); // Redibuja con la nueva profundidad y color
}

function setColorBasedOnDepth(depth) {
  const colorLocation = gl.getUniformLocation(glProgram, "colorUniform");

  // Genera un color dinámico basado en la profundidad
  const red = depth / 5; // Cambia el valor rojo según la profundidad
  const green = (5 - depth) / 5; // Cambia el verde inversamente
  const blue = 0.5; // Mantén el azul fijo, o cámbialo según prefieras

  gl.uniform4f(colorLocation, red, green, blue, 1.0); // Color en RGBA
}
