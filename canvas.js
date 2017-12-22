var HTML = function (canvasId, width, height) {
    this.width = width;
    this.height = height;
    this.canvas = null;
    this.context = null;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    $(this.canvas).attr( { width: this.width, height: this.height });
    $(this.canvas).attr( { style: 'width: ' + this.width + 'px;' + 'height: ' + this.height + 'px;'});
}