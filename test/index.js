var test = require('tape')
var sinon = require('sinon')
var Writer = require("../modules/MeArm.js").Writer

test('Test writer - base functions', function(t) {
	t.plan(2);

    var oLED = { write: function(val) {} }
    var stub = sinon.stub(oLED, 'write', function(val) {

    });

    var oWriter = new Writer({ LED: oLED })
    oWriter.toggleGrubMode()

    t.ok(oWriter.isGrabMode(), 'Grub mode is set')
    t.ok(oLED.write.getCall(0).args[0] === oWriter.isGrabMode(), 'Led is called with grab mode')
})

// test('Test writer - record', function(t) {

// });