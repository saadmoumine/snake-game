# 🐍 Snake Game

The classic Snake Game, built using **WebAssembly**, **JavaScript** and **C++**.

### How to play:
1. Visit the game here: [Snake Game](https://saadmoumine.github.io/snake-game/).
2. Click "Start Game" to begin.
3. Use the keyboard keys to control the snake:
   - `W`: Move Up
   - `A`: Move Left
   - `S`: Move Down
   - `D`: Move Right
4. Collect apples 🟥 to grow your snake and increase your score!
5. Avoid crashing into the walls or your own tail.

6. ## 🛠️ Running locally:
### Requirements:
- Python installed on your system
- Emscripten SDK installed (if you want to recompile)

### Steps:
1. Clone this repository:
   ```bash
   git clone https://github.com/saadmoumine/snake-game.git
   cd snake-game
2. Start a local server:
   ```bash
   python -m http.server
Open your browser and navigate to: http://localhost:8000 and enjoy 😊

3. (Optional) If you make changes to main.cpp, recompile using Emscripten:
   ```bash
   emcc main.cpp -o output.js -s WASM=1 \
   -s EXPORTED_FUNCTIONS="['_resetGame', '_move', '_changeDirection', '_getSnakeLength', '_getSnake', '_getAppleX', '_getAppleY', '_getGameOver']" \
   -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']"

   
