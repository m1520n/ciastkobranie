cookies.actors["cookie"] = (function() {
    var x = 0,
    y = 0,
    
    eaten = 0,
    cookiePositions = [],
    lastCookiePos = null,
    currentCookieSide = null,
    lastCookieSide = null,
    
    cookieType = cookieTypes.regular,
    
    draw = function(ctx) {
        if (this.eaten == 0) spriteCookie[this.cookieType].draw(ctx, this.x, this.y);
        ctx.restore();
        if (cookie.y > canvas.height) cookie.respawn();
    },
    
    cookieDuration = function(duration) {
        test = setTimeout(function() {
                return cookie.respawn();
            }, duration);
    },

    respawn = function() {
        clearTimeout(test);
        this.cookieType = cookieTypes.regular;
        this.lastCookieSide = this.currentCookieSide;
        
        if (score > 0 && score % 3 == 0 && Math.random() > 0.7) {
            this.cookieType = cookieTypes.invincible;
            this.cookieDuration(3000);
            
        }
        if (score > 0 && score % 5 == 0 && Math.random() < 0.3) {
            this.cookieType = cookieTypes.gravity;
            this.cookieDuration(3000);
        }

        this.x = cookieXPos();
        this.y = cookieYPos();
        
        this.eaten = 0;
    },
    wobble = function() {
        this.y += 3*Math.cos(frames/10);
    },
        
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
})();