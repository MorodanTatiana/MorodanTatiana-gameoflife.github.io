
let w;
let columns;
let rows;
let board;
let font, fontsize = 20;
let score_blue = 0;
let score_red = 0;
let start_time;
let duration = 60; // in seconds
duration = duration * 1000; // transform in milliseconds

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  //font = loadFont('SourceSansPro-Regular.otf');
}

function create2DArray(columns, rows) {
  let arr = new Array(columns);
  for (let i = 0; i < columns; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      arr[i][j] = new Cell(0, i * w, j * w, w, 0);
    }
  }
  return arr;
}

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(20);
  createCanvas(1800, 640);
  w = 15;
  // Calculate columns and rows
  columns = floor(width / w);
  rows = floor((height - 40) / w);
  // create the board
  board = create2DArray(columns, rows);

  init();
  //textFont(font);
  textSize(fontsize);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(100);
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let neighborSum = 0;
      let neighborSum_Neutral = 0;
      let neighborSum_Player = 0;
      let neighborSum_AI = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          //{!1 .bold} Use the previous state when counting neighbors
          neighborSum += board[x + i][y + j].previous_state;
          if (board[x+i][y+j].previous_owner == 1) neighborSum_Neutral += board[x + i][y + j].previous_state;
          if (board[x+i][y+j].previous_owner == 10) neighborSum_Player += board[x + i][y + j].previous_state;
          if (board[x+i][y+j].previous_owner == 20) neighborSum_AI += board[x + i][y + j].previous_state;
        }
      }
      neighborSum -= board[x][y].previous_state;
      neighborSum_Player -= board[x][y].previous_state;
      neighborSum_AI -= board[x][y].previous_state;
      neighborSum_Neutral -= board[x][y].previous_state;

      //{!3} Set the cell's new state based on the neighbor count
      if (board[x][y].state == 1 && neighborSum < 2) {
        board[x][y].state = 0;
      } else if (board[x][y].state == 1 && neighborSum > 3) {
        board[x][y].state = 0;
      } else if (board[x][y].state == 0 && neighborSum == 3) {
        board[x][y].state = 1;
        if (neighborSum_AI >= 2) {
          board[x][y].owner = 20;
          // score_red++;
        }
        if (neighborSum_Player >= 2) {
          board[x][y].owner = 10;
          // score_blue++;
        }
        if (neighborSum_Neutral >= 2) board[x][y].owner = 1;
      }
      // else do nothing!
    }
  }

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      //{!1} evaluates to 255 when state is 0 and 0 when state is 1
      board[i][j].show();
      if (board[i][j].previous_owner != board[i][j].owner) {
        if (board[i][j].owner == 10 && board[i][j].previous_owner == 20) {
          // score_blue++;
          score_red--;
        }
        if (board[i][j].owner == 20 && board[i][j].previous_owner == 10) {
          score_blue--;
          // score_red++;
        }
        if (board[i][j].owner == 1 && board[i][j].previous_owner == 20) {
          score_red--;
        }
        if (board[i][j].owner == 1 && board[i][j].previous_owner == 10) {
          score_blue--;
        }
        if (board[i][j].owner == 20) score_red++;
        if (board[i][j].owner == 10) score_blue++;
      }
      //{!1} save the previous state before the next generation!
      board[i][j].previous_state = board[i][j].state;
      board[i][j].previous_owner = board[i][j].owner;
    }
  }
  
  //square(0, 600, 40);
  textAlign(LEFT);
  fill(250);
  text('SCORE:', 30, 620);
  fill(0, 0, 255);
  text('blue: ' + score_blue, 150, 620); // human - blue
  fill(255, 0, 0);
  text('red: ' + score_red, 350, 620); // ai - red
  checkGameStatus();
}

// reset board when mouse is pressed
function mousePressed() {
  //init();
}

// Fill board randomly
function init() {
  let cell_color;
  for (let i = 1; i < columns - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      cell_color = random([0, 1, 10, 20]);
      board[i][j] = new Cell(floor(random(2)), i * w, j * w, w, cell_color);
      if (cell_color == 10) score_blue++;
      if (cell_color == 20) score_red++;
    }
  }
  start_time = millis();
}

function checkGameStatus() {
  let current_time = millis();
  if (current_time > start_time + duration) {
    noLoop();
    fill(255);
    let winner = "RED";
    if (score_blue > score_red){winner = "BLUE"}
    text("Game END! Winner is " + winner, 500, 620);
  } else {
    fill(255);
    let the_time = current_time - start_time;
    the_time = round(the_time / 1000);
    let the_remains = duration / 1000 - the_time;
    text("Time: " + the_time + " seconds. You have " + the_remains + " seconds remains to win.", 500, 620);
  }
}
