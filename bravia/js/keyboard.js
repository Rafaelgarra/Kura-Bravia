/* ==========================================================================
   KURA BRAVIA APP — VIRTUAL KEYBOARD (ES5 Compliant)
   - Matrix Grid Layout for D-pad Directional Navigation
   ========================================================================== */

var VirtualKeyboard = {
  layout: [
    ['A', 'B', 'C', 'D', 'E', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X'],
    ['Y', 'Z', '1', '2', '3', '4'],
    ['5', '6', '7', '8', '9', '0'],
    ['SPACE', 'DELETE', 'CLEAR']
  ],
  
  currentRow: 0,
  currentCol: 0,
  container: null,
  onKeyPressCallback: null,

  init: function(containerId, callback) {
    this.container = document.getElementById(containerId);
    this.onKeyPressCallback = callback;
    this.currentRow = 0;
    this.currentCol = 0;
    this.render();
  },

  render: function() {
    if (!this.container) return;
    
    var html = '';
    for (var r = 0; r < this.layout.length; r++) {
      html += '<div class="keyboard-row" id="kb-row-' + r + '">';
      for (var c = 0; c < this.layout[r].length; c++) {
        var keyVal = this.layout[r][c];
        var keyClass = 'key';
        
        // Special styling for control keys
        if (keyVal === 'SPACE') {
          keyClass += ' space';
        } else if (keyVal === 'DELETE') {
          keyClass += ' backspace';
        } else if (keyVal === 'CLEAR') {
          keyClass += ' clear';
        }
        
        html += '<div class="' + keyClass + '" data-row="' + r + '" data-col="' + c + '" id="key-' + r + '-' + c + '">' + keyVal + '</div>';
      }
      html += '</div>';
    }
    
    this.container.innerHTML = html;
    this.updateFocus();
  },

  updateFocus: function() {
    // Remove focus from all keys
    var keys = this.container.getElementsByClassName('key');
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k.className.indexOf('focused') !== -1) {
        k.className = k.className.replace(' focused', '');
      }
    }
    
    // Add focus to the active key
    var activeKey = document.getElementById('key-' + this.currentRow + '-' + this.currentCol);
    if (activeKey) {
      activeKey.className += ' focused';
    }
  },

  move: function(dir) {
    var maxRow = this.layout.length - 1;
    
    if (dir === 'UP') {
      if (this.currentRow > 0) {
        this.currentRow--;
        // Clamp column if the row above has fewer keys
        var maxCol = this.layout[this.currentRow].length - 1;
        if (this.currentCol > maxCol) {
          this.currentCol = maxCol;
        }
      }
    } 
    else if (dir === 'DOWN') {
      if (this.currentRow < maxRow) {
        this.currentRow++;
        // Clamp column if the row below has fewer keys (e.g. last action row)
        var maxCol = this.layout[this.currentRow].length - 1;
        if (this.currentCol > maxCol) {
          this.currentCol = maxCol;
        }
      }
    } 
    else if (dir === 'LEFT') {
      if (this.currentCol > 0) {
        this.currentCol--;
      } else {
        // Wrap around to the last column of the same row
        this.currentCol = this.layout[this.currentRow].length - 1;
      }
    } 
    else if (dir === 'RIGHT') {
      var maxCol = this.layout[this.currentRow].length - 1;
      if (this.currentCol < maxCol) {
        this.currentCol++;
      } else {
        // Wrap around to the first column
        this.currentCol = 0;
      }
    }
    
    this.updateFocus();
  },

  pressActiveKey: function() {
    var keyVal = this.layout[this.currentRow][this.currentCol];
    var action = '';
    
    if (keyVal === 'SPACE') {
      action = ' ';
    } else if (keyVal === 'DELETE') {
      action = 'BACKSPACE';
    } else if (keyVal === 'CLEAR') {
      action = 'CLEAR';
    } else {
      action = keyVal; // Single character
    }
    
    if (this.onKeyPressCallback) {
      this.onKeyPressCallback(action);
    }
  }
};
