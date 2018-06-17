const serialport = require('serialport');
const Delimiter = require('@serialport/parser-delimiter');

module.exports =  class Comm {
  constructor() {
    this.transmitting = false;
    this.serial = null;
  }

  async ports() {
    return await serialport.list();
  }

  async connect(port) {
    if(this.transmitting) { return; }

    this.serial = new serialport(port, {
      baudRate: 115200,
      autoOpen: false
    });

    this.serial.open((_error) => {
      if(_error) {
        console.error(_error);
        this.serial = null;
      }
    });
  }

  async start(svg) {
    if(!this.serial) { return; }
    if(this.transmitting) { return; }
    if(!svg) { return; }
    var paths = [].concat(...svg.paths);
    var index = 0;
    var status = 'idle';

    var factor = {};

    this.transmitting = true;

    var parser = this.serial.pipe(new Delimiter({ delimiter: '$' }));

    let timer = null;
    async function timeout(set) {
      if(set) {
        if(timer) { clearTimeout(timer); }
        timer = setTimeout(() => {
          if(status == 'wait-for-ack') {
            status = 'timeout';
            next();
          }
        }, 60 * 1000);

      } else {
        if(timer) { clearTimeout(timer); }
      }
    };

    let next = (data) => {
      if(data) { data = data.toString(); }
      console.log(status);
      console.log(index);
      console.log(data);
      switch(status) {
        case 'start':
          status = 'send-next';
          if(data[0] !== '#' && data[1] !== 'S') { 
              console.error(`isNaC`);
              status = 'error';
          } else {
            data = data.slice(3).split(':');
            if(data.length != 2) {
              console.error(`wrong length`);
              status = 'error';
            } else {
              let x = Number(data[0]);
              let y = Number(data[1]);

              if(isNaN(x) || isNaN(y)) {
                console.error(`isNaN`);
                status = 'error';
              } else {
                factor = {
                  x: x / svg.dimensions.width,
                  y: y / svg.dimensions.height
                }
              }
            }
          }
          next();
          break;
        case 'wait-for-ack':
          if(data == '#ACK') {
            status = 'send-next';
            index++;
            if(index >= paths.length) {
              status = 'send-fin';
            }
            next();
          } else {
            console.error(`wrong ack`);
            status = 'error';
            next();
          }
          break;
        case 'send-next':
          let msg = '#';
          let cmd = paths[index];
          msg += `${cmd.type[0].toUpperCase()}:`;

          switch(cmd.type) {
            case 'moveTo':
            case 'lineTo':
              msg += `${Math.round(cmd.props.x * factor.x)}:${Math.round(cmd.props.y * factor.y)}`;
              break;
            case 'curveTo':
              msg += `${Math.round(cmd.props.x1 * factor.x)}:${Math.round(cmd.props.y1 * factor.y)}:${Math.round(cmd.props.x2 * factor.x)}:${Math.round(cmd.props.y2 * factor.y)}:${Math.round(cmd.props.x * factor.x)}:${Math.round(cmd.props.y * factor.y)}`;
              break;
          }

          msg += '$';

          console.log(msg);

          this.serial.write(msg, (_error) => {
            if(_error) {
              console.error(_error);
              status = 'error';
              next();
            } else {
              status = 'wait-for-ack';
              timeout(true);
            }
          });
          break;
        case 'send-fin':
          this.serial.write('#F$', (_error) => {
            if(_error) {
              console.error(_error);
              status = 'error';
              next();
            } else {
              status = 'done';
              this.transmitting = false;
              parser = null;
              timeout(true);
            }
          });
          break;
        case 'timeout':
        case 'error':
          this.transmitting = false;
          parser = null;
          break;
      }
    };
    
    parser.on('data', next);

    this.serial.write('#S$', (_error) => {
      if(_error) {
        console.error(_error);
        status = 'error';
        next();
      } else {
        status = 'start';
        timeout(true);
      }
    });
  }
};