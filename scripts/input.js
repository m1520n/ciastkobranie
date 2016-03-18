cookies.input = (function() {

    function onpress(e) {
        if (event == "mousedown") {
            mx = e.clientX - canvas.offsetLeft;
            my = e.clientY - canvas.offsetTop;
        } else {
            mx = e.targetTouches[0].pageX - canvas.offsetLeft;
            my = e.targetTouches[0].pageY - canvas.offsetTop;               
        }
        
        switch (currentGameState) {
            case gameStates.Splash:
                currentGameState = gameStates.Game;
                ball.respawn();
                cookie.respawn();
                bird.respawn();
                bird.flypUp();
                break;
                
            case gameStates.Game:
                bird.flypUp();
                break;
                
            case gameStates.Score:
                // check if within
                if (scoreboard.x < mx &&
                    scoreboard.y < my &&
                    mx < (scoreboard.x + spriteRestart.width) &&
                    my < (scoreboard.y + spriteRestart.height)) {
                    currentGameState = gameStates.Splash;
                    bird.respawn();
                    score = 0;
                }
                break;
        }
    }
    
})();