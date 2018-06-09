

module.exports = {
  canvas: function(drawing) {
    const p5 = require('p5');
    this.figures = [];
    new p5((p) => {
        p.setup = () => {
          for(let i = 0; i < drawing.paths.length; i++) {
            let position = {
              x: drawing.viewbox.x,
              y: drawing.viewbox.y
            };
            for(let j = 0; j < drawing.paths[i].length; j++) {
              switch(drawing.paths[i][j].type) {
                case 'lineTo':
                  this.figures.push({
                    type: 'line',
                    props: {
                      x1: position.x,
                      y1: position.y,
                      x2: drawing.paths[i][j].props.x,
                      y2: drawing.paths[i][j].props.y
                    }
                  });             
                  break;
                case 'curveTo':
                  this.figures.push({
                    type: 'bezier',
                    props: {
                      x1: position.x,
                      y1: position.y,
                      x2: drawing.paths[i][j].props.x1,
                      y2: drawing.paths[i][j].props.y1,
                      x3: drawing.paths[i][j].props.x2,
                      y3: drawing.paths[i][j].props.y2,
                      x4: drawing.paths[i][j].props.x,
                      y4: drawing.paths[i][j].props.y
                    }
                  });             
                  break;
                case 'arc':
                  this.figures.push({
                    type: 'arc',
                    props: {
                      x: drawing.paths[i][j].props.x,
                      y: drawing.paths[i][j].props.x,
                      cx: drawing.paths[i][j].props.cx,
                      cy: drawing.paths[i][j].props.cy,
                      w: drawing.paths[i][j].props.rx,
                      h: drawing.paths[i][j].props.ry,
                      t1: drawing.paths[i][j].props.t1,
                      dt: drawing.paths[i][j].props.dt
                    }
                  });
                  break;
              }
              position.x = drawing.paths[i][j].props.x;
              position.y = drawing.paths[i][j].props.y;
            }
          }
          p.createCanvas(drawing.dimensions.width, drawing.dimensions.height);
        }
        
        p.draw = () => {
          p.strokeWeight(5);
          p.stroke(0);
          p.noFill();
          p.angleMode(p.DEGREES);
          for(let i = 0; i < this.figures.length; i++){
            switch(this.figures[i].type) {
              case 'line':
                p.line(this.figures[i].props.x1, this.figures[i].props.y1, this.figures[i].props.x2, this.figures[i].props.y2);
                break;
              case 'bezier':
                p.bezier(this.figures[i].props.x1, this.figures[i].props.y1, this.figures[i].props.x2, this.figures[i].props.y2, this.figures[i].props.x3, this.figures[i].props.y3, this.figures[i].props.x4, this.figures[i].props.y4);
                break;
              case 'arc':
                p.push();
                p.translate(this.figures[i].props.cx, this.figures[i].props.cy);
                p.rotate(-this.figures[i].props.t1);
                p.arc(0, 0, 2 * this.figures[i].props.w, 2 * this.figures[i].props.h, -this.figures[i].props.t1, -this.figures[i].props.dt);
                //p.ellipse(0, 0, 2 * this.figures[i].props.w, 2 * this.figures[i].props.h);
                p.pop();
                break;
            }
          }
        }
      }, 'drawing');
    }
};