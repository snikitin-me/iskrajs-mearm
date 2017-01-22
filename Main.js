var servos = {
  shoulder : P13,
  elbow : P12,
  base : P11,
  hand : P10
};

// Add a variable that the 2 functions below will use
Pin.positions = {};

// A function that will set pulse width modulation up on the servo
Pin.prototype.goto = function(pos) { // -1 .. 1
  Pin.positions[this] = pos;
  var val = E.clip(0.5*pos+1.5,1,3)*0.05;
  console.log(this, pos, val);
  analogWrite(this, val, {freq:50});
};

// This will just move one step in the direction that is given
Pin.prototype.move = function(dir) {
  Pin.positions[this] = E.clip(Pin.positions[this]+dir,-1,1);

  console.log(this, Pin.positions[this]);

  this.goto(Pin.positions[this]);
};


// Is the hand clenched?
var clenched;
// These are the values for how much the servo should move if the hand is clenched or not. The values you need will depend a lot on how you assemble your MeArm
var hand_on = 0.5;
var hand_off = 2;

// On initialisation, set the MeArm up to it's default positions
function onInit() {
  servos.shoulder.goto(-0.5);
  servos.elbow.goto(0);
  servos.base.goto(0);
  clenched = false;
  servos.hand.goto(hand_off);
}

var Writer = require("MeArm").Writer;
var oWriter = new Writer({ LED: LED });

require("IRReceiver").connect(P0, function(code) {
  if(code == "110100000101000000010100011010111") oWriter.toggleGrubMode();
  if(code == "110100000101000000110011010011001") oWriter.repeat();
  if(code == "110100000101000001111100000000111") oWriter.reset(); // EZ VIEW
  if(oWriter.isGrabMode()) oWriter.setCode(code);
  fireIRCode(code);
});

function fireIRCode(code){
    switch (code) {
        case "110100000101000001011100001000111": onInit(); break; // power
        case "110100000101000000100010010111011": servos.elbow.move(0.1); break; // ch +
        case "110100000101000000111100010000111": servos.elbow.move(-0.1); break; // ch -
        case "110100000101000001110100000010111": servos.base.move(0.1); break; // left
        case "110100000101000001100100000110111": servos.base.move(-0.1); break; // right
        case "110100000101000000011010011001011": servos.shoulder.move(0.1); break; // up
        case "110100000101000001011010001001011": servos.shoulder.move(-0.1); break; // down
        case "110100000101000001100001000111101": clenched = !clenched;
            servos.hand.goto(clenched ? hand_on : hand_off); break; // ok
        default: print("Unknown "+code);
    }
}

// Finally, initialise
onInit();