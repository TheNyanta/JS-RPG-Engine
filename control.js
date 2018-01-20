function control(target, up, down, left, right) {
    this.target = target;
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    
    this.update = function() {
        if (this.target != undefined) {
            // Key Control: Else if for 4-direction movement
            if (myGameArea.keys) {
                if (myGameArea.keys[this.up])
                    target.speedY = -target.speed;
                else if (myGameArea.keys[this.down])
                    target.speedY = target.speed;
                else if (myGameArea.keys[this.left])
                    target.speedX = -target.speed;
                else if (myGameArea.keys[this.right])
                    target.speedX = target.speed;
            }
        }
    }
}