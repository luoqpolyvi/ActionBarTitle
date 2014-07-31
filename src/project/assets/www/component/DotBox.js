function DotBox(_){
	
	var _this = this;
	var _dotCount;
	var _index = 0;
	
	_this.setter('dotCount', function(count){
		if(_dotCount==count) return;
		_dotCount = count;
		clear();
		for(var i=0; i<count; i++)
			createDot(_index==i?1:0.5);
	});
	
	_this.setter('index', function(index){
		if(_index == index) return;
		_index = index;
		hightlightByIndex(index);
	});
	
	function createDot(opacity){
		$.Image('view/home/res/images/dot.png').css('opacity', opacity).appendTo(_this);
	}
	
	function clear(){
		_this.html('');
	}
	
	function hightlightByIndex(index){
		_.each(_this.childNodes, function(i, item){
			item.css('opacity', index==i?1:0.5);
		});
	}
}