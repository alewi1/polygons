var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var assetsLeft = 0;
var onImageLoaded = function(){
	assetsLeft--;
};

var images = {};
function addAsset(name,src){
	assetsLeft++;
	images[name] = new Image();
	images[name].onload = onImageLoaded;
	images[name].src = src;
}
addAsset("mehTriangle","meh_triangle.png");
addAsset("mehSquare","meh_square.png");
addAsset("mehCircle", "../img/meh_circle.png");
addAsset("mehPentagon", "../img/meh_pentagon.png")


function Swinger(){
	
	var self = this;
	
	self.swing = 0;
	self.baseRotation = 0;

	self.update = function(){

		var dx = Mouse.x - self.x;
		var dy = Mouse.y - (self.y+250+window.SCROLL*0.5);
		var dist = Math.sqrt(dx*dx+dy*dy);

		self.swing += 0.05;
		if(dist<300){
			var t = (300-dist)/300;
			self.swing += 0.3 * t;
		}

	};
	self.draw = function(ctx){

		ctx.save();
		
		ctx.translate(self.x,self.y);
		
		ctx.translate(0,20);
		ctx.rotate(self.baseRotation + Math.sin(self.swing)*Math.PI*0.05);
		ctx.translate(0,-20);

		var img;
		if(self.x>640 && self.y > 205){
			img = images.mehSquare;
		}
		else if (self.x < 640){
			img = images.mehTriangle;
		}
		else if (self.y > 205){
			img = images.mehPentagon;
		}
		else {
			img = images.mehCircle;
		}

		ctx.drawImage(img,-30,-30,60,60);
		ctx.restore();

	};

}

var swingers = [];
for(var i=0;i<1280;i+=50){

	var tt = (i-640)/640;
	var num;
	if(i>640){
		num = Math.ceil(tt*tt*4);
	}else{
		num = Math.ceil(tt*tt*7);
	}

	for(var j=0;j<num+1;j++){

		var x = i + Math.random()*20-10;
		var y = 220 - 170*Math.pow(t,2);

		if(i>640){
			y += j*50 + Math.random()*20-10;
		}else{
			y += j*30 + Math.random()*20-10;
		}

		if(x>500&&x<1280-500) continue;

		var t = (x-640)/640;

		var s = new Swinger();
		s.x = x;
		s.swing = x*0.1;
		s.y = y;
		s.baseRotation = (Math.random()*0.2-0.1);

		if(!isNaN(s.y)){
			swingers.push(s);
		}

	}

}

var s = new Swinger();
s.x = 640-30;
s.swing = s.x*0.1;
s.y = 210;
swingers.push(s);

var s = new Swinger();
s.x = 640+30;
s.swing = x*0.1;
s.y = 210;
swingers.push(s);

var s = new Swinger();
s.x = 640;
s.swing = x*0.1;
s.y = 210-50;
swingers.push(s);

swingers = swingers.sort(function(a,b){
	return a.y-b.y;
});


window.SCROLL = 0;
function render(){
	
	if(assetsLeft>0 || window.SCROLL>550) return;

	// Update
	for(var i=0;i<swingers.length;i++){
		swingers[i].update();
	}

	// Draw
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.save();
	ctx.translate(0,window.SCROLL*0.5);
	for(var i=0;i<swingers.length;i++){
		swingers[i].draw(ctx);
	}
	ctx.restore();

}

////////////////////
// ANIMATION LOOP //
////////////////////
window.requestAnimFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback){ window.setTimeout(callback, 1000/60); };
(function animloop(){
	requestAnimFrame(animloop);
	render();
})();
