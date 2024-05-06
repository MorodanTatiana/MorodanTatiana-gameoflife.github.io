class Cell {
    constructor(state, x, y, w, owner) {
      // ce valoare are state-ul celulei
      this.state = state;
      this.previous_state = this.state;
      this.owner = owner;
      this.previous_owner = this.owner;
  
      // pozitie si marime
      this.x = x;
      this.y = y;
      this.w = w;
    }
  
    show() {
      stroke(180);

      if (this.owner == 10) { // computer
        fill(0, 0, 255);
      } else if (this.owner == 20) { // player
        fill(255, 0, 0);
      } else if (this.owner == 21) { // tabla pt player
        fill(255, 220, 220); // light red
      } else if (this.owner == 11) { // tabla pt computer
        fill(220, 220, 255); // light blue
      } else {
        fill(255);
      }
      square(this.x, this.y, this.w);
    }
}
  