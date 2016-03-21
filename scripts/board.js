/* 
// This module is responsible for setting up the game board
*/

cookies.board = (function () {
    var dom = cookies.dom,
        $ = dom.$,
        canvas = document.createElement("canvas"),
        gameScreen = $("#play.screen")[0],
        width = window.innerWidth,
        height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;

    if (!(!!canvas.getContext && canvas.getContext("2d"))) {
        alert("Twoja przeglądarka nie wspiera HTML5, prosimy zaktualizuj ją do nowszej wersji, jeżeli chcesz zagrać w nasza grę.");
    }
    
    function createGameScreen() {
        gameScreen.appendChild(canvas);
    }
    
    var ctx = canvas.getContext("2d");
    
    
    
    function drawSpikes() {
        var numberOfSpikes= Math.ceil(canvas.width/50),
            x = 0;
        
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
    
    
    
    return {
        createGameScreen : createGameScreen,
        drawSpikes : drawSpikes
    }

}());