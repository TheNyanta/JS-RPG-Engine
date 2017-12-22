var Sprite = function(fn) {
    
    this.TO_RADIANS = Math.PI/100;
    this.image = null;
    this.is_pattern = false;
    this.pattern = null;
    this.pattern_x_times = 0;
    this.load = function(filename) { this.image = new Image(); this.image.src = filename};
    this.to_pattern = function(x_times) { this.pattern_x_times = x_times;}
    
    /* animated sprites start*/
    this.animationDelay = 0;
    this.animationIndexCounter = 0;
    this.animationCurrentFrame = 0;    
    /* animated sprites end */
    
    //Load the sprite
    if (fn != undefined && fn != "" && fn != null){
        this.load(fn);
        console.log("Loaded sprite " + fn);
    } else
    {
        console.log("Unable to load sprite. Filename '" + fn + "' is undefined");
    }
    
    //Normal draw
    this.draw = function(x, y) {
        Context.context.drawImage(this.image, x, y, BLOCK_W, BLOCK_H);
    };
    
    //Stretched draw
    this.draw2 = function(x, y, w, h) {
        if (this.is_pattern) {
            for (var i = 0; i < this.pattern_x_times; i++) {
                Context.context.drawImage(this.image, x + w*i, y, w, h);
            }
        } else {
            Context.context.drawImage(this.image, x, y, w, h);
        }
    }
    
    //Rotated draw
    this.rot = function(x, y, angle) {
        Context.context.save();
        Context.context.translate(x,y);
        Context.context.rotate(angle * this.TO_RADIANS);
        Context.context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
        Context.context.restore();
    }
    
    //Animated draw
    this.drawAnimated = function(x, y, spriteSheetIndex) {
        if (this.animationDelay++ >= 3) {
            this.animationDelay = 0;
            this.animationIndexCounter++;
            if (this.animationIndexCounter >= spriteSheetIndex.length) {
                this.animationIndexCounter = 0;
            }
            this.animationCurrentFrame = spriteSheetIndex[this.animationIndexCounter];
        }        
        var res = i2xy(this.animationCurrentFrame, 13);        
        Context.context.drawImage(this.image, res[0]*64, res[1]*64, 64, 64, x, y, 64, 64);
    }
};