cookies.board = (function () {
    var canvas = document.createElement("canvas"),
    width = window.innerWidth,
    height = window.innerHeight,
    
	isTouchSupported = 'ontouchstart' in window,
    event = isTouchSupported ? 'touchstart' : 'mousedown',
	
	currentGameState,
    gameStates = {
        Splash: 0,
        Game: 1,
        Score: 2
    };

	if (width >= 400) {
    	width = 400;
    	height = 640;
    	canvas.style.border = "1px solid #000";
    }
    
	document.addEventListener(event, onpress);

    canvas.width = width;
    canvas.height = height;

    if (!(!!canvas.getContext && canvas.getContext("2d"))) {
        alert("Twoja przeglądarka nie wspiera HTML5, prosimy zaktualizuj ją do nowszej wersji, jeżeli chcesz zagrać w nasza grę.");
    }

    ctx = canvas.getContext("2d");
    
    currentGameState = 0;

    document.body.appendChild(canvas);
                
    var img = new Image();
    img.onload = function() {
        initSprites(this);
        
        ctx.fillStyle = spriteBackground.color;
        
        //prepareCookiePos();
        //bird.radius = spriteBird[0].width / 2;               
        //bird.x = width * 0.5 - spriteBird[0].width * 0.5;
        //bird.y = height * 0.5 - spriteBird[0].height * 0.5;
        //ball.radius = spriteBall.width / 2;
        //splashScreen.x = width / 2;
        //splashScreen.y = height / 2;
        //scoreboard.x = width / 2 - spriteRestart.width / 2;
        //scoreboard.y = height / 2 - spriteRestart.height / 2;
        run();
    }
    
    birdSound = new Audio(sounds.bird); //initialize audio object
    popSound = new Audio(sounds.pop); //initialize audio object
    deadSound = new Audio(sounds.dead); //initialize audio object
    eatSound = new Audio(sounds.eatCookie); //initialize audio object
    boostSound = new Audio(sounds.boost); //initialize audio object
    gravitySound = new Audio(sounds.gravity); //initialize audio object

    img.src = "resources/sprites_sm.png";
    //add mute button later
    // birdSound.muted = true;
    // popSound.muted = true;
    // deadSound.muted = true;
    // eatSound.muted = true;
        }
	
	
   

    frames = 0,         //used for transitions

    score = 0,
    bestScore = localStorage.getItem("bestScore") || 0,

    pi = Math.PI,       //PI var for conveniencesettings,

    
    // Spikes on the floor and ceiling
    spike = {
        draw: function(ctx) {
            var numberOfSpikes= Math.ceil(canvas.width/50)
            var x = 0;
            for (var i=1; i <= numberOfSpikes; i++) {

                ctx.save();

                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(25 + x, 30);
                ctx.lineTo(50 + x, 0);
                ctx.fill();

                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.moveTo(x, height);
                ctx.lineTo(25 + x, height - 30);
                ctx.lineTo(50 + x, height);
                ctx.fill();

                ctx.restore();

                x += 50;
            }
        }
    },

    
    points = {
        draw: function(ctx) {
            ctx.save();
            ctx.font = "bold 200px calibri";
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(score, width/2, height/2);
            ctx.restore();
        }
    },

    splashScreen = {
        x: 0,
        y: 0,

        draw: function(ctx){
            ctx.save();
            ctx.font = "28px Calibri";
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Naciskaj, aby skakać!", width / 2, height * 0.6 );
            ctx.restore();
            spriteLogo.draw(ctx, spriteLogo.width / 5, spriteLogo.height);
            spriteFinger.draw(ctx, this.x - spriteFinger.width * 0.5, this.y + spriteFinger.height);
            this.wobble();
        },
        wobble: function() {
            this.y += Math.cos(frames/5);
        }
    },

    scoreboard = {
        rotation: 1,
        x: 0,
        y: 0,

        lex: function() {
            if (score > 1 && score < 5) {
                return " ciastka ";
            } else if (score == 1) {
                return " ciastko ";
            } else {
                return " ciastek "
            }
        },

        draw: function(ctx){

            ctx.save();

            ctx.translate(this.x + spriteRestart.width / 2, this.y + spriteRestart.height / 2);
            ctx.rotate(this.rotation);
            ctx.translate(-(this.x + spriteRestart.width / 2), -(this.y + spriteRestart.height / 2));

            this.rotation = Math.cos(frames/15);

            spriteRestart.draw(ctx, this.x, this.y);

            ctx.restore();

            ctx.save();

            ctx.font = "26px Calibri";
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Zjadłeś " + score + this.lex(), width / 2, height * 0.25);
            ctx.fillText("Rekord to " + bestScore + " ciastek", width / 2, height * 0.75);

                ctx.restore();
            }
        };
        
            

        function render() {
            ctx.fillRect(0, 0, width, height);
            if (currentGameState === gameStates.Game) {
                points.draw(ctx);
                cookie.draw(ctx);
            }
            
            bird.draw(ctx);

            if (currentGameState !== gameStates.Splash) {
                ball.draw(ctx);
            }

            spike.draw(ctx);

            if (currentGameState === gameStates.Splash) {
                ctx.fillStyle = "#27ae60";
                splashScreen.draw(ctx);
            }

            if (currentGameState === gameStates.Score) {
                ctx.fillStyle = "#27ae60";
                scoreboard.draw(ctx);
            }
        }

        //update game actor positions
        function update() {
            frames++;

            if (currentGameState === gameStates.Splash) splashScreen.wobble();
            if (currentGameState !== gameStates.Splash) {
                ball.update();
                bird.update();
                bird.hitBall();
            }
            
            if (currentGameState === gameStates.Score) {
                bestScore = Math.max(bestScore, score);
                localStorage.setItem("best", bestScore);
            }

            cookie.wobble();
            
            if (!bird.dead) bird.eat();

            //background colors for scores
            if (score >9 && score < 20) {
                ctx.fillStyle = "#4183D7";
            } else if (score > 19 && score < 30) {
                ctx.fillStyle = "#81CFE0";
            } else if (score > 29 && score < 40) {
                ctx.fillStyle = "#6C7A89";
            } else if (score > 39 && score < 50) {
                    ctx.fillStyle = "#F9BF3B";
            } else if (score > 49 && score < 60) {
                    ctx.fillStyle = "#3498DB";
            } else if (score > 59 && score < 70) {
                    ctx.fillStyle = "#ABB7B7";
            } else if (score > 69 && score < 80) {
                    ctx.fillStyle = "#2574A9";
            } else if (score > 79 && score < 90) {
                    ctx.fillStyle = "#03C9A9";
            } else if (score > 89 && score < 100) {
                    ctx.fillStyle = "#F4D03F";
            }
        }
        
        //run loop
        function run() {
            var loop = function() {
                render();
                update();
                window.requestAnimationFrame(loop, canvas);
            }
            window.requestAnimationFrame(loop, canvas);
        }

        //start the game
        document.ondomcontentready = main();
        
    })();
}());