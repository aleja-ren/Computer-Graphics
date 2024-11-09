//Alejandra Gavino-Dias González



// Funcionalidad Javascript 
// Funciones generales de webgl
/** *************************************
   VARIABLES GLOBALES
*****************************************/
var canvas=null; // variable que identifica el canvas donde se pinta
var gl =null; // variable contexto webgl2 de la aplicación

var vertexShader,fragmentShader, glProgram;


var triangle = {
    "vertices": [0, 0, 0,
                -0.75, 0, 0,
                -0.375, 0.75, 0],

    "colors": [0.0, 0.0, 1.0,  
        0.0, 0.0, 1.0,  
        0.0, 0.0, 1.0]  //Azul
};

var triangle2 = {
    "vertices": [0, 0, 0,
                -0.375,0.75, 0,
                0.375, 0.75, 0],

    "colors": [1.0, 1.0, 0.0,  
        1.0, 1.0, 0.0,  
        1.0, 1.0, 0.0]  //Amarillo
};

var triangle3 = {
    "vertices": [0, 0, 0, 
                0.375, 0.75, 0, 
                0.75, 0, 0],

    "colors": [0.0, 0.0, 1.0,  
               0.0, 0.0, 1.0,  
               0.0, 0.0, 1.0]  //Azul
};

var triangle4 = {
    "vertices": [0, 0, 0,
                0.75, 0, 0,
                0.375, -0.75, 0],

    "colors": [0.0, 0.0, 1.0,  
        0.0, 0.0, 1.0,  
        0.0, 0.0, 1.0]  //Azul
};

var triangle5 = {
    "vertices": [0, 0, 0,
                0.375, -0.75, 0,
                -0.375, -0.75, 0],

    "colors": [1.0, 1.0, 0.0,  
        1.0, 1.0, 0.0,  
        1.0, 1.0, 0.0]  //Amarillo
};

var triangle6 = {
    "vertices": [0, 0, 0,
                -0.375, -0.75, 0,
                -0.75, 0, 0],
                
    "colors": [0.0, 0.0, 1.0,  
        0.0, 0.0, 1.0,  
        0.0, 0.0, 1.0]  //Azul
};

/****************/
/** FUNCIONES **/
/****************/
/** *************************************************
   initBuffers: iniciar los Bufferes
   En esta función crearemos el buffer de vértices y el buffer de índices
****************************************************/
function initBuffers(model){
    // Buffer de vertices
    model.bufferVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
 
    // Buffer de colores
    model.bufferColors = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.bufferColors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.colors), gl.STATIC_DRAW);
 }

/** *************************************************
   draw (model): Enlazar los bufferes a los vértices declarados
   
****************************************************/
function draw(model){

   gl.bindBuffer(gl.ARRAY_BUFFER, model.bufferVertices);

   /**
   * Obtener la referencia del atributo posición
   */
   glProgram.vertexPositionAttribute= gl.getAttribLocation(glProgram, "aVertexPosition");

   //Habilitamos el atributo: queremos proporcionar los datos de la posicion desde un buffer
   gl.enableVertexAttribArray(glProgram.vertexPositionAttribute);

   // Decimos a WebGL que coja los datos del buffer enlazado el ultimo
   // cuántos componentes por vertice, tipo de datos, si queremos que los datos se
   // normalicen (true) o no (false), cuántos bytes de datos hay que pasar para
   //llegar del primer dato al siguiente (0), el offset que nos indica cuán lejos está 
   //el dato dentro el buffer(0)
   gl.vertexAttribPointer(glProgram.vertexPositionAttribute,3, gl.FLOAT,false,0,0);

   // Aqui para los colores
   gl.bindBuffer(gl.ARRAY_BUFFER, model.bufferColors);
   glProgram.vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
   gl.enableVertexAttribArray(glProgram.vertexColorAttribute);
   gl.vertexAttribPointer(glProgram.vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

   //Dibuja el tipo de primitiva, desde qué elemento comienza y cuantos dibuja
   gl.drawArrays(gl.TRIANGLES, 0, 3);


}
/** *************************************************
==> Identifica el canvas y su contexto de webgl2
****************************************************/
function initWebGL(){
   /**
   Identificar el canvas y probar si admite el navegador webgl
   */
   canvas=document.getElementById("canvas");
   
    /** Obtener el contexto GL**/
   gl=canvas.getContext("webgl2");
   
   if (gl){
       // Funciones a ejecutar
       setupWebGL();
       initShaders();
       initBuffers(triangle);
       draw(triangle);

       initBuffers(triangle2);
       draw(triangle2);

       initBuffers(triangle3);
       draw(triangle3);

       initBuffers(triangle4);
       draw(triangle4);

       initBuffers(triangle5);
       draw(triangle5);

       initBuffers(triangle6);
       draw(triangle6);

   }	
   else{	
       alert ("webgl2 no esta disponible");
   }

}

/******************************************************
Limpia el buffer de color y configura el viewport
*******************************************************/

function setupWebGL()
{
   //Color de fondo del contexto
   // -- son RGB - canal alpha que define la opacidad de un pixel. 
   //                    1.0 opaco
   // Para qué sirve el canal alpha?-- para trabajar en capas
   gl.clearColor(0,0,0,1.0); // color del fondo

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

function initShaders()
{
// Esta función inicializa los shaders
            
//1.Obtengo la referencia de los shaders 
   var fs_source = document.getElementById('shader-fs').innerHTML;
   var vs_source = document.getElementById('shader-vs').innerHTML;        
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
               
function makeShader(src, type)
   {
   //COMPILAMOS EL VS
   var shader = gl.createShader(type);
   gl.shaderSource(shader, src);
   gl.compileShader(shader);

   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
       alert("Error de compilación del shader: " + gl.getShaderInfoLog(shader));     
       }
       return shader;
   }
           