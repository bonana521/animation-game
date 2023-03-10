// WORKING VERSION OF ANIMATION SYSTEM
// Author: Sylvain Filoni @fffiloni
// ERASER is binded to the frameGraphics, and all the drawings operations works on the drawGraphic
// Each path is displayed on the frameGraphics before being deleted to make the eraser working properly
// Systeme à reproduire pour les autres projet, c'est le plus efficace, et le plus maniable ;)

let canvas;
let Cursor;
let AS;
let Draws;
let Pencil;
let brushesPoints = [];

//-----------------------------------------------------
//-----------------------------------------------------


function setup() {
    
  canvas = createCanvas(512, 512);
  canvas.id('canvas');
  noLoop();
  pixelDensity(2);
  background('white');
  
  AS = new AnimSys(24, 6, 30);
  Draws = new DrawHandler();
  
  Cursor = new OrientedCursor('canvas');
  Cursor.catchCursor();
  
  Pencil = new BrushPoint('pencil', 0, 0); 
  brushesPoints.push(Pencil);
  
  canvas.mousePressed(function(){
    Draws.startPath();
  });
  canvas.mouseReleased(function(){
    Draws.endPath(AS.frameGraphics);
    AS.update_frame();
  });
    
} // END SETUP


//-----------------------------------------------------
//-----------------------------------------------------


function mouseDragged(){
  
  Draws.mouseDragged(AS.frameGraphics);
  
}


//-----------------------------------------------------
//-----------------------------------------------------


function draw() {
  
  Draws.keydown_check();
  
  clear();
  background('white');
    
  if(Cursor.isOnCanvas == false){
    Cursor.tiltX = 0;
    Cursor.tiltY = 0;
  }
  
  //MAP THE PRESSURE VALUE TO VISIBLE ONES
  Cursor.mapPressure();
    
  Draws.get_new_current_path();

  
  // ANGLE WE ARE LOOKING FOR TO KEEP TRACK OF THE STYLUS TILT
  Cursor.calculateAngle()
        
  
  for (let i = 0; i < brushesPoints.length; i++) {
      brushesPoints[i].calcPointCoordinates(mouseX, mouseY, Cursor.targetAngle, Cursor.diameter);
  }
   
  
  Draws.drawLines(0, 'black'); // pencil
  
  //------------
  
  if(AS.showOnions == true){
   
    image(AS.onionGraphics, 0, 0);  
    
  }
  
  image(AS.frameGraphics, 0, 0)
  image(Draws.drawGraphic, 0, 0)
  
  if(Draws.isDrawing){
  
    Cursor.showCursor(mouseX, mouseY);
    
  }
  
  Cursor.showData();
  

} // END DRAW