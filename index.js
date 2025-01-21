const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const cellSize = 20;
let gameInterval = null;
let direction = 3; // Initial direction (RIGHT)

// Initialize WebAssembly module
Module.onRuntimeInitialized = () => {
    initializeGame();
    document.getElementById('startButton').addEventListener('click', startGame);
};

function startGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    console.log('Game started, initializing...');
    initializeGame();

    gameInterval = setInterval(() => {
        console.log('Game loop running...');
        gameLoop();
    }, 100); // Game loop every 100ms
}

function initializeGame() {
    console.log('Initializing game...');
    Module.ccall('resetGame', null, [], []);
    updateScore(0); // Reset score display
    render(); // Render initial game state
}

function gameLoop() {
    Module.ccall('move', null, [], []);
    render();
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw apple
    const appleX = Module.ccall('getAppleX', 'number', [], []);
    const appleY = Module.ccall('getAppleY', 'number', [], []);
    context.fillStyle = 'red';
    context.fillRect(appleX * cellSize, appleY * cellSize, cellSize, cellSize);

    // Draw snake
    const snakeLength = Module.ccall('getSnakeLength', 'number', [], []);
    const snakePtr = Module.ccall('getSnake', 'number', [], []);

    for (let i = 0; i < snakeLength; i++) {
        const x = Module.HEAP32[(snakePtr / 4) + i * 2];
        const y = Module.HEAP32[(snakePtr / 4) + i * 2 + 1];
        
        // Draw the snake body
        context.fillStyle = i === 0 ? 'darkgreen' : 'green'; // Head is darker
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // Add eyes to the snake's head
        if (i === 0) {
            drawEyes(x, y);
        }
    }

    // Update the score
    const score = Module.ccall('getScore', 'number', [], []);
    updateScore(score);

    // Check for game over
    if (Module.ccall('getGameOver', 'boolean', [], [])) {
        alert('Game Over!');
        initializeGame();
    }
}

// Draw eyes for the snake's head
function drawEyes(x, y) {
    context.fillStyle = "white"; // Eye color
    const eyeSize = 4;

    // Default eye positions for right direction
    let eyeOffsetX1 = 14,
        eyeOffsetY1 = 5; // Top-right eye
    let eyeOffsetX2 = 14,
        eyeOffsetY2 = 11; // Bottom-right eye

    if (direction === 0) { // UP
        eyeOffsetX1 = 5;
        eyeOffsetY1 = 2; // Left eye
        eyeOffsetX2 = 11;
        eyeOffsetY2 = 2; // Right eye
    } else if (direction === 1) { // DOWN
        eyeOffsetX1 = 5;
        eyeOffsetY1 = 14; // Left eye
        eyeOffsetX2 = 11;
        eyeOffsetY2 = 14; // Right eye
    } else if (direction === 2) { // LEFT
        eyeOffsetX1 = 2;
        eyeOffsetY1 = 5; // Top-left eye
        eyeOffsetX2 = 2;
        eyeOffsetY2 = 11; // Bottom-left eye
    }

    // Draw both eyes
    context.fillRect(x * cellSize + eyeOffsetX1, y * cellSize + eyeOffsetY1, eyeSize, eyeSize);
    context.fillRect(x * cellSize + eyeOffsetX2, y * cellSize + eyeOffsetY2, eyeSize, eyeSize);
}

function updateScore(score) {
    document.getElementById('score').innerText = `Score: ${score}`;
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    const keyMap = {
        w: 0, // UP
        s: 1, // DOWN
        a: 2, // LEFT
        d: 3, // RIGHT
    };
    if (keyMap[event.key] !== undefined) {
        const newDirection = keyMap[event.key];
        
        // Prevent the snake from reversing direction
        if (!((direction === 0 && newDirection === 1) || // UP -> DOWN
              (direction === 1 && newDirection === 0) || // DOWN -> UP
              (direction === 2 && newDirection === 3) || // LEFT -> RIGHT
              (direction === 3 && newDirection === 2))) { // RIGHT -> LEFT
            direction = newDirection;
            Module.ccall("changeDirection", null, ["number"], [newDirection]);
        }
    }
});
