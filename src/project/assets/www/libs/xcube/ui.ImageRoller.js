
function ImageRoller(_){

	var _this = this.extend('ui.AbstractList').css({width:getInitializeWidth.call(this)+'px', overflow:'hidden', display:'block', position:'relative'});
	var _loop = getParam('loop', false);
	var _captureSign = getParam('captureSign', true);
	
	var _index = 0;
	var _box = _.Element('div').defineCssAnimation('left', 0.5, 'easeIn').css({position:'absolute'}).appendTo(_this);
	
	/////////////////////////////////////////////////////////
	//	init
	/////////////////////////////////////////////////////////
	
	if(_captureSign){
		_this.captureSign(true);
		_this.bind('slideend', function(evt){
			switch(evt.direction){
				case 'left':
					_this.next();
					break;
				case 'right':
					_this.previous();
					break;
			}
		});
	}
	
	_this.bind('DOMSubtreeModified', function(){
		syncScrollPosition();
	});
	
	/////////////////////////////////////////////////////////
	//	Public
	/////////////////////////////////////////////////////////
	
	_this.onIndexChange = getParam('onIndexChange', null);
	
	_this.next = function(){
		if(_this.isEmpty) return _this;
		if(_index<_this.length-1){
			_index++;
		}else if(_loop){
			_index=0;
		}else{
			return _this;	
		}
		showItemByIndex(_index);
		return _this;
	}
	
	_this.previous = function(){
		if(_this.isEmpty) return _this;
		if(_index>0){
			_index--;	
		}else if(_loop){
			_index=_this.length-1;
		}else{
			return _this;	
		}
		showItemByIndex(_index);
		return _this;
	}
	
	_this.showItem = function(index){
		if(_this.isEmpty) return _this;
		if(index==_index||index<0||index>_this.length-1) return _this;
		_index = index;
		showItemByIndex(index);
		return _this;
	}
	
	_this.getter('index', function(){return _index;});
	
	/////////////////////////////////////////////////////////
	//	Override
	/////////////////////////////////////////////////////////
	
	_this._createItem = function(element, json, preventDefault){
		var clientWidth = getInitializeWidth.call(_this);
		var clientHeight = getInitializeHeight.call(_this);
		_box.css({'width':(clientWidth*_this.length)+'px'});
		element.css({
			display:'inline-block',
			textAlign:'center',
			width:clientWidth+'px',
			height:clientHeight+'px'
		});
		element.json = json;
		if(_this.length==1) showItemByIndex(0, false);
		if(preventDefault) return;
		element.append(_.Image(json['image']))
	}
	
	_this._getContainer = function(){return _box;}
	
	_this.redefine('_clear', function(){_index=0;}, true);
	
	
	/////////////////////////////////////////////////////////
	//	Private
	/////////////////////////////////////////////////////////
	
	function getInitializeWidth(){
		if(this.css('width'))
			return parseInt(this.css('width'));
		if(this.parentNode&&this.parentNode.clientWidth>0)
			return this.parentNode.clientWidth;
		this.bind('DOMNodeInsertedIntoDocument', layout);
		return 0;
	}
	
	function getInitializeHeight(){
		var height = 0;
		var node = this;
		while(node){
			height = node.clientHeight;
			if(height) break;
			node = node.parentNode;
		}
		return height;
	}
	
	function layout(){
		_this.css({'width':_this.parentNode.clientWidth+'px'});
		_this.css({'height':_this.parentNode.clientHeight+'px'});
		_this.unbind('DOMNodeInsertedIntoDocument', layout);
	}
	
	function showItemByIndex(index, lockAnimation){
		var evt = _.Event('indexchange');
		evt.data = _this.data[_index];
		_this.trigger(evt);
		if(_this.onIndexChange) _this.onIndexChange.call(_this, evt);
		syncScrollPosition();
	}
	
	function syncScrollPosition(){
			_box.css('left', -_index*_this.clientWidth+'px');
	}
}