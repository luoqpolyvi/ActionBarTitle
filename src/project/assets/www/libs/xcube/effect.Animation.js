
function Animation(_){
	
	var _needStop = false;
	
	this.run = function(propertySetter, startValue, value, duration, easeFunction, onMotionEnd){
		if(typeof propertySetter != 'function' || isNaN(value) || isNaN(duration)) throw new Error('Animation: Argument Error.');
		var finalFunction = getEaseFunction(easeFunction) || MotionEffect.Linear;
		var t=0, v=value, d=duration, setter=propertySetter;
		var _this = this;
		_.drawFrames(draw, function(){return !_needStop&&(t<duration);}, onMotionEnd);
		
		function draw(){
			t++;
			var result;
			var _dir = startValue>value ? 1:-1;
			var _delta = Math.abs(startValue-value);
			var _v = Math.ceil(finalFunction(t,0,_delta,d));
			result = startValue-_dir*_v;
			setter(Number(result).toFixed(2));
		}
		
		return this;
	}
	
	this.stop = function(){
		_needStop = true;
		return this;
	}
	
	
	function getEaseFunction(id){
		try{
			return eval('MotionEffect.'+id);
		}catch(e){return null;}
	}
	
	var MotionEffect = arguments.callee;
	
	if(MotionEffect.Linear) return;
		
	MotionEffect.Linear = function(t,b,c,d){ return c*t/d + b; }
	
	MotionEffect.Quad = {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t + b;
		},
		easeOut: function(t,b,c,d){
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	}
	
	MotionEffect.Cubic = {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t*t + b;
		},
		easeOut: function(t,b,c,d){
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		}
	},
		
	MotionEffect.Quart = {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t*t*t + b;
		},
		easeOut: function(t,b,c,d){
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		}
	},
		
	MotionEffect.Quint = {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t*t*t*t + b;
		},
		easeOut: function(t,b,c,d){
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		}
	},
		
	MotionEffect.Sine = {
		easeIn: function(t,b,c,d){
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		},
		easeOut: function(t,b,c,d){
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},
		easeInOut: function(t,b,c,d){
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		}
	},
		
	MotionEffect.Expo = {
		easeIn: function(t,b,c,d){
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOut: function(t,b,c,d){
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		}
	},
		
	MotionEffect.Circ = {
		easeIn: function(t,b,c,d){
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		},
		easeOut: function(t,b,c,d){
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		}
	},
		
	MotionEffect.Elastic = {
		easeIn: function(t,b,c,d,a,p){
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		easeOut: function(t,b,c,d,a,p){
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
		},
		easeInOut: function(t,b,c,d,a,p){
			if (t==0) return b; 
			if ((t/=d/2)==2) return b+c;  
			if (!p) p=d*(.3*1.5);
			if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			
			var v1 = a*Math.pow(2,10*(t-=1));
			var v2 = Math.sin((t*d-s)*2*Math.PI/p);
			var v3 = a*Math.pow(2,-10*(t-=1));
			
			if (t < 1){
				return -.5*v1*v2 + b;
			}else{
				return v3*v2*.5 + c + b;
			}
		}
	},
		
	MotionEffect.Back = {
		easeIn: function(t,b,c,d,s){
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		easeOut: function(t,b,c,d,s){
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeInOut: function(t,b,c,d,s){
			if (s == undefined) s = 1.70158; 
			
			var v1 = t/=d/2;
			var v2 = s*=1.525;
			var v3 = (v2+1)*t - s;
			var v4 = (v2+1)*t + s;
			var v5 = t-=2;
			
			if (v1 < 1) return c/2*t*t*v3 + b;
			return c/2*(v5*t*v4 + 2) + b;
		}
	},
		
	MotionEffect.Bounce = {
		easeIn: function(t,b,c,d){
			return c - MotionEffect.Bounce.easeOut(d-t, 0, c, d) + b;
		},
		easeOut: function(t,b,c,d){
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeInOut: function(t,b,c,d){
			if (t < d/2) return MotionEffect.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
			else return MotionEffect.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	}
	
	
}