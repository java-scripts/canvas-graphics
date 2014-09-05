

function DragDrop(g){
		var container={
			canvas:null,
			items:[],			
			add:function(item){
				if(typeof item.resize == 'undefined')item.resize=true;
				if(typeof item.drag == 'undefined')item.drag=true;
				this.items.push(item);return this;
			}	
		
		}
		var eventRegister={itemFound:false, item:null, direction:null,nextEventToFire:undefined,prevPos:{},nextPos:{}};
		
		function init(){
				
			this.canvas = g.canvas;
			implCustomMouseEvents(this.canvas);
			var that = this;
			
			
			
			$(this.canvas).on('c_mousedown',function(t,p){
				eventRegister.prevPos=eventRegister.nextPos;
				if(eventRegister.itemFound){
					$(that.canvas).trigger('cg_mousedown',[eventRegister.item,p]);
				}
			}).on('c_mouseup',function(t,p){
				if(eventRegister.nextEventToFire){
					////console.log('triggered '+eventRegister.nextEventToFire+' on '+that.canvas)
					////console.log(eventRegister)
					$(that.canvas).trigger(eventRegister.nextEventToFire,[eventRegister.item,eventRegister.prevPos,eventRegister.nextPos]);
				}				
			}).on('c_mousedrag',function(t,p){	
					eventRegister.prevPos = eventRegister.nextPos;
					eventRegister.nextPos = p;
			
				if(eventRegister.direction!=null && eventRegister.direction!='' && eventRegister.item.resize){
					//resize item
					var item=eventRegister.item;
					var direction = eventRegister.direction;
					eventRegister.nextEventToFire = 'cg_resizeComplete';
					if(direction == 'e'|| direction=='w'){
						setDim(item,Math.abs(2*(p.x-item.x)),undefined);						
					}else if(direction == 'n'|| direction=='s'){
						setDim(item,undefined,Math.abs(2*(p.y-item.y)));						
					}else{
						setDim(item,Math.abs(2*(p.x-item.x)),Math.abs(2*(p.y-item.y)));						
					}
					
					g.refresh();
				}else if(eventRegister.itemFound && eventRegister.item.drag){
					//move item
					eventRegister.nextEventToFire = 'cg_dragComplete'
					eventRegister.item.position(p);
					g.refresh();
				}else{
					eventRegister.nextEventToFire = undefined;
				}								
			}).on('c_mousemove',function(t,p){			
				eventRegister = geteventRegisterOnItem(p);				
				if(eventRegister.direction!=null && eventRegister.direction!='' && eventRegister.item.resize){					
					$(that.canvas).css({cursor:eventRegister.direction+'-resize'});
				}else if(eventRegister.itemFound && eventRegister.item.drag){
					$(that.canvas).css({cursor:'move'});
				}else{
					$(that.canvas).css({cursor:'default'})
				}				
			});
			
		
		}
		
		function setDim(item, w,h ){
			item.w = w||item.w;
			item.h = h||item.h;
			item.r = w||h||item.r;
		}
		
		function distance(p1, p2) {
			return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
		} 
		
		function isInsideItem(p){
			for(var key in container.items){
				var item = container.items[key];				
				if(isInside(item,p)){
					return true;
				}
			}
			return false;
		}
		
		function isInside(box,p){			
			if(box.x-box.w/2 <= p.x && p.x <= box.x+box.w/2){
				if(box.y-box.h/2 <= p.y && p.y <= box.y+box.h/2){
					return true;
				}
			}
			return false;		
		}		
		
		function geteventRegisterOnItem(p){			
		
			var k=0.1;//edge thickness;
			for(var key in container.items){
				var item = container.items[key];
				if(isInside(item,p)){
					eventRegister.itemFound = true;
					eventRegister.item = item;
					
					var n=Math.abs(item.y+item.h/2-p.y)<=k?'n':'';
					var s=Math.abs(item.y-item.h/2-p.y)<=k?'s':'';
					var e=Math.abs(item.x+item.w/2-p.x)<=k?'e':'';				
					var w=Math.abs(item.x-item.w/2-p.x)<=k?'w':'';
					eventRegister.direction = n+s+e+w;
					return eventRegister;					
				}								
			}
			return eventRegister;
		}
		
		
		
		
		/*Simulates mouse drag and triggers other mouse events.
		  arg1:parent,arg2:location of the event in normal units*/
		function implCustomMouseEvents(target){			
			var mousedown=false;				
			$(target).on('mousedown',function(e){				
				$(this).trigger('c_mousedown',[getOffset(e)]);	
				mousedown=true;
			}).on('mouseup',function(e){
				mousedown=false;
				$(this).trigger('c_mouseup',[getOffset(e)]);	
			}).on('mousemove',function(e){
				if(mousedown){										
					$(this).trigger('c_mousedrag',[getOffset(e)]);		
				}else{
					$(this).trigger('c_mousemove',[getOffset(e)]);
				}
				
			});			
			function getOffset(e){
				return getNormalUnits({x:e.offsetX,y:e.offsetY});
			}
		}
		
		
		function getNormalUnits(p){
			p.x = p.x/g.unit-g.x;
			p.y = (g.height-p.y)/g.unit-g.y;
			return p;
		}
		
		
	
		init.call(container,null);
		return container;

}








