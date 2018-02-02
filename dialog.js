var chatSequence = false;

function Dialog(text, img) {
     
    this.chatCounter = -1;
    
    // Layout of the chat box
    this.box = new component(0, 300);
    this.box.rectangle(560, 50, "black", true, "black", true);
    
    /*
    if (img != undefined) {
        img.draw2(0, 0, 50, 50);
    }
    */
    
    this.update = function() {
        if (this.chatCounter >= text.length) {
            chatSequence = false;
            this.chatCounter = -1;
        }
        else {          
            this.box.update();      
            ctx = myGameArea.context;
            ctx.font = '30px serif';
            ctx.fillStyle = 'white';
            ctx.fillText(text[this.chatCounter], 50, 335);
        }
    }
}