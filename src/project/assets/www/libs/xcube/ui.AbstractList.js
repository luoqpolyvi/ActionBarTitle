
function AbstractList(_){
	
	var _this = this;
	var _data = [];
	var _currentItem;
	var _elements = [];
	var _itemTemp = (function(){
		var temp;
		_.each(_this.childNodes, function(i, item){
			if(item.tagName) return temp=item;
		});	
		return temp;
	})();
	
	var _currentSegment;
	var _segments = [];
	
	var _param = {};
	_param.src = getParam('src', null);
	_param.echoSelection = getParam('echoSelection', false);
	
	
	/////////////////////////////////////////////////////////
	//	Public: hook
	/////////////////////////////////////////////////////////
	
	_this.onDataChange = getParam('onDataChange', null);
	_this.onCreateItem = getParam('onCreateItem', null);
	_this.onFire = getParam('onFire', null);
	_this.onClear = getParam('onClear', null);
	_this.onLoadError = getParam('onLoadError', null);
	
	/////////////////////////////////////////////////////////
	//	Public: Method
	/////////////////////////////////////////////////////////
	
	_this.load = function(jsonArray, bAppend){
		if(jsonArray.length==undefined) throw new Error(arguments.callee.name+'.load: Need an Array.');
		if(!bAppend) this.clear();
		_.each(jsonArray, function(i, item){
			_this.addItem(item);
		});
		return _this;
	}
	
	_this.reload = function(){
		if(!_param.src) return;
		_this.clear();
		loadRemoteData(_param.src);
		return _this;
	}
	
	_this.clear = function(){
		_this._clear();
		clearData();
		_elements = [];
		_segments = [];
		_currentSegment = null;
		var evt = _.Event('clear');
		_this.trigger(evt);
		if(_this.onClear) _this.onClear(evt);
		return _this;
	}
	
	_this.addItem = function(json){
		if(!_currentSegment) _this.createSegment();
		addData(json);
		var noDefaultItem = false;
		
		var element = _itemTemp?_itemTemp.clone(true):_.Element('div');
		element.json = json;
		_currentSegment.appendChild(element);
		
		element.attachData(json);
		
		var evt = _.Event('createitem', false, true);
		evt.data = json;
		evt.targetElement = element;
		element.redefine.call(evt, 'preventDefault', function(){noDefaultItem = true;}, true);
		_this.trigger(evt);
		
		if(_this.onCreateItem) _this.onCreateItem(evt);
		_this._createItem(element, json, noDefaultItem, !!_itemTemp);
		
		element.bind('touchstart', handleOnTouchItemStart, true)
		.bind('touchmove', handleOnTouchItem, true)
		.bind('touchend', handleOnTouchItemEnd, true);
		
		_elements.push(element);
		
		return _this;
	}
	
	_this.fire = function(evt){
		if(!_param.echoSelection&&_currentItem==evt.currentTarget) return;
		_currentItem = evt.currentTarget;
		_this._fire(_currentItem);
		
		var _evt = _.Event('fire');
		_evt.data = _currentItem.json;
		_this.trigger(_evt);
		
		if(_this.onFire)
			_this.onFire.call(this, _evt);
		
		return _this;
	}
	
	_this.getter('isEmpty', function(){
		return _data.length==0;
	});
	
	_this.getter('selection', function(){
		return _currentItem;	
	});
	
	_this.getter('data', function(){
		return _data;	
	});
	
	_this.getter('length', function(){
		return _data.length;	
	});
	
	_this.select = function(index){
		var item = _elements[index];
		if(item)
			item.trigger(_.Event('touchend'));
		return _this;
	}
	
	_this.createSegment = function(){
		_currentSegment = _.Element('div').appendTo(_this._getContainer());
		_segments.push(_currentSegment);
		return _currentSegment;
	}
	
	_this.getter('segments', function(){return _segments;});
	
	/////////////////////////////////////////////////////////
	//	Protected
	/////////////////////////////////////////////////////////
	
	_this._createItem = function(element, json, bPreventDefault, useTemplate){}
	
	_this._fire = function(element){}
	
	_this._clear = function(){_this._getContainer().html('');}
	
	_this._getContainer = function(){return _this};
	
	
	
	/////////////////////////////////////////////////////////
	//	Private
	/////////////////////////////////////////////////////////
	
	function addData(json){
		_data.push(json);
		throwDatachangeEvent();
	}
	
	function clearData(){
		_data = [];
		throwDatachangeEvent();
	}
	
	var _cursor;
	var _currentCursor;
	
	function handleOnTouchItemStart(evt){
		_cursor = 
		_currentCursor = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
	}
	
	function handleOnTouchItem(evt){
		_currentCursor = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
	}
	
	function handleOnTouchItemEnd(evt){
		if(hasMoved()) return;
		_this.fire(evt);
	}
	
	function hasMoved(){
		if(!_cursor||!_currentCursor) return false;
		return Math.abs(_cursor.y-_currentCursor.y)>10||Math.abs(_cursor.x-_currentCursor.x)>10;
	}
	
	function loadRemoteData(url){
		_.get(url, {
			sync:false	,
			dataType:'json',
			success:function(data){
				_this.load(data);
			},
			error:function(){
				var evt = _.Event('loaderror');
				_this.trigger(evt);
				if(_this.onLoadError )_this.onLoadError (evt);
				_this.html('Can not load data from: ' + _param.src);
			}
		});
	}
	
	function throwDatachangeEvent(){
		var evt = _.Event('datachange');
		_this.trigger(evt);
		if(typeof _this.onDataChange=='function') _this.onDataChange.call(this, evt);
	}
	
	/////////////////////////////////////////////////////////
	//	Trigger
	/////////////////////////////////////////////////////////
	
	_this.css('display', 'block');
	_this.clear();
	
	if(_param.src)
		loadRemoteData(_param.src);
	
}