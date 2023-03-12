class DrawHandler {
  
  constructor(){
    
    // create a layer that will handle drawing phase
    this.drawGraphic = createGraphics(width, height);
    
    // create an array to store all paths
    this.drawings = [];
    
    // create an array to store path's points being produced
    this.currentPath = [];
    
    // bool to check if user is drawing, pencil touching and dragged on the canvas
    this.isDrawing = false;
    
    // bool to check if user is using eraser instead
    this.isErasing = false;
    
    // set the eraser radius
    this.eraserRadius = 10;
    
    this.pencil_btn = createButton('<i class="fa-solid fa-pencil"></i>');
    this.pencil_btn.mousePressed(this.pickPencil.bind(this));
    this.pencil_btn.parent('left-panel');
    this.pencil_active = true;
    this.pencil_btn.addClass('tool-active');
    
    this.eraser_btn = createButton('<i class="fa-solid fa-eraser"></i>');
    this.eraser_btn.mousePressed(this.pickEraser.bind(this));
    this.eraser_btn.parent('left-panel');
    this.eraser_active = false;
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  pickPencil(){
    this.isErasing = false;
    if(this.pencil_active == false){
      this.pencil_active = true;
      this.pencil_btn.addClass('tool-active');
      this.eraser_active = false;
      this.eraser_btn.removeClass('tool-active');
    } 
  }
  
  pickEraser(){
    this.isErasing = true;
    if(this.eraser_active == false){
      this.eraser_active = true;
      this.eraser_btn.addClass('tool-active');
      this.pencil_active = false;
      this.pencil_btn.removeClass('tool-active');
      
    } 
    
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  // this function calls the trueErase() method applied on the targeted layer
  mouseDragged(target_graphics){
  
    if(Draws.isDrawing && Draws.isErasing){
      
      this.trueErase(this.eraserRadius, target_graphics); 
      
    }
    
    redraw();
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  // this function checks if a key is down, 
  // if so do corresponding task
  keydown_check(){
    
    // checks if the "E" key is down, 
    // if so set isErasing bool to true while "E" key is down
    if (keyIsDown(69)){ // KEY E
      this.pickEraser();
      this.isErasing = true;
      
    } else {
      this.pickPencil();
      this.isErasing = false;
      
    } 
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  startPath() {
  
    Cursor.calculateAngle();

    for (let i = 0; i < brushesPoints.length; i++) {
      
        brushesPoints[i]
          .calcPointCoordinates(mouseX, 
                                mouseY,
                                Cursor.targeAngle,
                                Cursor.diameter
                               );
    
    }


    for (let i = 0; i < brushesPoints.length; i++) {
        brushesPoints[i].resetPointOrigin();
    }

    this.isDrawing = true;
    this.currentPath = [];

    //console.log("——");
    //console.log("You started a new path!");
    this.drawings.push(this.currentPath);
    //console.log("A new array of points is pushed in 'drawings'");

  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  endPath(source_graphics, target_graphics) {
    this.isDrawing = false;

    // on affiche le nouveau drawings sur la target 
    target_graphics.image(source_graphics, 0, 0);
    // on vide le drawings array
    //this.drawings = [];
    // on clear le drawGraphic
    source_graphics.clear();  
    //on redraw
    redraw();
  }
  
  trueErase(r, target){
    // target is the graphics you want to erase on | e.g: className.frameGraphics
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
  
  drawLines(index, color, size, graphics){
    //Shows the current drawing if there any data in drawing array

    if(this.isDrawing == true && this.isErasing == false){

      for (let i = 0; i < this.drawings.length; i++) {

        let path = this.drawings[i];

        if (path.length != 0) {
          noFill();

          for (let j = 0; j < path.length; j++) {


            push();

              graphics.beginShape();
              graphics.strokeWeight(size);
              graphics.noFill();
              graphics.stroke(color); // A     

              graphics.curveVertex(path[j].x1[index], path[j].y1[index]);
              graphics.curveVertex(path[j].x2[index], path[j].y2[index]);
              graphics.curveVertex(path[j].x3[index], path[j].y3[index]);
              graphics.curveVertex(path[j].x4[index], path[j].y4[index]);

              graphics.endShape();

            pop();


          }
        } 
      }
    } 
  }
  
}