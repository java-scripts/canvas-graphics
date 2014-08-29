$(document).ready(function(){
	
	
	prettyPrint();
	
	
	canvas = $('#canvas');
	  g = GUtil.createGraphis({
    		target: '#canvas'	
  	         });
	
	
	
	
	
});


$('.custom-nav-tabs a').click(function (e) {
	e.preventDefault();
	$('.custom-nav-tabs li:first-child a').tab('show');	
	$(this).tab('show');
	
	if($(this).text()=='Result'){
		showResult($(this));
	}else{
		g.clearLoops();
		console.log('stopped.....')
	}
	
});


function showResult(x){
  codeDiv = $(x.parent().prev().children().attr('href'));
  resultDiv = $(x.attr('href'));	
	resultDiv.html(canvas);
	g.clearLoops();g.clear();g.x=0;g.y=0;g.color='white';
	eval(codeDiv.text().replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, ''));

}



