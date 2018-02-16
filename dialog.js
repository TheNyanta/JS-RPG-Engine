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
    this.enterPush = false;
    this.keyPush = false;

    this.y = 0;
    this.width;

    this.setDialog = function (text, img, choices) {
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
    this.event = function () {}

    this.update = function () {

        // TODO: Get a good position for the dialog on every map
        this.width = Math.min(maps.data[maps.currentMap].width, myGameArea.canvas.width);
        this.y = Math.min(maps.data[maps.currentMap].height, myGameArea.canvas.height) - 50; //40 => two lines á 30px serif

        this.enter();
        if (this.chatCounter >= this.text.length) {
            myGameArea.gameSequence = false;
            this.started = false;
            this.chatCounter = 0;
            currentDialog = undefined;
        } else {
            ctx = myGameArea.context;
            // Box
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            ctx.fillRect(0, this.y, this.width - 1, 50);
            ctx.strokeRect(0, this.y, this.width - 1, 50);
            ctx.globalAlpha = 1.0;
            // Text
            ctx.font = '30px serif';
            ctx.fillStyle = 'white';
            if (this.text[this.chatCounter] == "#choice") {

                this.selectChoice();

                for (i = 0; i < this.choices.length; i++) {
                    if (i == this.selected)
                        ctx.fillStyle = 'white';
                    else ctx.fillStyle = 'gray';
                    if (i == 0) ctx.fillText(this.choices[i], 50, this.y + 22);
                    if (i == 1) ctx.fillText(this.choices[i], 50, this.y + 44);
                    if (i == 2) ctx.fillText(this.choices[i], 200, this.y + 22);
                    if (i == 3) ctx.fillText(this.choices[i], 200, this.y + 44);

                }
            } else if (this.text[this.chatCounter] == "#entered") {
                // Custom Event for given choice
                this.event(this.selected);
                // Reset selection
                this.selected = 0;
                this.chatCounter++;
            } else
                ctx.fillText(this.text[this.chatCounter], 50, this.y + 22);
        }
    }

    this.selectChoice = function () {
        if (myGameArea.gameSequence) {
            if (myGameArea.keys) {
                if (myGameArea.keys[constants.KEY_W] || myGameArea.keys[constants.KEY_S]) {
                    if (this.keyPush) {
                        if (myGameArea.keys[constants.KEY_W]) currentDialog.selected--;
                        else if (myGameArea.keys[constants.KEY_S]) currentDialog.selected++;
                        this.keyPush = false;
                    }
                } else this.keyPush = true;
            }
        }

        // Changing choices needs a delay or single press checker if you don't use a different key to select each choice: i.E. only up/down
        if (this.selected < 0) this.selected = this.selected + this.choices.length;
        else this.selected = this.selected % this.choices.length;
    }

    this.enter = function () {
        if (myGameArea.keys) {
            // Enter key down
            if (myGameArea.keys[constants.KEY_ENTER]) {
                if (this.enterPush) {
                    this.chatCounter++;
                    this.enterPush = false;
                }
            }
            // Enter key up: Enable next enter push
            else this.enterPush = true;
        }
    }
}
