
var currentX = 0;
var currentY = 0;
var prevX = 0;
var prevY = 0;
var canvas;
var context;

function prepareCanvas() {
    // console.log("hello");
    canvas = document.getElementById("can");
    context = canvas.getContext('2d');

    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.strokeStyle = '#FFFFFF';
    context.lineWidth = 12;
    context.lineJoin = 'round';

    var isDraw = false;

    document.addEventListener('mousedown', function (event) {
        // console.log('Mouse press');
        isDraw = true;
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
    });

    document.addEventListener('mousemove', function(event) {

        if(isDraw)
        {
            prevX = currentX;
            currentX = event.clientX - canvas.offsetLeft;
            prevY = currentY;
            currentY = event.clientY - canvas.offsetTop;
            // steps => begin , set starting pt, move, end, finish 
            drawing();
        } 
    });

    document.addEventListener('mouseup', function (event) {
        // console.log('clicked');
        // console.log('Mouse released');
        isDraw = false;
    });

    canvas.addEventListener('mouseleave', function (event) {
        isDraw = false;
    });

    // for touch events
    canvas.addEventListener('touchstart', function (event) {
        // console.log('Touch event');
        isDraw = true;
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;
    });

    canvas.addEventListener('touchend', function (event) {
        isDraw = false;
    });

    canvas.addEventListener('touchcancel', function (event) {
        isDraw = false;
    });

    canvas.addEventListener('touchmove', function(event) {

        if(isDraw)
        {
            prevX = currentX;
            currentX = event.touches[0].clientX - canvas.offsetLeft;
            prevY = currentY;
            currentY = event.touches[0].clientY - canvas.offsetTop;
            drawing();
        } 
    });
}


function drawing() {
    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(currentX, currentY);
    context.closePath();
    context.stroke();
}

function clear()
{
 currentX = 0;
 currentY = 0;
  prevX = 0;
 prevY = 0; 
//  console.log('cleared');
 context.fillRect(0,0, canvas.clientWidth, canvas.clientHeight)
}