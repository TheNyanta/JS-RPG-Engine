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
        
        // Start the main loop.
        MainLoop.setUpdate(update).setDraw(draw).start();
        //.setDraw(draw).setEnd(end).start();

        /*
        var lastFrameTimeMs = 0;
        function mainLoop(timestamp) {
            // Throttle the frame rate.
            if (timestamp < lastFrameTimeMs + (1000 / 60)) {
                requestAnimationFrame(mainLoop);
                return;
            }
            delta = timestamp - lastFrameTimeMs;
            lastFrameTimeMs = timestamp;
            
            ResetAnimationCounter();
            updateGameArea(delta);
            //update(delta);
            //draw();
            requestAnimationFrame(mainLoop);
        }
        
        requestAnimationFrame(mainLoop);
        */
        
        /*
        // New gameLoop
        function gameLoop(timestamp) {
            requestAnimationFrame(gameLoop);
            if (document.active) {
                ResetAnimationCounter();
                updateGameArea();
            }
        }
        
        gameLoop();   
        */
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
    ctx.fillText("x : " + (character.x + character_collision.x), 5, 20);
    ctx.fillText("y : " + (character.y + character_collision.y), 5, 40);
}

function showTime() {
    ctx = myGameArea.context;
    ctx.fillStyle = "black";
    ctx.fillText("Timer : " + Math.round(time/1000), 440, 20);
}

// Update Canvas
function update(delta) {
    ResetAnimationCounter();
    myGameArea.frameNo += 1;
    
    control1.update(delta);
    control2.update(delta);
    control3.update(delta);
    
    character_collision.mapCollsion();
    cat_collision.mapCollsion();
    
    /*
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
    }*/
    
    
    
    character.update(delta);
    cat.update(delta);
    
    control3.drawSwip();
    
    gameCamera.update();
}

function draw() {
    maps[mapID].updateBackground();
    
    character_collision.draw();
    cat_collision.draw();
    
    /*
    maps_objects.sort(this.y);
    maps_objects.reverse(); // Shows both o.O
    for (var i = 0; i < maps_objects.length; i++)
        maps_objects[i].update();
        */
    
    
    // Objects incl. character: TODO: Automatic Order update() after Y-coordinate - smaller y first
    if (character.y > cat.y) {
        cat.draw(); 
        character.draw();
    }
    else {
        character.draw(); 
        cat.draw(); 
    }    
    
    maps[mapID].updateForeground();
    
    // FPS update
    now=Date.now();
    time=now-start;
    if (myGameArea.frameNo == 1 || everyinterval(30)) {fps=Math.round(1000/(now-before)); }
    before=now;
    showFPS();
    showTime();
    showPosition();
}