var Writer = function(opt) {
    // TODO opt
    this._delay = 500;
    this._codes = [];
    this._isGrabMode = false;
    this._currentIndex = 0;
    this.LED = opt.LED;
}

Writer.prototype.isGrabMode = function() {
    return this._isGrabMode;
}

Writer.prototype.setCode = function(code) {
    if (this._isGrabMode) {
        this._codes.push(code);
    }
};

Writer.prototype.shiftCode = function() {
    //return this._codes.shift();
    var code = this._codes[this._currentIndex];
    this._currentIndex++;
    return code;
};

Writer.prototype.reset = function() {
    this._codes = [];
}

Writer.prototype.startGrubMode = function() {
    if (this._codes.length) {
        console.log("Codes stack not empty, please push reset");
        return false;
    }

    this._isGrabMode = true;
    this.LED.write(this._isGrabMode);
};

Writer.prototype.stopGrubMode = function() {
    this._isGrabMode = false;
    this._currentIndex = 0;
    this.LED.write(this._isGrabMode);
};

Writer.prototype.toggleGrubMode = function() {
    if (this._isGrabMode) this.stopGrubMode();
    else this.startGrubMode();
};

Writer.prototype.repeat = function() {
    if (this._codes.length) {
        var timerId = setInterval(function() {
            console.log('grub codes index: ' + this._currentIndex + ' from: ' +  this._codes.length);
            if (this._currentIndex < this._codes.length) {
                fireIRCode(this.shiftCode());
            }else{
              // TODO stop!?
            }
        }.bind(this), this._delay);

        setTimeout(function() {
            clearInterval(timerId);
            this.stopGrubMode();
        }.bind(this), this._delay * this._codes.length/2);

    }
};

exports.Writer = Writer;
