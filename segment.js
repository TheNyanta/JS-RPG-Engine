var Segment = function(x, y, vecx, vecy) {
    this.x = x;
    this.y = y;
    this.vecx = vecx;
    this.vecy = vecy;
    
    this.draw = function(width, color) {
        gfx.beginPath();
        gfx.lineWidth = width; //2px
        gfx.moveTo(this.x, this.y);
        gfx.lineTo(this.x + vecx, this.y + vecy);
        gfx.strokeStyle = color;
        gfx.stroke();
    }
    
    this.length = function() {
        var dx = this.vecx;
        var dy = this.vecy;
        return Math.sqrt(dx * dx + dy * dy);
    }
};