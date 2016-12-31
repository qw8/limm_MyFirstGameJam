class GameSystem { // a class for handling interactions between objects
  constructor(player) {
    this.walls = []; // stores all walls
    this.player = player || new Mover(width/2, height/2, 10, 10); // if passed..
          // as an argument, assign a player, create a new Mover otherwise
    this.timeManager = new TimeManager();
  }

  addWall(wall) { // add new wall to the walls array
    this.walls.push(wall);
  }

  updateGame(dt) { // update player and check for collisions
    this.player.updateNetForce(dt);
    this.moverWallCollision(this.player);
    this.player.updatePos();
  }

  update() {
    this.timeManager.updateFixed((ts) => {
      this.updateGame(ts);
    });
  }

  moverWallCollision(mover) { // check for collisions between walls and player
    let grounded = false;
    for (let wall of this.walls) { // for every wall in walls array..

      // horizontal collision
      if (collideRectRect(mover.pos.x + mover.vel.x, mover.pos.y, mover.wid, mover.hei,
                          wall.pos.x, wall.pos.y, wall.wid, wall.hei)) {
      // if player will collide in the next frame, correct his velocity and position
        let preventer = 0;
        while (!collideRectRect(mover.pos.x + Math.sign(mover.vel.x), mover.pos.y,
                              mover.wid, mover.hei, wall.pos.x, wall.pos.y, wall.wid, wall.hei)) {
          mover.pos.x += Math.sign(mover.vel.x); // move the player as long..
           // as he does not collide with the wall
          if (++preventer > 30) {  // if executed too many times, then break
            break;
          }
        }
        mover.vel.x = 0;
      }

      // vertical collision, mostly the same logic
      if (collideRectRect(mover.pos.x, mover.pos.y + mover.vel.y, mover.wid, mover.hei,
                          wall.pos.x, wall.pos.y, wall.wid, wall.hei)) {
        let preventer = 0;
        while (!collideRectRect(mover.pos.x, mover.pos.y + Math.sign(mover.vel.y),
                              mover.wid, mover.hei, wall.pos.x, wall.pos.y, wall.wid, wall.hei)) {
          mover.pos.y += Math.sign(mover.vel.y);
          if (++preventer > 30) {
            break;
          }
        }
        if (mover.vel.y > 0) { // if player was about to collide from above,..
          grounded = true; // then he is on the ground
        }
        mover.vel.y = 0; // set player's velocity to 0
      }
    }
    mover.isGrounded = grounded;
  }

  render() { // draw the whole system
    for (let wall of this.walls) {
      wall.render();
    }
    this.player.render();
  }
}
