var five = require("johnny-five");
var board, potentiometer, led, button, lcd;
var fre = -1, ch = 256;
var freb = 1;

board = new five.Board();

board.on("ready", function () {

  led = new five.Led(13);

  button = new five.Button(7);

  potentiometer = new five.Sensor({
    pin: "A2",
    freq: 250
  });

  board.repl.inject({
    led: led,
    pot: potentiometer,
    button: button
  });



  potentiometer.on("data", function (){
    var nfre = Math.floor(this.value / ch);
    if (nfre != fre) {
      fre = nfre;
      console.log("interval : " + fre + " value: " + this.value);
      led.blink((fre + 1) * ch);
    }
  });

  button.on("down", function () {
    console.log("btn down");
  });

  button.on("hold", function () {
    console.log("btn hold");
  });

  button.on("up", function () {
    console.log("btn up");
    freb++;
    if (freb === 5) freb = 1;
    led.blink((freb + 1) * ch);
  });
});
