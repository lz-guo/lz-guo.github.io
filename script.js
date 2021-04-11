var canvas = document.getElementById("gameArea");
var ctx = canvas.getContext("2d");

var scoreLabel = document.getElementById('scoreLabel');
var score = 0;
var life = 3;

var radius = 10;
var posX = canvas.width/2;
var posY = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddlePos = canvas.width/2;
var paddleWidth = 80;
var paddleHeight =  10;
var paddleMoveStep = 7;

var rightPressed = false;
var leftPressed = false;

var brickRow = 3;
var brickCol = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for (var r = 0; r <brickRow; r++){
    bricks[r]=[];
    for (var c = 0; c < brickCol; c++){
        bricks[r][c] = {x:0, y:0, status: 1}; //status 1: show brick, 0 : do not show brick;
    }
}

function drawBricks(){
    for (var r = 0; r <brickRow; r++){
        for (var c = 0; c < brickCol; c++){
                if (bricks[r][c].status == 1) {
                bricks[r][c].x = brickOffsetLeft + c*(brickWidth + brickPadding);
                bricks[r][c].y = brickOffsetTop + r*(brickHeight + brickPadding);
                ctx.beginPath();
                ctx.rect(bricks[r][c].x, bricks[r][c].y, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore (){
    ctx.font = "16px Arial";
    ctx.fillStyle = '#0095DD';
    ctx.fillText("Score: "+ score, 8,20);
}

function drawLife (){
    ctx.font = "16px Arial";
    ctx.fillStyle = '#0095DD';
    ctx.fillText("Life: "+ life, canvas.width - 65,20);
}

function collisionDetection (){
    for (var r = 0; r <brickRow; r++){
        for (var c = 0; c < brickCol; c++){
            if (bricks[r][c].status ==1){
                if (posX + radius > bricks[r][c].x && posX - radius < bricks[r][c].x + brickWidth && posY + radius> bricks[r][c].y && posY - radius < bricks[r][c].y + brickHeight ) {
                    dy = -dy;
                    bricks[r][c].status = 0;
                    score++;
                    scoreText = `Score: ${score}`;
                    scoreLabel.innerText = scoreText;
                    
                    if (score == brickCol*brickRow){
                        alert("You Win!!");
                        document.location.reload();
                        clearInterval(interval);
                    }

                }
            }
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler (e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddlePos = relativeX - paddleWidth/2;
    }
}

function keyDownHandler (e) {
    if (e.code == "Right" || e.code == "ArrowRight") {
        rightPressed = true;
    } else if (e.code == "Left" || e.code == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler (e) {
    if (e.code == "Right" || e.code == "ArrowRight") {
        rightPressed = false;
    } else if (e.code == "Left" || e.code == "ArrowLeft") {
        leftPressed = false;
    }
}


function drawPaddle() {
    
    if(rightPressed){
        if( paddlePos + paddleMoveStep + paddleWidth > canvas.width){
            paddlePos = canvas.width - paddleWidth;
        } else {
            paddlePos += paddleMoveStep;
        }
    }

    if(leftPressed){
        if (paddlePos - paddleMoveStep < 0) {
            paddlePos = 0;
        } else {
            paddlePos -= paddleMoveStep;
        } 
    }
    
    ctx.beginPath();
    ctx.rect(paddlePos, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

}

function drawBall(){
    ctx.beginPath();
    ctx.arc(posX,posY,radius,0,Math.PI*2,false);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}



function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawScore();
    drawBall();
    drawPaddle();
    drawBricks();
    drawLife();

    if (posX + dx + radius > canvas.width || posX - radius < 0){
        dx = - dx;
    }

    if (posY - radius < 0){
        dy = - dy;
    } else if (posY + radius + paddleHeight > canvas.height) {
        if (posX >= paddlePos && posX <= paddlePos + paddleWidth){
            dy = - dy;
        } else {

            life --;
            if(!life) {
                alert("Gave Over!!");
                document.location.reload();
                clearInterval(interval);
            } else {
                alert("Life reduced!")
                posX = canvas.width/2;
                posY = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddlePos = canvas.width/2;
                
            }

            }
    }


    posX += dx;
    posY += dy;

    collisionDetection();

};

var interval = setInterval(draw, 10);


