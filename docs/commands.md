# Plotting Commands 

## moveTo
### args
| Name  | Type | Description                      |
|-------|------|----------------------------------|
| x     | int  | x offset                         |
| y     | int  | y offset                         |
| r     | bool | relative or absolute coordinates |
#### command:
 * M for absolute
 * m for relative
### Function
Lifts the pen and Moves the pen to a new position.

## lineTo
### args
| Name  | Type | Description                      |
|-------|------|----------------------------------|
| x     | int  | x offset                         |
| y     | int  | y offset                         |
| r     | bool | relative or absolute coordinates |
#### command:
 * L for absolute
 * l for relative
### Function
Lowers the pen and Moves the pen to a new position in a straight line, drawing this line.

## curveTo
### args
| Name  | Type | Description                          |
|-------|------|--------------------------------------|
| x1    | int  | Cubic Bezier start controlpoint x    |
| y1    | int  | Cubic Bezier start controlpoint y    |
| x1    | int  | Cubic Bezier end controlpoint x      |
| y2    | int  | Cubic Bezier end controlpoint x      |
| x     | int  | Cubic Bezier endpoint x              |
| y     | int  | Cubic Bezier endpoint y              |
| r     | bool | relative or absolute coordinates     |
#### command:
 * C for absolute
 * c for relative
### Function
Lowers the pen and draws a Cubic Bezier Curve to the end point.

## arc
### args
| Name            | Type | Description                          |
|-----------------|------|--------------------------------------|
| rx              | int  | x Ellipse radius                     |
| ry              | int  | y Ellipse radius                     |
| x-axis-rotation | int  | Rotation of the x axis               |
| large-arc-flag  | bool | draw large or small arc              |
| sweep-flag      | bool | positive or negative angles          |
| x               | int  | Ellipse endpoint x                   |
| y               | int  | Ellipse endpoint y                   |
| r               | bool | relative or absolute coordinates     |
#### command:
 * A for absolute
 * a for relative
### Function
Lowers the pen and draws a Cubic Bezier Curve to the end point.
