# Plotting Commands 

All actions for plotting one image get a id and are to be executed in order.

Every command is acknowledged with ```$ID:ACK#```. If no acknowledgement is received the message is resent after a short time.

The Command ID ```0``` is reserved for special purposes.

When the plotter starts up it sends a startup command ```$0:START#```. Whith is then acknowleded.

After executing a drawing command (```M```, ```L```, ```C``` or ```A```) the plotter sends ```$ID:DONE#``` which is then acknowledged.

The plotter has a plotting command queue which holds a defined number of commands to execute. the gui will e.g. send five commands to the plotter and when the ```DONE``` for the first command is received the sixth command is sent.

when the plotter is missing a command in its queue (e.g. it has commands with the following ids in its queue: [2 3 4 6 7], gets to command 4 and cannot continue beacuse 5 is missing) it can request the missing command with ```$0:REQ:<ID>#```.

After the last command the gui sends ```$0:FIN:<ID>#``` where the id is the id of the final plotting command.


> All of this overhead enables the protocoll to continue plotting after a connection loss.

## moveTo
### args
| Name  | Type | Description                      |
|-------|------|----------------------------------|
| x1    | int  | x start point                    |
| y1    | int  | y start point                    |
| x2    | int  | x endpoint                       |
| y2    | int  | y endpoint                       |
#### command:
```$ID:M:<x1>:<y1>:<x2>:<y2>#```
### Function
Lifts the pen and Moves the pen to a new position.

## lineTo
### args
| Name  | Type | Description                      |
|-------|------|----------------------------------|
| x1    | int  | x start point                    |
| y1    | int  | y start point                    |
| x2    | int  | x endpoint                       |
| y2    | int  | y endpoint                       |
#### command:
```$ID:L:<x1>:<y1>:<x2>:<y2>#```
### Function
Lowers the pen and Moves the pen to a new position in a straight line, drawing this line.

## curveTo
### args
| Name  | Type | Description                          |
|-------|------|--------------------------------------|
| x1    | int  | Cubic Bezier startpoint x            |
| y1    | int  | Cubic Bezier startpoint y            |
| x2    | int  | Cubic Bezier start controlpoint x    |
| y2    | int  | Cubic Bezier start controlpoint y    |
| x3    | int  | Cubic Bezier end controlpoint x      |
| y3    | int  | Cubic Bezier end controlpoint x      |
| x4    | int  | Cubic Bezier endpoint x              |
| y4    | int  | Cubic Bezier endpoint y              |
#### command:
```$ID:C:<x1>:<y1>:<x2>:<y2>:<x3>:<y3>:<x4>:<y4>#```
### Function
Lowers the pen and draws a Cubic Bezier Curve to the end point.

## arc (optional)
### args
| Name            | Type | Description                          |
|-----------------|------|--------------------------------------|
| x               | int  | Ellipse center x                     |
| y               | int  | Ellipse center y                     |
| rx              | int  | x Ellipse radius                     |
| ry              | int  | y Ellipse radius                     |
| as              | int  | Ellipse arc start angle              |
| ae              | int  | Ellipse arc end angle                |
| r               | int  | whole Ellipse arc rotation           |
#### command:
```$ID:A:<x>:<y>:<rx>:<ry>:<as>:<ae>:<r>:#```
### Function
draws a rotated ellipse arc around the center coordinates

> the starting positions can mostly be ignored. because the plotterhead will already be at that position.