function startGame() {
    myGameArea.init();
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    defaultWidth : 560,
    defaultHeight : 350,
    init : function() {
        this.canvas.width = 560;
        this.canvas.height = 350;
        
        // Pause game if not selected
        document.active = true;
        $(window).focus(function() {document.active = true;});
        $(window).blur(function() {document.active = false;});
        
        //this.canvas.style.cursor = "none"; //hide the original cursor
        this.context = this.canvas.getContext("2d");
        
        // Add buttons
        var myGameButtons =
            '<br>' +
            '<button onclick="enterFullscreen()" unselectable="on">Fullscreen</button>' +
            '<button onclick="EnableScrollbar()" unselectable="on">Scrollbar On</button>' +
            '<button onclick="DisableScrollbar()" unselectable="on">Scrollbar Off</button>' +
            '<button onclick="audio1.play()">Play Music</button>' +
            '<button onclick="audio1.pause()">Pause Music</button>' +
            '<br>' +
            '<button onclick="gameCamera.target=character">Camera on Character</button>' +
            '<button onclick="gameCamera.target=cat">Camera on Cat</button>' +
            '<button onclick="control3.doFollow=true">Cat follow</button>' +
            '<button onclick="control3.doFollow=false">Cat stay</button>';
        document.getElementById("startGame").insertAdjacentHTML('afterend',myGameButtons);
        
        // Replace Start Button with Canvas
        document.getElementById("startGame").parentElement.replaceChild(this.canvas, document.getElementById("startGame"));
        
        this.frameNo = 0;
        
        // ANIMATIONCOUNTER
        InitalizeAnimationCounters();
        
        window.requestAnimationFrame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(f){return setTimeout(f, 1000/60)}; // simulate calling code 60 
 
        window.cancelAnimationFrame = window.cancelAnimationFrame
        || window.mozCancelAnimationFrame
        || function(requestID){clearTimeout(requestID)}; //fall back
        
        // INITIALIZE USER INPUT       
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
        window.addEventListener('mousedown', function (e) {
            myGameArea.mousedown = true;
            myGameArea.clickdownX = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.clickdownY = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
            
            if (myGameArea.clickdownX > 0 && 
                myGameArea.clickdownY > 0 &&
                myGameArea.clickdownX < myGameArea.canvas.width &&
                myGameArea.clickdownY < myGameArea.canvas.height)
                myGameArea.clicked = true;
        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.mousedown = false;
            myGameArea.clickupX = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.clickupY = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('mousemove', function (e) {
            myGameArea.x = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchstart', function (e) {
            myGameArea.touchdown = true;
            myGameArea.clickdownX = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.clickdownY = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchend', function (e) {
            myGameArea.touchdown = false;
            myGameArea.clickupX = e.pageX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.clickupY = e.pageY - myGameArea.canvas.getBoundingClientRect().top;
        })
        window.addEventListener('touchmove', function (e) {
            myGameArea.x = e.touches[0].clientX - myGameArea.canvas.getBoundingClientRect().left;
            myGameArea.y = e.touches[0].clientY - myGameArea.canvas.getBoundingClientRect().top;
        })
        
    },
    
    start : function() {
        
        // Old gameLoop
        //this.interval = setInterval(function() { ResetAnimationCounter(); updateGameArea();} , 16);

        // New gameLoop
        function gameLoop() {
            requestAnimationFrame(gameLoop);
            if (document.active) {
                ResetAnimationCounter();
                updateGameArea();
            }
        }
        
        gameLoop();      
    },
    
    stop : function() {
        
    },
        
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

var start,before,now,time,fps;
start=Date.now();
before=Date.now();
fps=0;

function showFPS() {
    ctx = myGameArea.context;
    ctx.font =  "bold 20px red";
    ctx.fillStyle = "black";
    ctx.fillText("FPS : " + fps, 470, 40);
}

function showPosition() {
    ctx = myGameArea.context;
    ctx.fillStyle = "black";
    ctx.fillText("x : " + (character.x + character.offset_x), 5, 20);
    ctx.fillText("y : " + (character.y + character.offset_y), 5, 40);
}

function showTime() {
    ctx = myGameArea.context;
    ctx.fillStyle = "black";
    ctx.fillText("Timer : " + Math.round(time/1000), 440, 20);
}

var enterPressed = false;

// Update Canvas
function updateGameArea() {
    myGameArea.frameNo += 1;
    
    maps[mapID].updateBackground();
    
    control1.update();
    control2.update();
    control3.update();
    
    /*
    // Object Object Collison TODO: generalize for all objects on the current map
    if (character.crashWith(cat, character.speedX, character.speedY)) {
        character.isFacing();
        character.speedX = 0;
        character.speedY = 0;
        
    }
    if (cat.crashWith(character, cat.speedX, cat.speedY)) {
        cat.isFacing();
        cat.speedX = 0;
        cat.speedY = 0;
        
    }
    */ 
    
    if (character.animation.direction == DIR_N) {
        char_front.x = Math.floor((character.x+ 4)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16-16)/16)*16 - gameCamera.y;
    }
    if (character.animation.direction == DIR_S) {
        char_front.x = Math.floor((character.x+ 4)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16+16)/16)*16 - gameCamera.y;
    }
    if (character.animation.direction == DIR_W) {
        char_front.x = Math.floor((character.x+ 4-16)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16)/16)*16 - gameCamera.y;
    }
    if (character.animation.direction == DIR_E) {
        char_front.x = Math.floor((character.x+ 4+15)/16)*16 - gameCamera.x;
        char_front.y = Math.floor((character.y+16)/16)*16 - gameCamera.y;
    }
    
    /*
    // Automatic Order update() after Y-coordinate - smaller y first
    maps_objects.sort(this.y);
    maps_objects.reverse(); // Shows both o.O
    for (var i = 0; i < maps_objects.length; i++)
        maps_objects[i].update();
    */
    
    character.showStandingOnTiles();
    cat.showStandingOnTiles();
    
    // Objects incl. character
    if (character.y > cat.y) {
        cat.update(); 
        character.update();
    }
    else {
        character.update(); 
        cat.update(); 
    }    
    
    maps[mapID].updateForeground();
    
    control3.drawSwip();
    
    gameCamera.update();
    
    // Enter KEY 
    if (myGameArea.keys)
        if (myGameArea.keys[KEY_ENTER]) {
            if (!enterPressed) {
                //console.log("Enter Pressed");
                testdialog.chatCounter++;
                chatSequence = true;
            }
            enterPressed = true;
        }
    else {
        if (enterPressed) {
            //console.log("Enter Released");
            enterPressed = false;
        }
    }
    
    if (chatSequence)
        testdialog.update();
    

    // FPS update
    now=Date.now();
    time=now-start;
    if (myGameArea.frameNo == 1 || everyinterval(30)) {fps=Math.round(1000/(now-before)); }
    before=now;
    showFPS();
    showTime();
    showPosition();

}