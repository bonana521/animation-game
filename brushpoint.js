class BrushPoint{
  
  constructor(name, dist, piPosition) {
    this.name = name;
    this.dist = dist;
    this.piPosition = piPosition
    
    this.px;
    this.py;
    this.ppx;
    this.ppy;
    this.sx;
    this.sy;
    this.pointerX;
    this.pointerY;
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  calcPointCoordinates(mouseX, mouseY, angle, pressure){
    this.pointerX = mouseX + (this.dist * pressure) * cos(angle + this.piPosition);
    this.pointerY = mouseY + (this.dist * pressure) * sin(angle + this.piPosition);
    //console.log('class: ' + this.pointerX + ' ' + this.pointerY)
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  resetPointOrigin(){
    this.sx = this.pointerX;
    this.sy = this.pointerY;
    this.px = this.pointerX;
    this.py = this.pointerY;
    this.ppx = this.pointerX;
    this.ppy = this.pointerY;
    //console.log(this.sx, this.sy, this.px, this.py, this.ppx, this.ppy)
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  shiftPointVertex(){
    this.sx = this.ppx;
    this.sy = this.ppy;
    this.ppx = this.px;
    this.ppy = this.py;
    this.px = this.pointerX;  
    this.py = this.pointerY;
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  pushPoints(point){
    point.x1.push(this.sx)
      point.y1.push(this.sy)
      point.x2.push(this.ppx)
      point.y2.push(this.ppy)
      point.x3.push(this.px)
      point.y3.push(this.py)
      point.x4.push(this.pointerX)
      point.y4.push(this.pointerY)
  }
  
}