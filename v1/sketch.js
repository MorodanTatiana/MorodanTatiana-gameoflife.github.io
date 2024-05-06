
let w;
let columns;
let rows;
let board;
let next;

function create2DArray(columns, rows) {
  let arr = new Array(columns);
  for (let i = 0; i < columns; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      arr[i][j] = new Cell(0, i * w, j * w, w);
    }
  }
  return arr;
}

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(10);
  createCanvas(1200, 600);
  w = 10;
  // Calculate columns and rows
  columns = floor(width / w);
  rows = floor(height / w);
  // create the board
  board = create2DArray(columns, rows);
  
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  // Going to use colors
  state = new Array(columns);
  for (i = 0; i < columns; i++) {
    state[i] = new Array(rows);
  }
  init();
}

function draw() {
  background(200);
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let neighborSum = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          //{!1 .bold} Use the previous state when counting neighbors
          neighborSum += board[x + i][y + j].previous;
        }
      }
      neighborSum -= board[x][y].previous;

      //{!3} Set the cell's new state based on the neighbor count
      if (board[x][y].state == 1 && neighborSum < 2) {
        board[x][y].state = 0;
      } else if (board[x][y].state == 1 && neighborSum > 3) {
        board[x][y].state = 0;
      } else if (board[x][y].state == 0 && neighborSum == 3) {
        board[x][y].state = 1;
      }
      // else do nothing!
    }
  }

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      //{!1} evaluates to 255 when state is 0 and 0 when state is 1
      board[i][j].show();
      
      //{!1} save the previous state before the next generation!
      board[i][j].previous = board[i][j].state;
    }
  }
}

// reset board when mouse is pressed
function mousePressed() {
  init();
}

// Fill board randomly
function init() {
  for (let i = 1; i < columns - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      board[i][j] = new Cell(floor(random(2)), i * w, j * w, w);
    }
  }
}

