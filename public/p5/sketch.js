var socket = io.connect();
			
socket.on('connect', function() {
  console.log("Connected " + socket.id);
});

socket.on('mouse', function(mouseData) {
  px = x;
  py = y;
  x = mouseData.x;
  y = mouseData.y;
});

socket.on('blink', function(whatever) {
  background(0);
  setTimeout(function() {
    background(255);
  }, 50);
});

let x = 0;
let y = 0;
let px = 0;
let py = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  //background(220);
  //ellipse(x, y, 20, 20);
  strokeWeight(20);
  line(px, py, x, y);
}

function mouseMoved() {
  console.log(mouseX,mouseY);
  px = x;
  py = y;
  x = mouseX;
  y = mouseY;
  let dataToSend = {x: x, y: y};
  // let dataToSend = new Object();
  // dataToSend.x = x;
  // dataToSend.y = y;
  socket.emit('mouse', dataToSend);
}

function mousePressed() {
  socket.emit('blink', {});
}