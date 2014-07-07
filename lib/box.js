module.exports = Box;

function Box() {
  this.xmin = 0;
  this.xmax = 0;
  this.ymin = 0;
  this.ymax = 0;
  this.zmin = 0;
  this.zmax = 0;
}

Box.prototype.fitTo = function(p) {
  this.xmin = Math.min(p.x, this.xmin);
  this.ymin = Math.min(p.y, this.ymin);
  this.zmin = Math.min(p.z, this.zmin);
  this.xmax = Math.max(p.x, this.xmax);
  this.ymax = Math.max(p.y, this.ymax);
  this.zmax = Math.max(p.z, this.zmax);
}

Box.prototype.width = function() {
  return this.xmax - this.xmin;
}

Box.prototype.height = function() {
  return this.ymax - this.ymin;
}

Box.prototype.cx = function() {
  return this.xmin + this.width() / 2;
}

Box.prototype.cy = function() {
  return this.ymin + this.height() / 2;
}
