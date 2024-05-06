class Cell {
    constructor(state, x, y, w, owner) {
      // What is the cell’s state?
      this.state = state;
      this.previous_state = this.state;
      this.owner = owner;
      this.previous_owner = this.owner;
  
      // position and size
      this.x = x;
      this.y = y;
      this.w = w;
    }
  
    show() {
      stroke(0);
      //{!2} If the cell is born, color it blue!
      if (this.owner == 10) { // the player
        fill(0, 0, 255);
      } else if (this.owner == 1) { // neutral owner
        fill(0);
      } else if (this.owner == 20) { // the AI player
        fill(255, 0, 0);
      } else {
        fill(255);
      }
      // noStroke();
      square(this.x, this.y, this.w);
    }
  }
  