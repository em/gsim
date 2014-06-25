// var Point = require('./math/point');

window.Simulator = Simulator;

function Simulator(scene) {
  this.scene = scene;
  this.dist = 0;
  this.all = [];
  this.cur = {g:1,x:0,y:0,z:0};

  this.all = [this.cur];
  // this.addPoint({});
}

Simulator.prototype = {
  add: function(gcode) {
    gcode = gcode.toLowerCase();
    var parts = gcode.match(/([a-z][\d\.]+)/g);

    if(!parts) return;

    var params = {};
    parts.forEach(function(part) {
      var kv = part.match(/([a-z])([\d\.]+)/)
      var k = kv[1];
      var v = Number(kv[2]);
      params[k] = v;
    });

    var g = params.g !== undefined ? params.g : this.cur.g;

    // Delegate to handler fn
    if(this['g'+g]) {
      this['g'+g](params);
    }

    if(params.m == 30) {
      scene.add(this.line);
    }
  }

, g0: function(p) {
    this.setPathMode('rapid');
    this.addPoint(p);
  }

, g1: function(p) {
    this.setPathMode('linear');
    this.addPoint(p);
  }
, g2: function(p) {
    this.setPathMode('linear');
    this.arc(p, false);
  }
, g3: function(p) {
    this.setPathMode('linear');
    this.arc(p, true);
  }

, arc: function(p, ccw) {
    var divisions = 20;
    var x0 = this.cur.x || 0;
    var y0 = this.cur.y || 0;
    var z0 = this.cur.z || 0;
    var x1 = p.x;
    var y1 = p.y;
    var z1 = p.z;
    var cx = x0 + p.i;
    var cy = y0 + p.j;
    var rx = p.i;
    var ry = p.j;

    var astart = Math.atan2(y0 - cy, x0 - cx);
    var aend = Math.atan2(y1 - cy, x1 - cx);
    var radius = Math.sqrt(rx*rx+ry*ry);

    // Always assume a full circle
    // if they are the same 
    // Handling of 0,0 optimized in the usage
    if(aend === astart) {
      aend += Math.PI*2;
    }

    // aend = aend % Math.PI*2;
    // astart = astart % Math.PI*2;


    var deltaAngle = aend - astart;

    for ( j = 0; j <= divisions; j ++ ) {
      t = j / divisions;

      if(deltaAngle === -Math.PI*2) {
        deltaAngle = Math.PI*2;
      }

      if(deltaAngle < 0) {
        deltaAngle += Math.PI*2;
      }

      if(deltaAngle > Math.PI*2) {
        deltaAngle -= Math.PI*2;
      }

      if ( ccw ) {
        // sin(pi) and sin(0) are the same
        // So we have to special case for full circles
        if(deltaAngle === Math.PI*2) {
          deltaAngle = 0;
        }

        angle = aend + ( 1 - t ) * ( Math.PI * 2 - deltaAngle );
      } else {
        angle = astart + t * deltaAngle;
      }

      var tx = cx + radius * Math.cos( angle );
      var ty = cy + radius * Math.sin( angle );
      var tz = z0+(z1-z0)*t;

      this.addPoint( {x: tx, y:ty, z:tz } );
    }
  }

, setPathMode: function(mode) {
    if(mode === this.mode) return;

    if(this.toolpath) {

     scene.add(this.line);
    }

    var geometry = new THREE.Geometry();

    var cur = this.cur;

    geometry.vertices.push(
      new THREE.Vector3(cur.x,cur.y,cur.z)
    );

    var material = new THREE.LineBasicMaterial({
      color: mode=='rapid' ? 0x0000cc : 0x333333
    });

    // material.opacity = 0.75;
    // material.linewidth = 1;

    var line = new THREE.Line(geometry, material);
    this.line = line;
    this.toolpath = geometry;
    this.mode = mode;

    // line.castShadow = true;

  }

, addPoint: function(p) {
    var cur = this.cur;
    var x = p.x === undefined ? cur.x : p.x;
    var y = p.y === undefined ? cur.y : p.y;
    var z = p.z === undefined ? cur.z : p.z;

    var xo = x-cur.x;
    var yo = y-cur.y;
    var len = Math.sqrt(xo*xo + yo*yo);
    this.dist += len;

    var v = new THREE.Vector3(x,y,z);
    this.toolpath.vertices.push(v.clone());

    v.dist = this.dist; 
    this.all.push(v);

    for(var k in p) {
      this.cur[k] = p[k];
    }

  }
}

