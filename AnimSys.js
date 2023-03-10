class AnimSys {
   
  constructor(fps, frame_limit, onions_tint){
    this.fps = fps;
    this.frame_limit = frame_limit;
    this.onions_tint = onions_tint;
    this.framesList = [];
    
    this.frameGraphics = createGraphics(width, height);
    this.onionGraphics = createGraphics(width, height);
    
    this.UI = createDiv('');
    this.UI.id('ui-container');
    
    this.createFrame_btn = createButton("Create New Frame");
    this.createFrame_btn.mousePressed(this.create_new_frame.bind(this));
    this.createFrame_btn.parent(this.UI);
    
    //this.updateFrame_btn = createButton("Update Frame");
    //this.updateFrame_btn.mousePressed(this.update_frame.bind(this));
    //this.updateFrame_btn.parent(this.UI);
    
    this.play_btn = createButton("Play Anim");
    this.play_btn.mousePressed(this.play_anim.bind(this));
    this.play_btn.parent(this.UI);
    
    this.stop_btn = createButton("Stop Anim").hide();
    this.stop_btn.mousePressed(this.play_anim.bind(this));
    this.stop_btn.parent(this.UI);
    
    this.show_onion_btn = createButton("Show Onions");
    this.show_onion_btn.mousePressed(this.switch_onions.bind(this));
    this.show_onion_btn.parent(this.UI);
    
    this.hide_onion_btn = createButton("Hide Onions").hide();
    this.hide_onion_btn.mousePressed(this.switch_onions.bind(this));
    this.hide_onion_btn.parent(this.UI);
    
    this.clear_frame_btn = createButton("Clear Frame");
    this.clear_frame_btn.mousePressed(this.clear_frame.bind(this));
    this.clear_frame_btn.parent(this.UI);
        
    
    this.timeline = createDiv('timeline');
    this.timeline.id('timeline');
    
    this.frame_displayed = 0;
    
    this.isPlaying = false;
    this.play_interval = null;
    
    this.showOnions = false;
    
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  
  update_frame_list(){
    this.timeline.html('');
    for (let [i,frame] of this.framesList.entries()){
      let frameDiv = createDiv('frame ' + i);
      frameDiv.id('frame-number-' + i);
      frameDiv.class('aframe');
      frameDiv.parent(this.timeline);
      frameDiv.mousePressed( () =>{    
        this.display_frame(i);
      })
      redraw();
    } 
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  
  create_new_frame(data){
    
    if(this.framesList.length == this.frame_limit){
      console.warn('you cannot create more than ' + this.frame_limit + ' frames for this project')
    } else {
        let image64;
        if(data){
          image64 = data.image64;
        } else {
          this.frameGraphics.clear();
          this.frameGraphics.loadPixels(); 
          image64 = this.frameGraphics.canvas.toDataURL('image/png');
        }

        let new_frame = {
          "img_data": image64
        };
        this.framesList.push(new_frame);

        this.update_frame_list();

        if(this.framesList.length > 0){
          this.frame_displayed = this.framesList.length -1;
        }

        this.display_frame(this.frame_displayed);
    }    
      
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  
  display_frame(frame_index){
    
    if(this.isPlaying == true){
      
      if(frame_index == this.framesList.length - 1){
        frame_index = 0;
      } else {       
        frame_index++;
      }
      
    }
    
    this.frame_displayed = frame_index;
    
    let getAllDiv = document.querySelectorAll('.aframe');
    getAllDiv.forEach(aframe => {  
      aframe.classList.remove('current-frame');
    });
    
    let getDiv = select('#frame-number-' + this.frame_displayed);
    getDiv.addClass('current-frame');

    
    let display = loadImage(this.framesList[frame_index].img_data, function(){
      
      this.frameGraphics.clear();
      
      this.frameGraphics.image(display, 0, 0);
      
    }.bind(this));
    
    //redraw();
    // ONIONS À TRAITER DANS UNE FUNCTION À PART POUR + D'EFFICACITÉ
        
    

    if( (this.isPlaying == false && this.showOnions == true) || (this.isPlaying == true && this.showOnions == true) ){
      
      let onion_index;
    
    if (frame_index == 0){
      
      onion_index = this.framesList.length - 1;
      
    } else {
      
      onion_index = frame_index - 1;
      
    }
      
      let displayOnions = loadImage(this.framesList[onion_index].img_data, function(){

        this.onionGraphics.clear();
        this.onionGraphics.tint(255, this.onions_tint);
        this.onionGraphics.image(displayOnions, 0, 0);
        
      }.bind(this));
    }

    
    
    
    setTimeout(redraw, 10)
        
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  update_frame(){
      
    this.frameGraphics.loadPixels();   
    let image64 = this.frameGraphics.canvas.toDataURL('image/png');
    
    let data = {"image64": image64}
    
    if(this.framesList.length == 0){
      
      this.create_new_frame(data);
      
    } else {
      
      this.framesList[this.frame_displayed].img_data = image64;     
      
    }
    
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  clear_frame(){ 
    
    this.frameGraphics.clear();
    this.update_frame();
    redraw();
  }
  
  // -----------------------------------------
  // -----------------------------------------
  
  switch_onions(){
    if(this.showOnions == false){
      
      this.showOnions = true;
      this.show_onion_btn.hide();
      this.hide_onion_btn.show();
      
    } else {
      
      this.showOnions = false;
      this.hide_onion_btn.hide();
      this.show_onion_btn.show();
    
    }
    
    setTimeout(function(){
      this.display_frame(this.frame_displayed)
    }.bind(this), 10);
    
  }
  
  // -----------------------------------------
  // -----------------------------------------

  play_anim(){
    if(this.framesList.length > 0){
      if (this.isPlaying == false){
        this.isPlaying = true;
        this.play_interval = setInterval(function(){
            this.display_frame(this.frame_displayed)
          }.bind(this), 1000/this.fps);
        this.play_btn.hide();
        this.stop_btn.show();
      } else {
        clearInterval(this.play_interval);
        this.isPlaying = false;
        this.stop_btn.hide();
        this.play_btn.show();
        
      }
    } else {
      console.log("Create a first capture before playing")
    }
  }
  
}