        function run() {
            var loop = function() {
                render();
                update();
                window.requestAnimationFrame(loop, canvas);
            }
            window.requestAnimationFrame(loop, canvas);
        }

  var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback, element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();