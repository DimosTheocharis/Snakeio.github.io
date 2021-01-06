/* ---------------------------------------------------------VARIABLES-------------------------------------------------------*/
let game_board = document.getElementById('game-board');
let body = document.getElementsByTagName('body')[0];
let score = document.getElementById('score');
let lastRenderTime = 0;
const snakeSpeed = 7;
let currentDirection = {x:-1, y:0};
let lastDirection = {x:0, y:0};
let GRID_SIZE = 21;
let GAME_OVER = false;
let show_Results = false;
let SCORE_POINTS = 0;
let LEVEL = Number(localStorage.getItem('Level'));
let Experience_Limit = Number(localStorage.getItem('Experience_Limit'));
let Apples_eaten = 0;
let Golden_Apples_eaten = 0;

function main(currentTime) {
    if (GAME_OVER) {
        show_Results = true;
        GAME_OVER = false;
        localStorage.setItem('Experience_earned',`${Apples_eaten * 5 + Golden_Apples_eaten *  25}` );
        localStorage.setItem("Coins", `${Apples_eaten * 1 + Golden_Apples_eaten * 20 + Math.floor(localStorage.getItem('Coins'))}`);
        localStorage.setItem('Total_Experience',`${Math.floor(localStorage.getItem('Total_Experience')) + Apples_eaten * 5 + Golden_Apples_eaten * 25}`);
        localStorage.setItem('Apples_eaten', `${Apples_eaten}`);
        localStorage.setItem('Golden_Apples_eaten',`${Golden_Apples_eaten}`);
        localStorage.setItem('Score', `${SCORE_POINTS}`);

    }
    window.requestAnimationFrame(main);
    let secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / snakeSpeed) return;
    lastRenderTime = currentTime;
    if (show_Results === false) { 
        score.innerHTML = `Score: ${SCORE_POINTS}`;
        update();
        draw(); 
    } else {
        body.innerHTML = "";
        window.location = "https://dimostheocharis.github.io/Snake.io/results.html";
    }
}

window.requestAnimationFrame(main);

/* --------------------------------------------------------FUNCTIONS-------------------------------------------------------------*/

function update() {
    snake.update();
    apple.update();
    snake.checkDeath();
}

function draw() {
    game_board.innerHTML = "";
    snake.draw(game_board);
    apple.draw(game_board);
    obstacles.draw(game_board);
}

window.addEventListener('keydown', e => {
    switch(e.key) {
        case 'w':
            if (lastDirection.y !== 0) break;
            currentDirection = {x:0, y:-1};
            break;
        case 's':
            if (lastDirection.y !== 0) break;
            currentDirection = {x:0, y: 1};
            break;
        case 'd':
            if (lastDirection.x !== 0) break;
            currentDirection = {x:1, y:0};
            break;
        case 'a':
            if (lastDirection.x !== 0) break;
            currentDirection = {x:-1, y:0};
            break;
    }
})

function returnDirection() {
    lastDirection =  currentDirection;
    return currentDirection;
}

function equalPositions(pos1, pos2) {
    return (pos1.x === pos2.x) && (pos1.y === pos2.y)
}

function getRandomGridPosition() {
    return {
        x: Math.floor(Math.random() * GRID_SIZE) + 1,
        y: Math.floor(Math.random() * GRID_SIZE) + 1
    }
}

/* --------------------------------------------------------SNAKE------------------------------------------------------------------*/
class Snake {
    constructor(headColor, bodyColor) {
        this.headColor = headColor;
        this.bodyColor = bodyColor;
        this.body = [{x:10, y:10}, {x:11, y:10}];
        this.direction = {x:-1, y:0};
        this.lastDirection = {x:0, y:0};
        this.expansionRate = 1;
    }

    update() {
        this.direction = returnDirection();
        for (let i = this.body.length - 2; i>=0; i--) {
            this.body[i+1] = { ...this.body[i] };
        }
        this.body[0].x += this.direction.x;
        this.body[0].y += this.direction.y;
    }
    
    draw(board) {
        this.body.forEach(element => {
            let new_element = document.createElement('div');
            new_element.classList.add('snake');
            new_element.style.backgroundColor = this.bodyColor;
            new_element.style.gridColumnStart = element.x;
            new_element.style.gridRowStart = element.y;
            board.appendChild(new_element);
        })
        board.childNodes[0].style.backgroundColor = this.headColor;
    }

    onSnake(position) {
        return this.body.some(element => {
            return equalPositions(element, position);
        })
    }

    expand() {
        for (let i = this.expansionRate; i>0; i-- ) {
            this.body.push( { ...this.body[this.body.length - 1] });
        }
    }

    intersectionCollision() {
        if (this.body.length >= 4) {
            for (let i = this.body.length - 1; i >1; i--) {
                if (equalPositions(this.body[0], this.body[i])) {
                    return true;
                }
            }
        } else {
            return false;
        }
    }

    outsideOfTheGrid() {
        return this.body[0].x <=0 || this.body[0].x > GRID_SIZE || this.body[0].y <= 0 || this.body[0].y > GRID_SIZE;
    }

    checkDeath() {
        GAME_OVER = this.outsideOfTheGrid() || this.intersectionCollision() || obstacles.update();
    }
}


/* ---------------------------------------------------APPLE-----------------------------------------------------------------------*/
class Apple {
    constructor(color) {
        this.color = color;
        this.coordinates = {x: 5, y: 5};
        this.value = 'normal';
    }

    draw(board) {
        let new_element = document.createElement('div');
        new_element.classList.add('food');
        new_element.style.gridColumnStart = this.coordinates.x;
        new_element.style.gridRowStart = this.coordinates.y;
        new_element.style.backgroundColor = this.color;
        board.appendChild(new_element);
    }

    getNewApplePosition() {
        let newFoodPosition;
        while (newFoodPosition == null || snake.onSnake(newFoodPosition) || obstacles.positions.some(position => {
            return equalPositions(newFoodPosition, position);
        })) {
            newFoodPosition = getRandomGridPosition();
        }
        this.coordinates = newFoodPosition;
    }

    goldenApple() {
        let number = Math.floor(Math.random() * 20);
        if (number === 7) {
            this.value = 'golden';
            this.color = 'gold';
        } else {
            this.value = 'normal';
            this.color = 'red';
        }
    }

    update() {
        if (snake.onSnake(this.coordinates)) {
            this.getNewApplePosition();
            snake.expand();
            if (this.value === 'normal') {
                Apples_eaten += 1;
                SCORE_POINTS += LEVEL;
            } else if (this.value === 'golden'){
                Golden_Apples_eaten += 1;
                SCORE_POINTS += LEVEL * 5;
            }
            this.goldenApple();
        }
    }
}

/* ------------------------------------------------------OBSTACLES----------------------------------------------------------------------*/
class Obstacles{
    constructor(number) {
        this.number = number;
        this.positions = [];
    }

    getRandomObstaclePositions(player_coordination) {
        for (let x=0;x<this.number;x++) {
            let new_obstacle_position = getRandomGridPosition();
            while (equalPositions(player_coordination, new_obstacle_position)) {
                new_obstacle_position = getRandomGridPosition();
            }
            this.positions.push(new_obstacle_position);
        }
    }

    draw(board) {
        this.positions.forEach(position => {
            let new_element = document.createElement('div');
            new_element.style.gridRowStart = position.y;
            new_element.style.gridColumnStart = position.x;
            new_element.classList.add('obstacle');
            board.appendChild(new_element);
        })
    }

    update() {
        for (let i=0;i<this.number;i++) {
            if (snake.onSnake(this.positions[i])) {
                return true;
            }
        }
    }
}

const snake = new Snake('green', 'green');
const apple = new Apple('red');
const obstacles = new Obstacles(4 + LEVEL);
obstacles.getRandomObstaclePositions(snake.body[0]);

/* allazw to xrwma tou snake an exei epilexthei diaforetiko xrwma apo prasino */
if (localStorage.getItem('Snake Head Color') !== null) {
    snake.headColor = localStorage.getItem('Snake Head Color');
}

if (localStorage.getItem('Snake Body Color') !== null) {
    snake.bodyColor = localStorage.getItem('Snake Body Color');
}

/*--------------------------------------------------Results-----------------------------------------------*/
function Show_Results() {
    var results_window = document.createElement('div');
    results_window.classList.add('results-window');
    body.appendChild(results_window);

}
