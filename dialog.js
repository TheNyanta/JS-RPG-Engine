var gameSequence = false;
var currentDialog;

/**
* 
* Dialog types: normal text, interactive text [choices]
*/
function dialog(text, img, choices) {
     
    this.chatCounter = 0;
    this.choices = choices;
    this.selected = 0;
    this.text = text;
    
    this.started = false;
    this.enterEvent = false;
    
    this.setDialog = function(text, img, choices) {
        this.text = text;
        //this.img = img;
        this.choices = choices;
    }
    /*
    if (img != undefined) {
        img.draw2(0, 0, 50, 50);
    }
    */
    // @Overwrite if custom funcion
    this.event = function() {}
    
    this.update = function() {
        this.enter();
        if (this.chatCounter >= this.text.length) {
            gameSequence = false;
            this.started = false;
            this.chatCounter = 0;
        }
        else {             
            ctx = myGameArea.context;
            // Box
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            ctx.fillRect(0, 300, 560, 50);
            ctx.strokeRect(0, 300, 560, 50);
            // Text
            ctx.font = '30px serif';
            ctx.fillStyle = 'white';
            if (this.text[this.chatCounter]=="#choice") {
                    
                this.selectChoice();
                
                for (i=0; i < this.choices.length; i++) {
                    if (i == this.selected)
                        ctx.fillStyle = 'white';
                    else ctx.fillStyle = 'gray';
                    ctx.fillText(this.choices[i], 50, 325 + i*20);
                }
            }
            else if (this.text[this.chatCounter]=="#entered") {
                // Custom Event for given choice
                this.event(this.selected);
                // Reset selection
                this.selected = 0;
                this.chatCounter++;
            }
            else
                ctx.fillText(this.text[this.chatCounter], 50, 335);
        }
    }
    
    this.selectChoice = function() {
        if (gameSequence) {
            if (myGameArea.keys) {
                if (myGameArea.keys[KEY_1] || myGameArea.keys[KEY_W]) currentDialog.selected = 0
                else if (myGameArea.keys[KEY_2] || myGameArea.keys[KEY_S]) currentDialog.selected = 1;
                else if (myGameArea.keys[KEY_3]) currentDialog.selected = 2;
                else if (myGameArea.keys[KEY_4]) currentDialog.selected = 3;
            }
        }
        
        // Changing choices needs a delay or single press checker if you don't use a different key to select each choice: i.E. only up/down
        if (this.selected < 0) this.selected = this.selected + this.choices.length;
        else this.selected = this.selected % this.choices.length;
    }
    
    this.enter = function() {
        if (myGameArea.keys) {
            // Enter key down
            if (myGameArea.keys[KEY_ENTER]) {
                if (this.enterEvent) {
                    this.chatCounter++;
                    this.enterEvent = false;
                }
            }
            // Enter key up: Enable enter event
            else this.enterEvent = true;
        }
    }
}