cookies.actors.ball = (function () {
    "use strict";
	var x = 200, //change to middle of canvas
		y = -10,
		g = 0.05,
		vx = 0,
		vy = -7,
		rotation = 0,
		mass = 0.1,
		
		radius = spriteBall.width / 2,
		xCenter = 0,
		yCenter = 0,

		draw = function (ctx) {
		    ctx.save();
		    ctx.translate(this.x + spriteBall.width / 2, this.y + spriteBall.height / 2);
		    ctx.rotate(this.rotation);
		    ctx.translate(-(this.x + spriteBall.width / 2), -(this.y + spriteBall.height / 2));
		    this.rotation += 0.1;
		    spriteBall.draw(ctx, this.x, this.y);
		    ctx.restore();
		},
		
		update = function () {
		    this.x += this.vx;
		    this.y += this.vy;
		    this.vy += this.g;
		    this.xCenter = this.x + this.radius;
		    this.yCenter = this.y + this.radius;
		    
		    if (this.y > height && bird.dead === false) {
		        this.respawn();
		    }
		    if (this.y < 0 && bird.dead === false) {
		        this.respawn();
		    }
		},

		rebound = function () {
		    this.vx += bird.vx;
		    this.vy += bird.vx;
		    bird.vx *= -1;
		    bird.vy *= -0.9;
		    birdSound.currentTime = 0;
		    birdSound.play();
		},

		respawn = function () {
		    this.vx = 0;
		    this.vy = 5;
		    this.x = cookieXPos();
		    this.y = 0;
		};
}());