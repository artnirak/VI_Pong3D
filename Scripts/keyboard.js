window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var started = false;

var Key = {
  _pressed: {},

  SHIFT: 16,
  A: 65,
  W: 87,
  D: 68,
  SPACE: 32,
  S: 83,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
    if(event.keyCode === Key.SPACE && !started)
    {
        document.getElementById('Start').style.display = "none";
        draw();
        started = true;
    }
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }


};


