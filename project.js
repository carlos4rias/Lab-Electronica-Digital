var five = require("johnny-five"),
  board, lcd, buttons, error_pot = 90, pot;
var infra = false;
var val_infra = 11;


board = new five.Board();

board.on("ready", function() {

  var values = [0, 0, 0];
  var cur_screen = 0;

  lcd = new five.LCD({
    // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
    // Arduino pin # 7    8   9   10  11  12
    pins: [12, 11, 5, 4, 3, 2],
    backlight: 6,
    rows: 2,
    cols: 20
    // Options:
    // bitMode: 4 or 8, defaults to 4
    // lines: number of lines, defaults to 2
    // dots: matrix dimensions, defaults to "5x8"
  });

  buttons = new five.Sensor({
    pin: "A0",
    freq: 250
  });

  pot = new five.Sensor({
    pin: "A4",
    freq: 1000
  });


  this.repl.inject({
    lcd: lcd,
    potentiometer: buttons,
    pot: pot
  });

  pot.on("data", function () {
    paint_screen(cur_screen);
  });

  var proximity = new five.Proximity({
    controller: "GP2Y0A21YK",
    pin: "A1"
  });

  proximity.on("data", function() {
    // console.log("Proximity: ");
    // console.log("  in  : ", this.in);
    // console.log("-----------------");
    if (this.in > val_infra && infra === false) {
      infra = true;
      console.log("activado");
      values[cur_screen] = pot.value;
      paint_screen(cur_screen);
    } else if (infra === true && this.in < val_infra) {
      infra = false;
      console.log("desactivado");
    }

  });

  buttons.on("data", function (){
    if (this.value >= 317 - error_pot && this.value <= 317 + error_pot) {
      if (cur_screen === 0) cur_screen = 3;
      cur_screen--;
      paint_screen(cur_screen);
    }

    if (this.value >= 710 - error_pot && this.value <= 710 + error_pot) {
      cur_screen++;
      if (cur_screen === 3) cur_screen = 0;
      paint_screen(cur_screen);
    }
  });

  var paint_screen = function(screen) {
    lcd.clear().cursor(0, 0).print("Opcion " + screen + ": " + values[screen]);
    lcd.cursor(1, 0).print("Parametro " + screen + ":" + pot.value);
  }
});
