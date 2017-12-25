function DrawDialog(text, options) {
    var box = new Rectangle(0, 0, canvasWidth, 50);
    box.draw('black',true);
    
    var dialog = document.getElementById('game').getContext('2d');
    dialog.font = '30px serif';
    dialog.fillStyle = 'white';
    dialog.fillText(text, 50, 35);

}