// Display setting
let board;
let boardWidth = 800;
let boardHeight = 300;
let context;

// Player setting
let playerWidth = 64;
let playerHeight = 64;
let playerX = 50;
let playerY = boardHeight - playerHeight;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight 
};

// Physics
let velocityY = 0;
let gravity = 0.25; 

// Tree Setting
let treeImg;
let treeWidth = 70;
let treeHeight = 105;
let treeX = 700;
let treeY = boardHeight - treeHeight;
let treeArray = [];
let treeSpeed = -4;

// Game State
let gameover = false;
let score = 0;
let frameCount = 0;

window.onload = function() {
    // Display setup
    board = document.getElementById("board"); 
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    
    // Load player image
    playerImg = new Image();
    playerImg.src = "./image/lita.png"; 

    // Load tree image
    treeImg = new Image();
    treeImg.src = "./image/yoha.jpg";

    // Start loop and spawners
    requestAnimationFrame(update);
    setInterval(createTree, 1500); 

    // Event Listeners for Space, Clicks, and Mobile Touch
    document.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
            e.preventDefault();
            handleInput();
        }
    });

    board.addEventListener("click", function() {
        handleInput();
    });

    board.addEventListener("touchstart", function(e) {
        e.preventDefault();
        handleInput();
    }, { passive: false });
}

// Unified input handler for jumping and restarting
function handleInput() {
    if (gameover) {
        restartGame();
        return;
    }
    
    // Jump only if the player is on the ground
    if (player.y >= playerY) {
        velocityY = -10;
    }
}

// Update Animation Frame Loop
function update() {
    requestAnimationFrame(update);
    
    if (gameover) {
        return;
    }
    
    context.clearRect(0, 0, board.width, board.height); 
    
    // Apply gravity and update player position
    velocityY += gravity; 
    player.y = Math.min(player.y + velocityY, playerY);  
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    
    // Update and draw trees
    for (let i = 0; i < treeArray.length; i++) {
        let tree = treeArray[i];
        tree.x += treeSpeed;
        context.drawImage(tree.img, tree.x, tree.y, tree.width, tree.height);
        
        // Check collision
        if (onCollision(player, tree)) {
            gameover = true;
            drawGameOverScreen();
        }
    }

    // Increment frame count and increase score smoothly
    frameCount++;
    if (frameCount % 10 === 0) { 
        score++;
    }

    // Display score 
    context.font = "bold 24px Arial";
    context.fillStyle = "black";
    context.textAlign = "right";
    context.fillText("Score: " + score, boardWidth - 40, 40);
}

function createTree() {
    if (gameover) {
        return;
    }
    let tree = {
        img: treeImg,
        x: treeX,
        y: treeY,
        width: treeWidth,
        height: treeHeight
    };
    treeArray.push(tree);
    if (treeArray.length > 5) {
        treeArray.shift();
    }
}

function onCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function drawGameOverScreen() {
    context.fillStyle = "rgba(0, 0, 0, 0.4)"; 
    context.fillRect(0, 0, boardWidth, boardHeight);

    context.font = "bold 40px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText("Game Over!", boardWidth / 2, boardHeight / 2 - 15);

    context.font = "20px Arial";
    context.fillText("Tap, Click, or Press Space to Restart", boardWidth / 2, boardHeight / 2 + 30);
}

function restartGame() {
    location.reload();
}