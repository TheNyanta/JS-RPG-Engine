function startGame() {    
    InitalizeAnimationCounters();
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        //this.canvas = document.getElementById("game"); // if canvas is in the html file
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.canvas.id = "game";
        
        //this.canvas.style.cursor = "none"; //hide the original cursor
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(function() {
            ResetAnimationCounter();
            updateGameArea();
        }, 20);
        this.frameNo = 0;
        
        // Add Listeners for user inputs       
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
        window.addEventListener('mousedown', function (e) {
            myGameArea.mousedown = true;
            myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.mousedown = false;
            myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('mousemove', function (e) {
            myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
            document.getElementById("text1").innerHTML = "pageX: "+e.pageX + ", pageY: " +e.pageY +", clientX: " + e.clientX +", clientY: " +e.clientY;
            document.getElementById("text3").innerHTML = "Canvas Bounding Rect: Left= "+myGameArea.canvas.getBoundingClientRect().left+", Top=" +myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchstart', function (e) {
            myGameArea.touchdown = true;
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
            // Correct for fullscreen on tablet
            myGameArea.x2 = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y2 = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchend', function (e) {
            myGameArea.touchdown = false;
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
            myGameArea.x2 = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y2 = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchmove', function (e) {
            myGameArea.x = e.touches[0].screenX;
            myGameArea.y = e.touches[0].screenY;
            myGameArea.x2 = e.touches[0].screenX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y2 = e.touches[0].screenY - myGameArea.canvas.getBoundingClientRect().top;
            document.getElementById("text2").innerHTML = "touches: screenX: "+e.touches[0].screenX + ", screenY: " +e.touches[0].screenY;
            document.getElementById("text3").innerHTML = "Canvas Bounding Rect: Left= "+myGameArea.canvas.getBoundingClientRect().left+", Top=" +myGameArea.canvas.getBoundingClientRect().top;
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

var turn = 1;
// Update Canvas
function updateGameArea() {
    //myGameArea.clear();
    myGameArea.frameNo += 1;
    
    char_control.update();
    cat_control.update();
    
    // Moving cat left and right
    //cat.speedX = cat.speed * turn;
    if (myGameArea.frameNo == 1 || everyinterval(25))
        turn *= (-1);
    
    if (myGameArea.x && myGameArea.y) {        
        if (myUpBtn.clicked()) character.speedY = -character.speed;
        else if (myDownBtn.clicked()) character.speedY = character.speed;
        else if (myLeftBtn.clicked()) character.speedX = -character.speed;
        else if (myRightBtn.clicked()) character.speedX = character.speed;
    }
    
    // Object Object Collison
    if (character.crashWith(cat, character.speedX, character.speedY)) {
        character.speedX = 0;
        character.speedY = 0;
        
    }
    if (cat.crashWith(character, cat.speedX, cat.speedY)) {
        cat.speedX = 0;
        cat.speedY = 0;
        
    }
    //if (myGameArea.frameNo == 1 || everyinterval(2))   
    
    panorama.update();
    
    maps[mapID].updateBackground();
    
    // Objects incl. character: TODO: Automatic Order update() after Y-coordinate - smaller y first
    if (character.y > cat.y) {
        cat.update(); 
        character.update();
    }
    else {
        character.update(); 
        cat.update(); 
    }    
    
    maps[mapID].updateForeground();
    
    gameCamera.update();
    
    
    // Control Buttons
    myUpBtn.update();        
    myDownBtn.update();        
    myLeftBtn.update();        
    myRightBtn.update();
    
    
    // Cursor
    if(myGameArea.x && myGameArea.y) {        
        cursor.x = myGameArea.x;
        cursor.y = myGameArea.y;
        cursor.update();
    }
    // Cursor2
    if(myGameArea.x2 && myGameArea.y2) {        
        cursor2.x = myGameArea.x2;
        cursor2.y = myGameArea.y2;
        cursor2.update();
    }

}