cookies.board = (function() {
    var currentGameState,
        
    test,

    gameStates = {
        Splash: 0,
        Game: 1,
        Score: 2
    },

    cookieTypes = {
        regular: 0,
        invincible: 1,
        gravity: 2
    },

    frames = 0,         //used for transitions

    score = 0,
    bestScore = localStorage.getItem("bestScore") || 0,

    pi = Math.PI,       //PI var for conveniencesettings,
    
    function initialize() {
        settings = cookies.settings;
        foodTypes = settings.foodTypes;
        cols = settings.cols;
        rows = settings.rows;
        baseScore = settings.baseScore;
        fillBoard();
    }
    
        //--------------------------------------------------------
        //    AUDIO ASSETS
        //--------------------------------------------------------
        
        birdSound,
        popSound,
        deadSound,
        eatSound,
        boostSound,
        gravitySound,
            
        sounds = {
            bird: "resources/ball.m4a",
            pop: "resources/pop.mp3",
            dead: "resources/bird.mp3",
            eatCookie: "resources/eat.mp3",
            boost: "resources/boost.mp3",
            gravity: "resources/gravity.mp3"
        },
        
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

        //--------------------------------------------------------
        //    HELPER FUNCTIONS
        //--------------------------------------------------------

        //returns random RGB color in hex
        function getRandomColor() {
            var letters = '0123456789ABCD'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        
        function prepareCookiePos() {
            var cookieDistance = height * 0.2;
            var cookiePos = 0;
            for (var i = 1; i <= 4; i++) {
                cookie.cookiePositions.push(cookiePos + cookieDistance);
                cookiePos += cookieDistance;
            }
        }
        function cookieXPos() {
             if (Math.random() > 0.5) {
                 cookie.currentCookieSide = 0;
                 return 50;
             } else {
                 cookie.currentCookieSide = 1;
                 return (width - 85);
             }
        }

         function cookieYPos() {
             var position = Math.floor((Math.random() * (cookie.cookiePositions.length))); // get random value between 0 and number of items in the array
             if(cookie.cookiePositions[position] == cookie.lastCookiePos && cookie.lastCookieSide == cookie.currentCookieSide) { 
                 return cookieYPos(); // make sure that the cookie doesn't spawn in the same place twice consequently
             } else {
                cookie.lastCookiePos = cookie.cookiePositions[position]; // get y position from array
                return cookie.cookiePositions[position];
             }
             
         }

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

        //--------------------------------------------------------
        //    Main function
        //--------------------------------------------------------

        function main() {
            canvas = document.createElement("canvas");

            width = window.innerWidth;
            height = window.innerHeight;

            var isTouchSupported = 'ontouchstart' in window;
            event = isTouchSupported ? 'touchstart' : 'mousedown';

            if (width >= 400) {
                width = 400;
                height = 640;
                canvas.style.border = "1px solid #000";
            }
            console.log(event);
            //listen for input
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
                
                prepareCookiePos();
                bird.radius = spriteBird[0].width / 2;               
                bird.x = width * 0.5 - spriteBird[0].width * 0.5;
                bird.y = height * 0.5 - spriteBird[0].height * 0.5;
                ball.radius = spriteBall.width / 2;
                splashScreen.x = width / 2;
                splashScreen.y = height / 2;
                scoreboard.x = width / 2 - spriteRestart.width / 2;
                scoreboard.y = height / 2 - spriteRestart.height / 2;
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
    
})();