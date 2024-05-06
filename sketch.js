
let w = 15; // dimensiunea unei celule
let columns; // numarul de coloane
let rows; // numarul de linii
let board; // tabla de joc
let font, fontsize = 20; // fontul, si marimea fontului
let score_blue = 0; // scorul calculatorului
let score_red = 0; // scorul jucatorului
let start_time; // folosita sa putem calcula cand se termina jocul
let duration = 75; // in secunde
duration = duration * 1000; // transforma in milliseconds
let gameStarted = false; // jocul a inceput sau nu
let start_column_red = 1; // coloana de inceput a zonei jucatorului
let start_column_blue; // coloana de inceput a zonei calculatorului
let end_column_red; // coloana de final a zonei jucatorului
let end_column_blue; // coloane de final a zonei calculatorului
let player_id = 20; // ID-ul jucatorului, sa stiu a cui este celula (owner)
let computer_id = 10; // ID-ul calculatorului
let used_by_player = 0; // cate celule a folosit jucatorul
let used_by_computer = 0; // cate celule a folosit calculatorul

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
  // Seteaza framerate pt simulare la 10 ca sa evit flickering-ul
  frameRate(20);
  createCanvas(1860, 640);
  // Calculam coloanele si liniile
  columns = floor(width / w);
  rows = floor((height - 40) / w);
  // cream tabla
  board = create2DArray(columns, rows);
  x = round((columns-2)/3); // calculam cate coloane sunt intr-o treime din tabla
  end_column_red = x + 1; // avem de unde pana unde vine terenul playerului
  start_column_blue = x * 2 + 1;
  end_column_blue = columns - 1;

  init();
  //textFont(font);
  textSize(fontsize);
  textAlign(CENTER, CENTER);

  // Creăm un buton de start
  let startButton = createButton('Start...');
  startButton.position(10, height + 10);
  startButton.mousePressed(startGame);
}

function startGame() {
  gameStarted = true; // Setăm variabila pentru a marca începerea jocului
  init(); // Inițializăm tabla de joc
}

function draw() {
  background(100);
  if (gameStarted) {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        let neighborSum = 0;
        let neighborSum_Player = 0;
        let neighborSum_AI = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            x1 = x + i;
            y1 = y + j;
            if (x1 < 0) x1 = columns-1;
            if (x1 >= columns) x1 = 0;
            if (y1 < 0) y1 = rows-1;
            if (y1 >= rows) y1 = 0;
            // folosesc previous state cand calculez vecinii
            neighborSum += board[x1][y1].previous_state; 
            if (board[x1][y1].previous_owner == player_id) neighborSum_Player += board[x1][y1].previous_state;
            if (board[x1][y1].previous_owner == computer_id) neighborSum_AI += board[x1][y1].previous_state;
          }
        }
        neighborSum -= board[x][y].previous_state;
        neighborSum_Player -= board[x][y].previous_state;
        neighborSum_AI -= board[x][y].previous_state;
        if (board[x][y].state == 1 && neighborSum < 2) {
          board[x][y].state = 0;
          board[x][y].owner = 0;
        } else if (board[x][y].state == 1 && neighborSum > 3) {
          board[x][y].state = 0;
          board[x][y].owner = 0;
          if (neighborSum_Player == 3) {
            board[x][y].owner = player_id;
            board[x][y].state = 1;
            score_red++;
          }
          if (neighborSum_AI == 3) {
            board[x][y].owner = computer_id;
            board[x][y].state = 1;
            score_blue++;
          }
        } else if (board[x][y].state == 0 && neighborSum == 3) {
          board[x][y].state = 1;
          if (neighborSum_AI >= 2) {
            board[x][y].owner = computer_id;
            score_blue++;
          }
          if (neighborSum_Player >= 2) {
            board[x][y].owner = player_id;
            score_red++;
          }
        }
      }
    }

    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        board[i][j].show();
        if (board[i][j].previous_owner != board[i][j].owner) {
          if (board[i][j].owner == computer_id && board[i][j].previous_owner == player_id) {
            score_blue++;
          }
          if (board[i][j].owner == player_id && board[i][j].previous_owner == computer_id) {
            score_red++;
          }
        }
        //salveaza previous state inainte de urmatoarea generatie!
        board[i][j].previous_state = board[i][j].state;
        board[i][j].previous_owner = board[i][j].owner;
      }
    }
    
    stroke(80);
    textAlign(LEFT);
    fill(250);
    text('SCORE:', 30, 620);
    fill(0, 0, 255);
    text('blue: ' + score_blue, 150, 620); // computer - blue
    fill(255, 0, 0);
    text('red: ' + score_red, 350, 620); // uman - red
    stroke(180);
    checkGamestate();
  } else {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        board[i][j].show();
      }
    }
  }
}

// Genereaza tabla de inceput
function init() {
  let cell_color;
  if (!gameStarted) {
    // Inițializarea manuală a tablei de joc
    for (let i = 1; i < columns - 1; i++) {
      for (let j = 1; j < rows - 1; j++) {
        if (i >= start_column_red && i <= end_column_red) {
          board[i][j] = new Cell(0, i * w, j * w, w, player_id + 1); // player zone
        } else if (i >= start_column_blue && i <= end_column_blue) {
          board[i][j] = new Cell(0, i * w, j * w, w, computer_id + 1); // computer zone
        } else {
          board[i][j] = new Cell(0, i * w, j * w, w, 0);
        }
      }
    }
  } else {
    for (let i = 1; i < columns - 1; i++) {
      for (let j = 1; j < rows - 1; j++) {
        if (used_by_computer >= used_by_player) {
          continue;
        }
        cell_color = random([0, 0, 0, 0, computer_id]);
        if (i >= start_column_blue && i <= end_column_blue) {
          if (cell_color == computer_id) state = 1; 
          else state = 0;
          board[i][j] = new Cell(state, i * w, j * w, w, cell_color);
          board[i][j].previous_state = state;
          board[i][j].previous_owner = cell_color;
          if (state == 1) {
            used_by_computer++;
          }
        }
      }
    }
    for (let i = 1; i < columns - 1; i++) {
      for (let j = 1; j < rows - 1; j++) {
        if (board[i][j].owner == player_id + 1 || board[i][j].owner == computer_id + 1) {
          board[i][j].state = 0;
          board[i][j].owner = 0;
        }
      }
    }
    start_time = millis();
  }
}

function checkGamestate() {
  let current_time = millis();
  if (current_time > start_time + duration) {
    noLoop();
    fill(255);
    let winner = "RED";
    if (score_blue > score_red){winner = "BLUE"}
    text(" >>>> GAME OVER <<<<  ....,,,___,,,... The winner is " + winner, 500, 620);
  } else {
    fill(255);
    let the_time = current_time - start_time;
    the_time = round(the_time / 1000);
    let the_remains = duration / 1000 - the_time;
    text("Time: " + the_time + " seconds. You have < " + the_remains + " > seconds remains to win.", 500, 620);
  }
}

function mousePressed() {
  for (let i = 1; i < columns - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      let cell = board[i][j];
      if (
        mouseX > cell.x &&
        mouseX < cell.x + cell.w &&
        mouseY > cell.y &&
        mouseY < cell.y + cell.w &&
        ((!gameStarted && i >= start_column_red && i <= end_column_red) || gameStarted)
      ) {
        if (cell.state == 0) {
          cell.owner = player_id;
          cell.state = 1;
          cell.previous_state = 1;
          cell.previous_owner = player_id;
          used_by_player++;
        } else if (cell.state == 1 && cell.owner == player_id) {
          cell.state = 0;
          if (gameStarted) cell.owner = 0;
          else cell.owner = player_id + 1;
          used_by_player--;
        }
      }
    }
  }
}

