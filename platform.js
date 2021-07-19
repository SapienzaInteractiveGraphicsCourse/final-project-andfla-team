"use strict";

import * as UTILS from './utils.js';

var width_viewable = 18;    // [-18, +18]

const platform = {
    x: 0,
    y: 0,
    z: 0,
    type: 0,
    
    generate: function (position) {
        this.x = UTILS.generateRandomInt(-width_viewable, +width_viewable);
        this.y = position;
    }
}

const platforms = {
  obj: [],
  
  number: 10,
}

export {platform, platforms};

































/*
      //Platform types
      //1: Normal
      //2: Moving
      //3: Breakable (Go through)
      //4: Vanishable 
      //Setting the probability of which type of platforms should be shown at what score
      if (score >= 5000) this.types = [2, 3, 3, 3, 4, 4, 4, 4];
      else if (score >= 2000 && score < 5000) this.types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
      else if (score >= 1000 && score < 2000) this.types = [2, 2, 2, 3, 3, 3, 3, 3];
      else if (score >= 500 && score < 1000) this.types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
      else if (score >= 100 && score < 500) this.types = [1, 1, 1, 1, 2, 2];
      else this.types = [1];

      //this.type = this.types[Math.floor(Math.random() * this.types.length)];

      //We can't have two consecutive breakable platforms otherwise it will be impossible to reach another platform sometimes!
      if (this.type == 3 && broken < 1) {
        broken++;
      } else if (this.type == 3 && broken >= 1) {
        this.type = 1;
        broken = 0;
      }

      this.moved = 0;
      this.vx = 1;
      */