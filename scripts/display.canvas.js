cookies.display = (function () {
    var dom = cookies.dom,
        board = cookies.board,
        width = window.innerWidth,
        height = window.innerHeight;
    
    function createGameScreen() {
        if (!Modernizr.canvas) return;
        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            numberOfSpikes= Math.ceil(canvas.width/50);
        canvas.width = width;
        canvas.height = height; 
    }
    
}());