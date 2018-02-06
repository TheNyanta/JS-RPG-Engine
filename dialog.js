var chatSequence = false;
var currentDialog;

function Dialog(text, img, choices) {
     
    this.chatCounter = 0;
    this.choices = choices
    this.selected = 0;
    this.text = text;
    
    this.started = false;
    this.next = false;
    
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
        if (this.chatCounter >= this.text.length) {
            chatSequence = false;
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
                // Changing choices needs a delay if you dont use a different key to select each choice: i.E. only up/down
                if (this.selected < 0) this.selected = this.selected + this.choices.length;
                else this.selected = this.selected % this.choices.length;
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
}