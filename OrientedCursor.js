class OrientedCursor{
 
  constructor(elementID){
    
    this.elementID = elementID;
    this.tiltX = 0;
    this.tiltY = 0;
    this.pressure = 0;
    this.diameter = 0;
    
    this.targetAngle = 0;
    
    this.isOnCanvas = false;
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  
  catchCursor(){
    let getCanvas = document.getElementById(this.elementID);
    
    getCanvas.addEventListener("pointermove", (e) => {
      //console.log("pointerMove");
  
      if (this.isOnCanvas) {
        this.tiltX = e.tiltX;
        this.tiltY = e.tiltY;
        this.pressure = e.pressure;
      
        //console.log(inclinationX + ' ' + inclinationY + ' ' + pressure);
      }
    }, false);

    getCanvas.addEventListener("pointerdown", (e) => {
      //console.log("pointerDown");
      getCanvas.setPointerCapture(e.pointerId);
      this.isOnCanvas = true;
  
      this.tiltX = e.tiltX;
      this.tiltY = e.tiltY;
      this.pressure = e.pressure;
    
    }, false);

    getCanvas.addEventListener("pointerup", (e) => {
      //console.log("pointerUp");
    
      if (this.isOnCanvas) {
        getCanvas.releasePointerCapture(e.pointerId);
        this.isOnCanvas = false;
    
        this.tiltX = e.tiltX;
        this.tiltY = e.tiltY;
        this.pressure = e.pressure;
    
        //console.log(inclinationX + ' ' + inclinationY + ' ' + pressure);
      
      }
    }, false);
  }
  
  
  // -----------------------------------------
  // -----------------------------------------
  
  
  calculateAngle(){
    this.targetAngle = atan2(this.tiltY, this.tiltX);
  }
  
  
  // -----------------------------------------
  // -----------------------------------------
  
  
  showData(){
  // LIVE COORDINATES
  push();
    //noFill();
    fill('#000');
    noStroke();
    //stroke('#000');
    text('pressure: ' + this.pressure, 10, 30);
    text('tilt_X: ' + this.tiltX, 10, 50);
    text('tilt_Y: ' + this.tiltY, 10, 70);
    text('angle arctan: ' + this.targetAngle, 10, 90);
  pop();
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  
  mapPressure(){
    this.diameter = map(this.pressure, 0, 1, 1, 3);
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  
  process_rotate(){
    translate(mouseX, mouseY); //mouseX & mouseY
    rotate(this.targetAngle);
    translate(-mouseX, -mouseY); // -mouseX & -mouseY
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  
  showCursor(mouseX, mouseY){
    // POINTER CENTER   
    push();
      noStroke();
      fill(0, 0, 0);
      circle(mouseX, mouseY, 20);
    pop();
    
    // RECTANGLE SHAPE
    push();
      this.process_rotate()

      noFill();
      stroke(2)
      rectMode(CENTER)
      rect(mouseX, mouseY, this.diameter, 30); // reacts to pen pressure value
    
      noStroke();
      fill('yellow');
      circle(mouseX, mouseY, 10); // shows the pivot point 
    pop();
   
    // POINTS FROM STYLUS AT GOOD INCLINATION & PRESSURE VALUE
    push();
      this.process_rotate();
      noFill();
      stroke(1);
      ellipseMode(CENTER);
      circle(mouseX, mouseY + this.diameter, 10); // LEFT  || WEST
      circle(mouseX + this.diameter, mouseY, 10);// DOWN  || SOUTH
      circle(mouseX, mouseY - this.diameter, 10); // RIGHT || EAST
      circle(mouseX - this.diameter, mouseY, 10); // UP    || NORTH
    
    
    pop();
  
    circle(mouseX + this.diameter/4 * cos(this.targetAngle), mouseY + this.diameter/4 * sin(this.targetAngle), 1)
    circle(mouseX + this.diameter/4 * cos(this.targetAngle + PI), mouseY + this.diameter/4 * sin(this.targetAngle+ PI), 1)
  
 
  // TILT AXIS & LENGTH
  push();
    fill('red');
    circle(mouseX + this.tiltX, mouseY + this.tiltY, 10);
  
  pop();
  
  push();
    fill('blue'); 
    circle(mouseX - this.tiltX, mouseY - this.tiltY, 10);
  pop();
  }
  
}