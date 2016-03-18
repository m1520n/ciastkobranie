cookies.actors["bird"] = (function() {
    var x = 0,               // bird x position
        y = 0,              // bird y position
        frame = 0,           // initial frame count
        g = 0.6,             // gravity
        vx = 6,              // initial x velocity
        vy = -8,             // initial y velocity
        mass = 0.5,
        
        bounceFactor = 0.8,  // used for bouncing after death
        rotation = 0,        // rotation for rotate function
        radius = 0,
        xCenter = 0,
        yCenter = 0,

        dead = false,        //dead state
        invincible = false,

        draw = function(ctx) {
            if(!this.dead) {
                ctx.save();
                spriteBird[this.frame].draw(ctx, this.x, this.y);
                ctx.restore();
            
                if (currentGameState === gameStates.Splash) {
                    this.wobble();
                }
            } else {
                ctx.save();
                ctx.translate(this.x+spriteBird[this.frame].width/2, this.y+spriteBird[this.frame].height/2);
                ctx.rotate(this.rotation);
                ctx.translate(-(this.x+spriteBird[this.frame].width/2), -(this.y+spriteBird[this.frame].height/2));
                spriteBird[this.frame].draw(ctx, this.x, this.y);
                ctx.restore();
                this.rotation += 0.2;
            }
        },

        flypUp = function(ctx) {
            if (this.vy > -7) this.vy = -7;       // make sure the jump is always in upward direction
            if (this.vy < -7) this.vy = -7;       // make sure the jumping is linear
            
            popSound.currentTime = 0;
            popSound.play();
        },

        eat = function() {
            if (this.x <= cookie.x + spriteCookie[0].width &&
                cookie.x + spriteCookie[0].width <= this.x + spriteBird[this.frame].width &&
                this.y <= cookie.y + spriteCookie[0].height &&
                cookie.y <= this.y + spriteBird[this.frame].height
                ) {               
                    if (cookie.cookieType == cookieTypes.invincible) {
                        this.invincible = true; 
                        this.vx = 12 * (this.vx && this.vx / Math.abs(this.vx));
                        
                        boostSound.currentTime = 0;
                        boostSound.play();
                        
                        setTimeout(function() {
                            bird.invincible = false;
                            bird.vx = 6 * (bird.vx && bird.vx / Math.abs(bird.vx));
                        }, 5000);
                    }
                    
                    if (cookie.cookieType == cookieTypes.gravity) {
                        this.g = 0.75;
                        
                        gravitySound.currentTime = 0;
                        gravitySound.play();
                        
                        setTimeout(function() {
                            bird.g = 0.5;
                        }, 5000);
                    }
                    
                    if (!this.dead) score++;    //increase points only when alive
                    
                    eatSound.currentTime = 0;
                    eatSound.play();
                    
                    cookie.eaten = 1;           //cookie state  
                    cookie.respawn();           //cookie respawn
                }
        },

        respawn = function() {
            score = 0;          // reset score
            this.dead = 0;      // reset dead state
            this.invincible = 0 // reset invincible state
            this.frame = 0;     // reset frame count
        
            this.g = 0.4;       // reset the gravity
            this.vx = 6;        // reset x velocity
            this.vy = -7;       // reset y velocity
                
            this.x = (width / 2) - (spriteBird[this.frame].width / 2);
            this.y = (height / 2) - (spriteBird[this.frame].height / 2);             
        },

        hitBall = function() {
            this.xCenter = this.x + this.radius;
            this.yCenter = this.y + this.radius;
            if (this.xCenter + this.radius + ball.radius > ball.xCenter
                && this.xCenter < ball.xCenter + this.radius + ball.radius
                && this.yCenter + this.radius + ball.radius > ball.yCenter
                && this.yCenter < ball.yCenter + this.radius + ball.radius) {
                    
                    var distance = Math.sqrt(
                                    ((this.xCenter - ball.xCenter) * (this.xCenter - ball.xCenter))
                                  + ((this.yCenter - ball.yCenter) * (this.yCenter - ball.yCenter))
                                  );
                    if (distance < this.radius + ball.radius)
                    {
                        var collisionPointX = ((bird.x * ball.radius) + (ball.x * bird.radius))
                                         / (bird.radius + ball.radius);   
                        var collisionPointX = ((bird.y * ball.radius) + (ball.y * bird.radius))
                                         / (bird.radius + ball.radius);
                        
                        ball.vx = (ball.vx * (ball.mass - this.mass)) + (2 * this.mass * this.vx)
                                / (this.mass + ball.mass);
                        ball.vy = (ball.vy * (ball.mass - this.mass)) + (2 * this.mass * this.vy)
                                / (this.mass + ball.mass);
                        
                        if (!this.dead && !this.invincible) {
                            this.vx = (this.vx * (this.mass - ball.mass)) + (2 * ball.mass * ball.vx)
                                    / (this.mass + ball.mass);
                            this.vy = (this.vy * (this.mass - ball.mass)) + (2 * ball.mass * ball.vy)
                                    / (this.mass + ball.mass);
                                this.die();
                        }
                    }
                }
            },

            die = function() {
                deadSound.play();                       // play dead sound
                this.dead = true;                       // change dead state to true
                currentGameState = gameStates.Score;    // change game state to Score
            },


            update = function() {
                this.x += this.vx;          // update bird x position by x velocity
                this.y += this.vy;          // update bird y position by y velocity
                this.vy += this.g;          // update velocity by gravity value

                // Change animation frame depending on vertical velocity
                if (this.vx < 0) {
                    if (this.vy < 0) {
                        this.frame = 1;
                    } else {
                        this.frame = 3;
                    }
                } else {
                    if (this.vy > 0) {
                        this.frame = 0;
                    } else {
                        this.frame = 2;
                    }
                }

                // bounce from the floor
                if (this.y + 75 > height) {
                    this.y = height - 75;                               // reposition the bird if it goes outside the boundries
                    this.vy = -this.vy * this.bounceFactor;             // reverse the direction
                    if (!this.dead) this.die();                         // change dead state to true
                }

               // bounce from the ceiling
               if (this.y < 25) {
                   this.y = 25;                                         // reposition the bird if it goes outside the boundries
                   this.vy = -this.vy;                                  // reverse the direction
                   if (!this.dead) this.die();                          // change dead state to true
               }

               // bounce form left wall
               if (this.x < 0) {
                   this.x = 0;
                   this.vx = -this.vx;                                  // reverse the direction
                   birdSound.currentTime = 0;
                   birdSound.play();
               }

               // bounce from right wall
               if (this.x + spriteBird[this.frame].width > width) {
                   this.x = width - spriteBird[this.frame].width;
                   this.vx = -this.vx;                                  // reverse the direction
                   birdSound.currentTime = 0;
                   birdSound.play();
               }
            },

            wobble = function() {
                this.y += Math.cos(frames/15);
            }
        }
                          })