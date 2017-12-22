var World = function(w, h) {
    this.mx = 0;
    this.my = 0;
    this.width = w;
    this.height = h;
    this.map = 0;
    this.draw = function() {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var id = this.map[x + (y * this.width)];
                if (id === 0) continue;
                sprites[id].draw(this.mx + (x * BLOCK_W), this.my + (y * BLOCK_H));
            }
        }
    }
}