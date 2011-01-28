(function($) {
  
function Gridlight() {
  this.pos = [0, 0];
  this.el = {
    shapes: $('#shapes')
  };
  
  this.shapes = [
    new Shape({
      id: 'connr',
      pos: [2, 8  ],
      colors: [
        'transparent',
        '#e2fe84',
        '#cbe86b',
        '#a9c158',
      ],
      pieces: [
        { spectrum: [0, 0] },
        { spectrum: [1, 3] }
      ],
      map: [
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1 ],
        [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0 ],
        [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0 ],
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0 ]
      ]
    }),
    new Shape({
      id: 'facebook',
      pos: [2, 14],
      colors: [
        '#5670a7', '#4d68a3', '#395998', '#294d8a',
        '#3e6fb3',
        '#ffffff', '#eeeeee'
      ],
      pieces: [
        { spectrum: [0, 3] },
        { spectrum: [4, 4] },
        { spectrum: [5, 6] }
      ],
      map: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 2, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 2, 2, 2, 0],
        [1, 1, 1, 2, 1, 1],
        [1, 1, 1, 2, 1, 1]
      ]
    }),
    new Shape({
      id: 'linkedin',
      pos: [9, 14],
      colors: [
        '#57ade0', '#53a5db', '#469ad3', '#3e90ce', '#2e84c6', '#1b7bc0',
        '#ffffff', '#eeeeee'
      ],
      pieces: [
        { spectrum: [0, 5] },
        { spectrum: [6, 7] }
      ],
      map: [
        [0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 1, 0],
        [0, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0]
      ]
    })
  ];
  
  this.render();
  
  $(document).mousemove($.proxy(this.mouseMoved, this));
}

 Gridlight.prototype = {
  
  render: function() {
    var self = this;
    
    $.each(self.shapes, function(k, shape){
      self.el.shapes.append(shape.element);
    });
    
  },
  
  mouseMoved: function(e) {
    var self = this,
        pos = [e.pageX, e.pageY],
        gpos =  Gridlight.toGrid(pos);
        
    if (self.pos[0] == gpos[0] && self.pos[1] == gpos[1]) { 
      return;
    } else {
      self.pos = gpos;
    }
    
    var rad = 300;
    
    $.each(self.shapes, function(i, shape){
      $.each(shape.map, function(j, row){
        $.each(row, function(k, box){
          var bpos = box.element.offset(),
              dx = Math.abs(pos[0] - bpos.left),
              dy = Math.abs(pos[1] - bpos.top);
              
          var len = Math.sqrt(dx*dx + dy*dy),
              p = (len+1) / rad;
              
          var ci = Math.ceil(p * (box.piece.spectrum[1] - box.piece.spectrum[0]));
          
          if (ci < box.piece.spectrum[0]) ci = box.piece.spectrum[0];
          if (ci > box.piece.spectrum[1]) ci = box.piece.spectrum[1];
          
          
          
          
          var color = shape.colors[ci];
          
          // console.log(shape.id, len, p, ci, color);
              
          box.element.css('background', color);
              
          // console.log(color);
            
        });
      });
    });
  }
  
  
  
};

function Shape(config) {
  this.id = config.id;
  this.pos = config.pos || [0, 0];
  this.colors = config.colors;
  this.pieces = config.pieces;
  this.map = config.map;
  
  var p =  Gridlight.fromGrid(this.pos);
  this.element = $('<div class="shape">').attr('id', config.id).css({
    'left': p[0],
    'top': p[1]
  });
  this.makeElements();
  // console.log(this.map);
}

Shape.prototype = {
  makeElements: function() {
    var self = this;
    var row, box, color, pos;
    
    $.each(self.map, function(y, r){
      row = $('<div class="row">');
      $.each(r, function(x, v){
        piece = self.pieces[v],
        color = self.colors[piece.spectrum[1]],
        pos =  Gridlight.fromGrid([x, y]);
        
        box = $('<div class="box">').css({
          'background-color': color,
          'left': pos[0],
          'top': pos[1]
        });
        
        self.map[y][x] = {
          element: box,
          piece: piece
        };
        
        row.append(box);
      });
      self.element.append(row);
    });
  }
  
};

 Gridlight.SIZE = 16;
 Gridlight.toGrid = function(p) {
  return [ Math.round(p[0] /  Gridlight.SIZE),
           Math.round(p[1] /  Gridlight.SIZE) ];
}
 Gridlight.fromGrid = function(p) {
  return [ (p[0] *  Gridlight.SIZE) + p[0],
           (p[1] *  Gridlight.SIZE) + p[1]];
}
 Gridlight.offset = function(v1, v2) {
  return [ Math.abs(v1[0]-v2[0]), 
           Math.abs(v1[1]-v2[1]) ];
}

new  Gridlight();
})(jQuery);