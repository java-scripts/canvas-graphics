<script src="../js/jquery.min.js"></script>
<script src="../js/canvas-graphics.js"></script>
<script src="DragDrop.js"></script>


<canvas  id="canvas" width="600" height="400"></canvas>


<script>


/*Init graphis*/
g = GUtil.createGraphis({target: '#canvas',showGrid:true,x:1,y:1});

var r = g.create('Rectangle',{x:6,y:4,w:2,h:2,resize:false,vx:0,vy:0});
var c = g.create('Circle',{x:2,y:2,resize:false,vx:0,vy:0});
var s = g.create('Sphere',{r:0.5,x:3,vx:0,vy:0});




g.clear();
dd = new DragDrop(g);

dd.add(r).add(c).add(s);
g.draw();
	

$(g.canvas).on('cg_dragComplete',function(e,item,p1,p2){
	//console.log()
	var m=20;
	item.vx=m*(p2.x-p1.x);item.vy=m*(p2.y-p1.y);
}).on('cg_resizeComplete',function(e,item){
	//console.log(item.dType+"  is resized")
}).on('cg_mousedown',function(e,item,p){
	item.vx=0;
	item.vy=0;
})


g.loop(function(){
	g.clear();
	c.move();r.move();s.move();
	g.draw()
})


</script>
