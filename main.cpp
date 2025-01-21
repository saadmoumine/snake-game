#include <vector>
#include <emscripten/emscripten.h>
#include <cstdlib>
#include <ctime>

const int GRID_WIDTH = 20;
const int GRID_HEIGHT = 20;

enum Direction
{
    UP,
    DOWN,
    LEFT,
    RIGHT
};

struct Segment
{
    int x, y;
};

class SnakeGame
{
private:
    std::vector<Segment> snake;
    Segment apple;
    Direction direction;
    bool isGameOver;
    int score;

public:
    SnakeGame()
    {
        resetGame();
    }

    void resetGame()
    {
        snake = {{GRID_WIDTH / 2, GRID_HEIGHT / 2}};
        direction = RIGHT;
        spawnApple();
        isGameOver = false;
        score = 0;
    }

    void spawnApple()
    {
        apple.x = rand() % GRID_WIDTH;
        apple.y = rand() % GRID_HEIGHT;
    }

    int getAppleX() const {
        return apple.x;
    }

    int getAppleY() const {
        return apple.y;
    }

    void move()
    {
        if (isGameOver)
            return;

        Segment newHead = snake.front();

        switch (direction)
        {
        case UP:
            newHead.y--;
            break;
        case DOWN:
            newHead.y++;
            break;
        case LEFT:
            newHead.x--;
            break;
        case RIGHT:
            newHead.x++;
            break;
        }

        if (newHead.x < 0 || newHead.x >= GRID_WIDTH || newHead.y < 0 || newHead.y >= GRID_HEIGHT)
        {
            isGameOver = true;
            return;
        }

        for (const auto &segment : snake)
        {
            if (segment.x == newHead.x && segment.y == newHead.y)
            {
                isGameOver = true;
                return;
            }
        }

        snake.insert(snake.begin(), newHead);

        if (newHead.x == apple.x && newHead.y == apple.y)
        {
            score += 10;
            spawnApple();
        }
        else
        {
            snake.pop_back();
        }
    }

    void changeDirection(Direction newDirection)
    {
        if ((direction == UP && newDirection != DOWN) ||
            (direction == DOWN && newDirection != UP) ||
            (direction == LEFT && newDirection != RIGHT) ||
            (direction == RIGHT && newDirection != LEFT))
        {
            direction = newDirection;
        }
    }

    const std::vector<Segment> &getSnake() const { return snake; }
    Segment getApple() const { return apple; }
    bool getGameOver() const { return isGameOver; }
    int getScore() const { return score; }
};

// Global game instance
SnakeGame game;

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    void resetGame()
    {
        game.resetGame();
    }

    EMSCRIPTEN_KEEPALIVE
    void move()
    {
        game.move();
    }

    EMSCRIPTEN_KEEPALIVE
    void changeDirection(int dir)
    {
        game.changeDirection(static_cast<Direction>(dir));
    }

    EMSCRIPTEN_KEEPALIVE
    int getSnakeLength()
    {
        return game.getSnake().size();
    }

    EMSCRIPTEN_KEEPALIVE
    const Segment *getSnake()
    {
        return game.getSnake().data();
    }

    EMSCRIPTEN_KEEPALIVE
    int getAppleX() {
        return game.getAppleX(); 
    }

    EMSCRIPTEN_KEEPALIVE
    int getAppleY() {
        return game.getAppleY(); 
    }

    EMSCRIPTEN_KEEPALIVE
    bool getGameOver()
    {
        return game.getGameOver();
    }

    EMSCRIPTEN_KEEPALIVE
    int getScore()
    {
        return game.getScore();
    }
}
