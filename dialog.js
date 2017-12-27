var chatSequence = false;
var dialogText = "";

function DrawDialog(text, img, isChat) {
    var box = new Rectangle(0, 0, canvasWidth, 50);
    box.draw('black',true);
    
    var dialog = document.getElementById('game').getContext('2d');
    dialog.font = '30px serif';
    dialog.fillStyle = 'white';
    dialog.fillText(text, 50, 35);
    
    if (img != undefined) {
        img.draw2(0, 0, 50, 50);
    }
    
    // Stop all motions if its a chat sequence
    if (isChat) {
        chatSequence = true;
    }
    

}