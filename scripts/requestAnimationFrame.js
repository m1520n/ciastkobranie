        function run() {
            var loop = function() {
                render();
                update();
                window.requestAnimationFrame(loop, canvas);
            }
            window.requestAnimationFrame(loop, canvas);
        }