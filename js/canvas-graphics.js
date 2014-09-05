// Code goes here


(function() {
  var keyUtil = {
    keyCodes:{0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57,A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z:90,enter:13, up:38, down:40, right:39, left:37, esc:27, spacebar:32, ctrl:17, alt:18, shift:16,tab:9,backspace:8},
    keyNames:{8: "backspace", 9: "tab", 13: "enter", 16: "shift", 17: "ctrl", 18: "alt", 27: "esc", 32: "spacebar", 37: "left", 38: "up", 39: "right", 40: "down", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L", 77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z"},
    onKeyEvent: function(eventName, impl) {
    var that = this;
      $(document).bind(eventName, function(e) {
        var keyName = that.keyNames[e.keyCode];
        if (impl[keyName]) {
          impl[keyName](e);
        }
      });
    }
  };
  
  var mathUtil = {
  distance: function(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
  },
  getRand: function(a, b) {
    return Math.round(a + (b - a) * Math.random());
  },
  getRandf: function(a, b) {
    return a + (b - a) * Math.random();
  },
  getRad: function(deg) {
    return deg * Math.PI / 180;
  },
  getlineMap: function(x, a, b, c, d) {
    //y in c d for x in a b   
    //y-c/(d-c) = x-a/(b-a) 
    return (x - a) * (d - c) / (b - a) + c;
  }
};

  var colorUtil = {
  getRandColor: function() {
    return this.getColorFromArray([mathUtil.getRand(0, 255), mathUtil.getRand(0, 255), mathUtil.getRand(0, 255)]);
  },
  getColorFromArray: function(a) {
    return 'rgb(' + a[0] + ',' + a[1] + ',' + a[2] + ')';
  },
  hsvToRgb: function(h, s, v) {
    /*hsv in the set [0 1] and rgb in the set[0,255]
     */
    var r, g, b;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v, g = t, b = p;
        break;
      case 1:
        r = q, g = v, b = p;
        break;
      case 2:
        r = p, g = v, b = t;
        break;
      case 3:
        r = p, g = q, b = v;
        break;
      case 4:
        r = t, g = p, b = v;
        break;
      case 5:
        r = v, g = p, b = q;
        break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },
  rgbToHsv: function(r, g, b) {
    /*rgb in the set[0,255] and hsv in the set [0 1]  
     */
    r = r / 255, g = g / 255, b = b / 255;
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, v];
  },
  settings:{
	color:{
		gamma:1,hue:1,saturation:1,intensity:1,modal:'wave'
	}
  },
  setColorSettings:function(settings){
	$.extend(this.settings.color,settings);
  },
  getColor:function(E){
	 //color gamma adjustment
	 var settings=this.settings.color;
    E *= settings.gamma;	
	//colormodel	
	var rgb = this.colorModel[settings.modal].call(this,E);
	
	 //color adjustments
   // var hsv = this.rgbToHsv(rgb[0],rgb[1],rgb[2]);
    //hue adjustment
   // hsv[0] = (hsv[0] + settings.hue) % 1;
   // hsv[1] = (hsv[1] + settings.saturation) % 1;
   // hsv[2] = hsv[2] * settings.intensity;

   // var rgb = this.hsvToRgb(hsv[0],hsv[1],hsv[2]);	
	return this.getColorFromArray(rgb);
  },
  colorModel:{		
	 wave: function(k) {
		if (k > 1) k = 1;else if (k < -1) k = -1;k=Math.abs((k + 1) / 2); 
		var rr = this.hsvToRgb(k, 1, 1);
		var gg = this.hsvToRgb(1, k, 1);
		var bb = this.hsvToRgb(1, 1, k);
		return [rr[0], gg[1], bb[2]];
	  },
	  sand: function(k) {
		if (k > 1) k = 1;else if (k < -1) k = -1;k=Math.abs((k + 1) / 2);		
		return this.hsvToRgb(k+0.6, 0.1, k+0.2);
	  },
	  plane: function(E) {			
		if (E > 1) E = 1;else if (E < -1) E = -1;
		if (E > 0) {
		  return [Math.round(E * 255), 0, 0];
		} else {
		  return [0, 0, Math.round(E * -255)];
		}

	  },
	  binary: function(E) {
		if (E > 0) {
		  return [255, 0, 0];
		} else {
		  return [0, 0, 255];
		}
	  }
  },
 
  
  
};

  GUtil = {
    createGraphis: function(options) {

      var init = function(options) {
        //overriding this properties with with optionsproperties
        this.x = 0;
        this.y = 0;
        this.unit = 50;
        $.extend(this, options);
        this.canvas = $(this.target)[0];
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx.width = this.canvas.width;
        this.ctx.height = this.canvas.height;
      };

      var graphics = {
        canvas: null,
        color: 'white',
        gridColor: 'rgba(125,125,125,0.1)',
        ctx: null,
        width: 0,
        height: 0,
        counter: 0,
        unit: 50, //1 unit = 50 px;
        x: 0,
        y: 0,
        showGrid: false,
		items:[],
        clear: function() {
          return drawingUtil.clear.call(this, null),this;
        },
        center: function(c) {
          if (c) {
            this.x = c.x;
            this.y = c.y;
          } else {
            return {
              x: this.x,
              y: this.y
            };
          }
        },
        create: function(objectName, settings) {
          return ObjectDispatcher.create(objectName, settings);
        },
		destroy:function(xItem){			
			var index = this.items.indexOf(xItem);
			if(index >= 0){
				this.items.splice(index,1);
			}
			return this;
		},
		refresh:function(){
			return this.clear().draw();
		},
        draw: function(boxObject, settings) {			
			if(boxObject){
				return this.drawItem(boxObject, settings);
			}else{
				for(var key in this.items){
					this.drawItem(this.items[key]);					
				}
				return this;
			}
			
        },
		drawItem:function(boxObject,settings){
			 return ObjectDispatcher.draw.call(this, boxObject, settings), this;
		},
        drawArray: function(boxObjects, settings) {
          var that = this;
          $.each(boxObjects, function(i, boxObject) {
            that.draw(boxObject, settings);
          });
          return this;
        },
        loop: function(renderCallback, time) {
          return loopUtil.loop(this, renderCallback, time);
        },
        stopLoop: function(loopId) {
          loopUtil.stopLoop(loopId);
        },
        startLoop: function(loopId) {
          loopUtil.startLoop(loopId);
        },
        toggleLoop: function(loopId) {
          loopUtil.toggleLoop(loopId);
        },
        toggleLoops: function() {
          loopUtil.toggleLoops();
        },
        clearLoops: function() {
          loopUtil.clearLoops();
        }
      }; //graphics

      var requestId = 0;
      var loopUtil = {
        loopCount: 0,
        loopRegister: {},
        pushRequest: function(loopId, requestId) {
          this.loopRegister[loopId].requestId = requestId;
        },
        pushLoopDetails: function(context, renderCallback, time, requestId) {
          var loopId = this.loopCount++;
          this.loopRegister[loopId] = {
            context: context,
            requestId: requestId,
            renderCallback: renderCallback,
            time: time,
            started: false,
          };
          return loopId;
        },
        loop: function(context, renderCallback, time) {
          var loopId = this.pushLoopDetails(context, renderCallback, time);
          this.startLoop(loopId);
          return loopId;
        },
        stopLoop: function(loopId) {
          var loop = this.loopRegister[loopId];
          loop.started = false;
          if (loop.time) {
            clearTimeout(loop.requestId);
          } else {
            cancelAnimationFrame(loop.requestId);
          }
        },
        startLoop: function(loopId) {
          this.stopLoop(loopId);
          var loop = this.loopRegister[loopId];
          loop.started = true;
          if (loop.time) {
            this.timeOutLoop.call(loop.context, loop.renderCallback, loop.time, loopId);
          } else {
            this.animLoop.call(loop.context, loop.renderCallback, loopId);
          }

        },
        toggleLoop: function(loopId) {
          var loop = this.loopRegister[loopId];
          if (loop.started) {
            this.stopLoop(loopId);
          } else {
            this.startLoop(loopId);
          }
        },
        toggleLoops: function() {
          for (var loopId in this.loopRegister) {
            this.toggleLoop(loopId);
          }
        },
        clearLoops: function() {
          for (var loopId in this.loopRegister) {
            this.stopLoop(loopId);
          }
        },
        animLoop: function(renderCallback, loopId) {
          requestId = requestAnimFrame(loopUtil.animLoop.bind(this, renderCallback, loopId));
          loopUtil.pushRequest(loopId, requestId);
          renderCallback(this.counter++);
        },
        timeOutLoop: function(renderCallback, time, loopId) {
		  var that = this;
          requestId = window.setTimeout(function() {
            loopUtil.timeOutLoop.call(that, renderCallback, time, loopId);
          }, time);
          loopUtil.pushRequest(loopId, requestId);		  
          renderCallback(this.counter++);
        }

      }; //loopUtil
      //objectUtil.js contents should be loaded here  


      var drawingUtil = {
        clear: function() {
          this.ctx.fillStyle = this.color;
          this.ctx.fillRect(0, 0, this.width, this.height);
          this.ctx.fill();
          if (this.showGrid) drawingUtil.drawGrid.call(this);
        },
        drawGrid: function() {
          this.ctx.strokeStyle = this.gridColor;
          this.ctx.lineWidth = 1;
          for (var y = this.y - this.height; y < this.y + this.height; y += this.unit) {
            this.ctx.strokeRect(this.x - this.width, y, 2 * this.width, this.unit);
          }
          for (var x = this.x - this.width; x < this.x + this.width; x += this.unit) {
            this.ctx.strokeRect(x, this.y - this.height, this.unit, 2 * this.height);
          }
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(this.x - this.width, this.height - this.y * this.unit, 2 * this.width, 2);
          this.ctx.strokeRect(this.x * this.unit, this.y - this.height, 2, 2 * this.height);
        },
        drawBox2d: function(b, options) {
          //--------------------------------------------------------------------------------------------------------------------
          //console.log(arguments)
        },
        drawRectangle: function(o) {
          //--------------------------------------------------------------------------------------------------------------------
          //if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
          if (!o.hideStroke) this.ctx.strokeRect(0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2, o.w * this.unit, o.h * this.unit);
          if (o.showFill) this.ctx.fillRect(0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2, o.w * this.unit, o.h * this.unit);
          return this;
        },
		drawMatrix:function(o){			
			GUtil.Color.setColorSettings(o.color);			
			var sx = o.w/o.m;
			var sy = o.h/o.n;			
			this.ctx.strokeRect(0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2, o.w * this.unit, o.h * this.unit);
			if(o.color.fillType=='text'){
				for(var i=0;i<o.m;i++){
					for(j=0;j<o.n;j++){					
						this.ctx.fillStyle=GUtil.Color.getColor(o.data[i][j]);					
						this.ctx.fillText(parseFloat(o.data[i][j]).toFixed(2), (i+0.25)*sx*this.unit - o.w * this.unit / 2, (j+0.75)*sy*this.unit - o.h * this.unit / 2);
					}
				}
			}else{
				for(var i=0;i<o.m;i++){
					for(j=0;j<o.n;j++){					
						this.ctx.fillStyle=GUtil.Color.getColor(o.data[i][j]);
						this.ctx.fillRect(i*sx*this.unit - o.w * this.unit / 2, j*sy*this.unit - o.h * this.unit / 2, sx * this.unit, sy * this.unit);					
					}
				}	
			}
			
			
		},
        drawCircle: function(o) {
          //--------------------------------------------------------------------------------------------------------------------
          this.ctx.beginPath();
          this.ctx.arc(0, 0, o.r * this.unit, 0, Math.PI * 2, true);
          if (!o.hideStroke) this.ctx.stroke();
          if (o.showFill) this.ctx.fill();
          this.ctx.closePath();
          return this;
        },
        drawLine: function(o) {
          //--------------------------------------------------------------------------------------------------------------------
          this.ctx.beginPath();
          this.ctx.moveTo(0, 0);
          this.ctx.lineTo((o.x2 - o.x) * this.unit, (-o.y2 + o.y) * this.unit);
          this.ctx.closePath();
          this.ctx.stroke();
          return this;
        },
        drawSphere: function(o) {
          //--------------------------------------------------------------------------------------------------------------------
          //if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
          var r2 = o.r / 10; //inner radius		
          var x2 = (o.r - r2) / 2;
          var radgrad = this.ctx.createRadialGradient(x2 * this.unit, 0, r2 * this.unit, 0, 0, o.r * this.unit);
          radgrad.addColorStop(0, '#FFF');
          radgrad.addColorStop(0.3, o.color);
          radgrad.addColorStop(0.95, '#111');
          radgrad.addColorStop(1, 'rgba(0,0,0,0)');
          this.ctx.fillStyle = radgrad;
          this.ctx.fillRect(-o.r * this.unit, -o.r * this.unit, 2 * o.r * this.unit, 2 * o.r * this.unit);
          this.ctx.fill();
          return this;
        },
        drawText: function(o) {
          //--------------------------------------------------------------------------------------------------------------------
          //if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
          //strokeText('Hello world!', 40, 50); 
          if (!o.hideStroke) this.ctx.strokeText(o.text, 0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2);
          if (o.showFill) this.ctx.fillText(o.text, 0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2);
          return this;
        },
        drawImg: function(o) {
          //--------------------------------------------------------------------------------------------------------------------
          this.ctx.transform(o.m11, o.m12, o.m21, o.m22, o.dx, o.dy);
          //if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
          if (o.isReady) this.ctx.drawImage(o.img, 0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2, o.w * this.unit, o.h * this.unit);
          return this;
        },
        drawPath: function(o) {
          //--------------------------------------------------------------------------------------------------------------------
         // if (o.angle) this.ctx.rotate(o.angle * Math.PI / 180);
          var that = this;
          this.ctx.beginPath();
          $.each(o.points, function(i, p) {
            if (i === 0) {
              that.ctx.moveTo(p.x * that.unit, -p.y * that.unit);
            }
            that.ctx.lineTo(p.x * that.unit, -p.y * that.unit);
          });
          if (o.close) {
            this.ctx.closePath();
            this.ctx.stroke();
            if (o.showFill) this.ctx.fill();
          } else {
            this.ctx.stroke();
            this.ctx.closePath();
          }
		  if(o.showFrame){
			this.ctx.fillStyle='rgba(150,150,150,0.1)';
			this.ctx.fillRect(0 - o.w * this.unit / 2, 0 - o.h * this.unit / 2, o.w * this.unit, o.h * this.unit);
		  }
          return this;
        },
        drawTracer: function(o) {
          //--------------------------------------------------------------------------------------------------------------------
          //  this.ctx.translate(-o.x*this.unit, -o.y*this.unit);
          this.ctx.translate(-(this.x + o.x) * this.unit, -this.height + (this.y + o.y) * this.unit);
          var that = this;
          if (o.body) {
            $.each(o.path.points, function(i, p) {
              that.draw(o.body, p);
            });
          } else {
            var settings = $.extend(o, {
              x: 0,
              y: 0,
              dType: 'Path'
            });
            this.draw(o.path, settings);
          }
          if (o.tail) {
            this.draw(o.tail, o.path.getTail());
          }
          if (o.head) {
            this.draw(o.head, o.path.getHead());
          }
          return this;
        },
        drawLayer: function(o) {
          //--------------------------------------------------------------------------------------------------------------------
          //nullifying the scalling and translattion in reverse order
          // this.ctx.rotate(-o.angle * Math.PI / 180);
          this.ctx.translate(-(this.x) * this.unit, -this.height + (this.y) * this.unit);
          var that = this;
          $.each(o.items, function(i, item) {
            that.draw(item);
          });
        }		
      };

      var objectUtil = {};
      (function() {
        var Box2d = function() {
          this.x = 0;
          this.y = 0;
          this.vx = 1.5;
          this.vy = 1;
          this.w = 1;
          this.h = 1;
          this.dt = 1 / 60;
          //drawing properties    
          this.showFill = false;
          this.hideStroke = false;
          this.lineWidth = 2;
          this.fillStyle = 'rgba(0,0,0,0.2)';
          this.strokeStyle = 'rgba(0,0,0,0.5)';
          //dropShadow
          this.dropShadow = false;
          this.shadowColor = "black";
          this.shadowOffsetX = 5;
          this.shadowOffsetY = 5;
          this.shadowBlur = 5;
          //scalling
          this.scaleX = 1;
          this.scaleY = 1;
          //transform
          this.m11 = 1;
          this.m12 = 0;
          this.m21 = 0;
          this.m22 = 1;
          this.dx = 0;
          this.dy = 0;

          this.position = function(p) {
            if (p) {
              this.x = p.x;
              this.y = p.y;
              return this;
            } else {
              return {
                x: this.x,
                y: this.y
              };
            }
          };
		
		  this.isInside = function(p){
			if(this.x-this.w/2 <= p.x && p.x <= this.x+this.w/2){
				if(this.y-this.h/2 <= p.y && p.y <= this.y+this.h/2){
					return true;
				}
			}
			return false;
		  };
		  
		  
		
          this.move = function() {
            this.x += this.vx * this.dt;
            this.y += this.vy * this.dt;
            if (this.x > 12 || this.x < 0) {
              this.vx = -this.vx;
            }
            if (this.y > 8 || this.y < 0) {
              this.vy = -this.vy;
            }
            return this;
          };

          this.rotate = function(angle){           
            this.angle = angle;
            return this;
          };
          
          this.removeShadow = function() {
            this.shadowOffsetX = 0;
            this.shadowOffsetY = 0;
            this.shadowBlur = 0;
            return this;
          };
        };

        //--------------------------------------------------------------------------------------------------------------------
        //Rectangle
        var Rectangle = function() {
          this.dType = 'Rectangle';
        };
        Rectangle.prototype = new Box2d();

        //--------------------------------------------------------------------------------------------------------------------
        //Circle
        var Circle = function() {
          this.dType = 'Circle';
          this.r = 1;
        };
        Circle.prototype = new Box2d();
        //--------------------------------------------------------------------------------------------------------------------
        //Line
        var Line = function() {
          this.dType = 'Line';
          this.type = 'defalut'; //polar          
          this.r = 1;
          this.theta = -45;
          this.x2 = 1;
          this.y2 = 1;

          this.position2 = function(p) {
            if (p) {
              this.x2 = p.x;
              this.y2 = p.y;
            } else {
              return {
                x: this.x2,
                y: this.y2
              };
            }
          };

          //update convers polar to cartisian
          this.update = function() {
            if (this.type == 'polar') {
              this.x2 = this.x + this.r * Math.cos(mathUtil.getRad(this.theta));
              this.y2 = this.y + this.r * Math.sin(mathUtil.getRad(this.theta));
            }
          };
        };
        Line.prototype = new Box2d();
        //--------------------------------------------------------------------------------------------------------------------
        //Sphere
        var Sphere = function() {
          this.dType = 'Sphere';
          this.r = 1;
          this.angle = 225;
          this.color = 'red';
        };
        Sphere.prototype = new Box2d();
        //--------------------------------------------------------------------------------------------------------------------
        var Text = function() {
          this.dType = 'Text';
          this.text = 'Hellow';
          this.font = 'Bold 30px Sans-Serif';
        };
        Text.prototype = new Box2d();
        //--------------------------------------------------------------------------------------------------------------------
        var Img = function() {
          this.dType = 'Img';
          this.img = new Image();
          this.src = null;
          this.isReady = false;
          var that = this;
          this.onReady = function() {
            //should be overriden
          };

          this.img.onload = function() {
            that.isReady = true;
            that.onReady();
          };


        };
        Img.prototype = new Box2d();
	//--------------------------------------------------------------------------------------------------------------------
		var Matrix = function(options){
			this.dType = 'Matrix';
			var settings = $.extend({m:10,n:10},options);						
			this.m=settings.m;
			this.n=settings.n;
			this.data=[];			
			this.reset=function(){
				for(var i=0;i<this.m;i++){
					this.data[i]=[];
					for(var j=0;j<this.n;j++){
						this.data[i][j]=0;
					}
				}
			}		
			this.color={};			
			this.reset();
		}
		 Matrix.prototype = new Box2d();		
		//--------------------------------------------------------------------------------------------------------------------
        var Path = function() {
          this.dType = 'Path';
          this.points = [];
          this.close = false;
		  this.showFrame=false;
          this.add = function(x, y) {
			if(2*x>this.w)this.w=2*x;
			if(2*y>this.h)this.h=2*y;
		  
            return this.points.push({
              x: x,
              y: y
            }), this;
          };
          this.getHead = function() {
            return this.points[this.points.length - 1];
          };

          this.getTail = function() {
            return this.points[0];
          };

          this.clear = function() {
            return this.points = [], this;
          };


        };

        Path.prototype = new Box2d();
		


        //--------------------------------------------------------------------------------------------------------------------
        var Tracer = function() {
          this.dType = 'Tracer';
          this.length = 20; //number of points
          this.path = new Path();
          //new node is accepted only if distance(newnode,oldnode)>distance
          this.nodeLength = 0.1; //distance between nodes
          this.head = null; //referense to xobject to be drawn at head. Optional
          this.body = null; //refernces to xobject to be drawn at each node
          this.foot = null; //reference to footer to be drawn at the end of tracce.


          this.update = function() {

            var np = {
              x: this.x,
              y: this.y
            }; //newpoint		
            if (isAccepted.call(this, np)) this.path.points.push(np);

            if (this.path.points.length > this.length) {
              this.path.points.shift();
            }
            return this;
          };

          function isAccepted(np) {
            if (this.path.points.length === 0) {
              return true;
            } else {
              var op = this.path.points[this.path.points.length - 1];
              return this.accept(op, np);
            }

          }

          //attached to object so that to override externally
          this.accept = function(p1, p2) {
            return mathUtil.distance(p1, p2) > this.nodeLength;
          };
        };
        Tracer.prototype = new Box2d();

        //--------------------------------------------------------------------------------------------------------------------
        //to container group of objects
        var Layer = function() {
          this.dType = 'Layer';
          this.items = [];
          this.x = 0;
          this.y = 0;
          this.w = 6;
          this.h = 4;
          this.add = function(xobject) {
            this.items.push(xobject);
            return this;
          };

        };
        Layer.prototype = new Box2d();
        //--------------------------------------------------------------------------------------------------------------------
        objectUtil = {
          Box2d: Box2d,
          Rectangle: Rectangle,
          Circle: Circle,
          Line: Line,
          Sphere: Sphere,
          Text: Text,
          Img: Img,
          Path: Path,
          Tracer: Tracer,
          Layer: Layer,
		  Matrix:Matrix

        };
      }()); //objectUtil




      var ObjectDispatcher = {
        Box2d: [objectUtil.Box2d, ''],
        Rectangle: [objectUtil.Rectangle, drawingUtil.drawRectangle],
        Circle: [objectUtil.Circle, drawingUtil.drawCircle],
        Line: [objectUtil.Line, drawingUtil.drawLine],
        Sphere: [objectUtil.Sphere, drawingUtil.drawSphere],
        Text: [objectUtil.Text, drawingUtil.drawText],
        Path: [objectUtil.Path, drawingUtil.drawPath],
        Tracer: [objectUtil.Tracer, drawingUtil.drawTracer],
        Layer: [objectUtil.Layer, drawingUtil.drawLayer],
        Img: [objectUtil.Img, drawingUtil.drawImg],
		Matrix:[objectUtil.Matrix, drawingUtil.drawMatrix],
        create: function(objectName, settings) {
          if (ObjectDispatcher[objectName]) {
            var object = new ObjectDispatcher[objectName][0](settings);
            if (object.dType == 'Img') {
              Object.defineProperty(object, "src", {
                set: function(src) {
                  this.img.src = src;
                }
              });
            }
			var newObject = $.extend(object, settings);
			graphics.items.push(newObject);
            return newObject;
          } else {
            throw new Error('No such object ' + objectName);
          }
        },
        draw: function(boxObject, settings) {
          if (boxObject.update) {
            boxObject.update();
          }
          if (!boxObject.dropShadow && boxObject.removeShadow) {
            boxObject.removeShadow();
          }
          var options = (typeof boxObject === "string") ? settings : $.extend($.extend({}, boxObject), settings);
          delete options.rotate;delete options.scale;delete options.translate;
          this.ctx.save();
          this.ctx = $.extend(this.ctx, options);
          this.ctx.translate((this.x + options.x) * this.unit, this.height - (this.y + options.y) * this.unit);
	        this.ctx.scale(options.scaleX, options.scaleY);
	        this.ctx.rotate(options.angle * Math.PI / 180);
          ObjectDispatcher[boxObject.dType || boxObject][1].call(this, options);
          this.ctx.restore();
        }

      };

      init.call(graphics, options);
      graphics.clear();
      return graphics;

    },
    KeyEvents:keyUtil,
    Math:mathUtil,
    Color:colorUtil
  };


}());


window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
  };
})();





