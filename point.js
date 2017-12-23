var Point = function(_x, _y) {
    this.x = _x;
    this.y = _y;
    
    this.draw = function(size, color) {
        gfx.beginPath();
        gfx.arc(this.x, this.y, size, 0, 2 * Math.PI, true);
        // Fill
        gfx.fillStyle = color;
        gfx.fill();
        // Outline
        gfx.strokeStyle = color;
        gfx.stroke();
    };
};