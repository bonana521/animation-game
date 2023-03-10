class DrawHandler {
  
  constructor(){
    this.drawGraphic = createGraphics(width, height);

    this.drawings = [];

    this.currentPath = [];
    
    this.isDrawing = false;
    
    this.isErasing = false;
    
    this.eraserRadius = 10;
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  mouseDragged(target_graphics){
  
    if(Draws.isDrawing && Draws.isErasing){
      
      this.trueErase(this.eraserRadius, target_graphics); 
      
    }
    
    redraw();
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  keydown_check(){
    
    if (keyIsDown(69)){ // KEY E
      this.isErasing = true;
    } else {
      this.isErasing = false;
    } 
    
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  startPath() {
  
    Cursor.calculateAngle();

    for (let i = 0; i < brushesPoints.length; i++) {
        brushesPoints[i].calcPointCoordinates(mouseX, mouseY, Cursor.targeAngle, Cursor.diameter);
    }


    for (let i = 0; i < brushesPoints.length; i++) {
        brushesPoints[i].resetPointOrigin()
    }

    this.isDrawing = true;
    this.currentPath = [];

    //console.log("——");
    //console.log("You started a new path!");
    this.drawings.push(this.currentPath);
    //console.log("A new array of points is pushed in 'drawing'");

  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  endPath(target_graphics) {
    this.isDrawing = false;

    // on affiche le nouveau drawings sur la target (ici: frameGraphics)
    target_graphics.image(this.drawGraphic, 0, 0);
    // on vide le drawings array
    this.drawings = [];
    // on clear le drawGraphic
    this.drawGraphic.clear();  
    //on redraw
    redraw();
  }
  
  trueErase(r, target){
    // target is the graphics you want to erase on | e.g: ani.frameGraphics
    target.loadPixels();

    for (let x = mouseX - r; x < mouseX + r; x++) {
      for (let y = mouseY - r; y < mouseY + r; y++) {
        if ((dist(x,y, mouseX, mouseY) < r) && x > 0 && x <= width) {

          target.set(x,y,color(0,0));

        }
      }
    }

    target.updatePixels();
    
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  get_new_current_path(){
    if (this.isDrawing == true && this.isErasing == false) {
    
      this.drawGraphic.clear();

      let point = {
        x1: [],
        y1: [],
        x2: [],
        y2: [],
        x3: [],
        y3: [],
        x4: [],
        y4: []
      }
      this.currentPath.push(point);

      for (let i = 0; i < brushesPoints.length; i++) {
        brushesPoints[i].shiftPointVertex()
        brushesPoints[i].pushPoints(point);   
      }

    }

  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  drawLines(index, color){
    //Shows the current drawing if there any data in drawing array

    if(this.isDrawing == true && this.isErasing == false){

      for (let i = 0; i < this.drawings.length; i++) {

        let path = this.drawings[i];

        if (path.length != 0) {
          noFill();

          for (let j = 0; j < path.length; j++) {


            push();

              this.drawGraphic.beginShape();
              this.drawGraphic.strokeWeight(4);
              this.drawGraphic.noFill();
              this.drawGraphic.stroke(color); // A     

              this.drawGraphic.curveVertex(path[j].x1[index], path[j].y1[index]);
              this.drawGraphic.curveVertex(path[j].x2[index], path[j].y2[index]);
              this.drawGraphic.curveVertex(path[j].x3[index], path[j].y3[index]);
              this.drawGraphic.curveVertex(path[j].x4[index], path[j].y4[index]);

              this.drawGraphic.endShape();

            pop();


          }
        } 
      }
    } 
  }
  
}