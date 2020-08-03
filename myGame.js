//---------------//
// VARIABLES //
//---------------//
var canvas = document.getElementById("myCanvas"); // creates a variable to interact with the canvas
var ctx = canvas.getContext('2d'); // gets the canvas context
let screenWidth = canvas.width; // gets the screen width
let screenHeight = canvas.height; // gets the screen height
let isGameWon = false;
let isGameOver = false;
var lineX = screenWidth - 50; // Position of the end line


//----------------------//
// CHARACTER CLASS //
//----------------------//
class Rectangle {
    constructor(x, y, width, height, color, maxSpeed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 0;
        this.minSpeed = 2;
        this.maxSpeed = maxSpeed;
    }

    moveY() {
        if (this.y >= screenHeight - rectangles[0].height || this.y <= 0) {
            this.speed = -this.speed;
        }   
        this.y += this.speed;
    }

    moveX() {
        this.x += this.speed;
    }

    // Randomize speed
    changeSpeed() {
        if (this.y <= (screenHeight / 2) - this.height) {
            this.speed = Math.floor(Math.random() * (this.maxSpeed - this.minSpeed)) + this.minSpeed;
         } else {
             this.speed = -(Math.floor(Math.random() * ((this.maxSpeed - this.minSpeed)) + this.minSpeed));
         }
    }
}

//------------------------------//
// Create Enemy Instances Function //
//------------------------------//
var createEnemies = function() {
    var rect1 = new Rectangle(
        ((screenWidth / 6) - (100 / 2)), // to adjust the square to the center of a third of the screen (100 = rectWidth)
        (Math.round(Math.random() * (screenHeight - 100))), // Randomize initial y position
        100,
        100,
        "rgb(135, 131, 209)",
        6);

    var rect2 = new Rectangle(
        ((screenWidth / 2) - (100 / 2)), // to adjust the square to the center of the screen (100 = rectWidth)
        (Math.round(Math.random() * (screenHeight - 100))), // Randomize initial y position
        100, 
        100, 
        "rgb(135, 131, 209)",
        6);

    var rect3 = new Rectangle(
        (screenWidth - (screenWidth / 6) - (100 / 2)), // to adjust the square to the center of the last third of the screen (100 = rectWidth)
        (Math.round(Math.random() * (screenHeight - 100))), // Randomize initial y position
        100, 
        100, 
        "rgb(135, 131, 209)",
        6);

    var rectangles = [rect1, rect2, rect3];

    // Randomize initial speed of Enemies
    rectangles.forEach(rect => {
        rect.changeSpeed();
    });

    return rectangles;
}

var rectangles = createEnemies(); // create enemies the 1st time


//---------------------//
// Create Player Function //
//---------------------//
var createPlayer = function () {
    var playerRect = new Rectangle(
        10,
        ((screenHeight/2) - Math.round(25 / 2)), // To adjust the start position in the middle of the screen (25 = rectHeight)
        25,
        25,
        "rgb(118, 66, 72)",
        4
    );

    return playerRect
}

var playerRect = createPlayer(); // Create player the 1st time


//-------------//
// Event Listner //
//-------------//

// Key Down
document.onkeydown = function(event) {
    let keyPressed = event.keyCode
    if (keyPressed == 39) { // move right
        playerRect.speed = playerRect.maxSpeed;
    } else if (keyPressed == 37) { // move left
        playerRect.speed = -(playerRect.maxSpeed);
    } else if (keyPressed == 82 && isGameOver) { // restart game
        rectangles = createEnemies();
        playerRect = createPlayer();
        isGameOver = false;
    } else if (keyPressed == 78 && isGameWon) { // next level, increase velocities
        rectangles.forEach(rect => {
            rect.maxSpeed += 2;
            rect.minSpeed += 2;
            rect.changeSpeed();
        })
        playerRect.x = 10; // reposition player icon
        playerRect.maxSpeed += 2; // increase player speed
        isGameWon = false;
    } else {
        playerRect.speed = 0;
    }
}

// Key up
document.onkeyup = function(event) {
    let keyUpped = event.keyCode
    if (keyUpped == 39 || keyUpped == 37) { // Stop the player when key is no longer being pressed
        playerRect.speed = 0;
    }
}


//----------------------//
// Check Colisions Function //
//---------------------//
var checkColisions = function(obj1, obj2) {
    /*
    Calculates the position of the ends of each object
    and sees if they are overlapping (if one of the edges
    is contained inside the other object)
    */
    let obj1x2 = obj1.x + obj1.width; 
    let obj1y2 = obj1.y + obj1.height;
    let obj2x2 = obj2.x + obj2.width;
    let obj2y2 = obj2.y + obj2.height;

    return obj1.x < obj2x2 && obj1x2 > obj2.x && obj1.y < obj2y2 && obj1y2 > obj2.y;

}


//--------------//
// Draw Function //
//--------------//
var draw = function() {
    // Clear the canvas
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    
    // Draw the end line
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(92, 92, 92)';
    ctx.setLineDash([20, 10]);
    ctx.lineWidth = 3;
    ctx.moveTo(lineX, 0);
    ctx.lineTo(lineX, screenHeight);
    ctx.stroke();

    // Draw Text at the end position
    endTxt = 'END';
    var txtX = screenWidth - 35;
    var txtY = (screenHeight / 2 - 25);
    ctx.fillStyle = 'rgb(92, 92, 92)';
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${playerRect.height}px monospace`;

    for (i = 0; i < 3; i++) { // to draw each letter separately
        ctx.fillText(endTxt[i], txtX, txtY);
        txtY += 25;
    }

    // Draw each of the enemy rectangles
    rectangles.forEach(rect => {
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    });

    // Draw the player icon
    ctx.fillStyle = playerRect.color;
    ctx.fillRect(playerRect.x, playerRect.y, playerRect.width, playerRect.height);
    ctx.fillStyle = "rgb(240, 255, 240)";
    ctx.font = `${playerRect.height}px monospace`;
    ctx.fillText('P', playerRect.x + 5, playerRect.y + 15);

    // Draw You Win!
    if (isGameWon) {
        ctx.fillStyle = "rgb(81, 247, 164)";
        ctx.font = `bold 100px monospace`;
        txtSize = ctx.measureText('YOU WIN!');
        ctx.fillText('YOU WIN!', screenWidth / 2 - txtSize.width / 2, screenHeight / 2);
        ctx.font = `50px monospace`;
        txtSize = ctx.measureText('Press N for next level');
        ctx.fillText('Press N for next level', screenWidth / 2 - txtSize.width / 2, screenHeight / 2 + 60)
    }

    // Draw GameOver
    if (isGameOver) {
        ctx.fillStyle = "rgb(255, 156, 117)";
        ctx.font = `bold 100px monospace`;
        txtSize = ctx.measureText('GAME OVER');
        ctx.fillText('GAME OVER', ((screenWidth / 2) - (txtSize.width / 2)), screenHeight / 2);
        ctx.font = `50px monospace`;
        txtSize = ctx.measureText('Press R to restart');
        ctx.fillText('Press R to restart', ((screenWidth / 2) - (txtSize.width / 2)), (screenHeight / 2 + 60));
    }
}


//---------------//
// Update Function //
//---------------//
var update = function () {

    // move the enemies 
    rectangles.forEach(rect => {
        // Check for colisions, if none is found, move the rectangle
        if (checkColisions(playerRect, rect)) {
            isGameOver = true;
        }
        if (!isGameOver && !isGameWon) {
            rect.moveY();
        }
    });

    // check if player reached the end line
    if (playerRect.x >= lineX) {
        isGameWon = true;
    }

    // move the player
    if (!isGameOver && !isGameWon) {
        if (playerRect.x <= (screenWidth - playerRect.width) && playerRect.x >= 0) {
            playerRect.moveX();
        }
    }

    // Stop the player from leaving the canvas
    if (playerRect.x < 0) {
        playerRect.x = 0;
    } else if (playerRect.x > (screenWidth - playerRect.width)) {
        playerRect.x = screenWidth - playerRect.width;
    }
}


//--------------//
// Game Function //
//--------------//
var step = function() {
    update();
    draw();
    window.requestAnimationFrame(step);
}

step()


//-------------//
// OLD CODE //
//-------------//

/* // Draw random rectangles, in random places and with random colours (a little experiment)
var draw = function() {
    ctx.clearRect(0, 0, screenWidth, screenHeight); // Clears the screen to draw a new rectangle
    var x = Math.random() * screenWidth;
    var y = Math.random() * screenHeight;
    var width = Math.random() * screenWidth;
    var height = Math.random() * screenHeight;
    var color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    var rect1 = new Rectangle(x, y, width, height, color);
    ctx.fillStyle = rect1.color; // Selects the color to draw the rectangle in
    ctx.fillRect(rect1.x, rect1.y, rect1.width, rect1.height); // Draws a rectangle
}

var test = setInterval(draw, 1000); 
*/