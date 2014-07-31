
function TileBox(_){
	
	var _this = this.extend('ui.AbstractList');
	
	var _param = {};	
	_param.columnCount = getParam('columnCount', 3);
	
	
	/////////////////////////////////////////////////////////
	//	Public: methods
	/////////////////////////////////////////////////////////
	
	
	
	
	/////////////////////////////////////////////////////////
	//	Override
	/////////////////////////////////////////////////////////
	
	_this._createItem = function(element, json, preventDefault){
		var cell = _.Element('div');
		cell.json = json;
		cell.data = json['data'];
		
		if(!preventDefault) _makeCellContent(cell, json);
		
		_initCellContainerStyle(element);
		_initCellContainerBehavior(cell, json);
		_fixPosition(element, _this.data.length);
		element.append(cell);
	}
	
	_this.bind('DOMSubtreeModified', function(evt){
		_.each(_this.childNodes, function(i, item){
			_fixPosition(item, i);
		});
	});
	
	/////////////////////////////////////////////////////////
	//	Private: methods
	/////////////////////////////////////////////////////////
	
	function _fixPosition(cell, index){
		var colCount = _param.columnCount;
		var col = (index-1)%colCount;
		var row = Math.ceil(index/colCount);
		cell.css({
			left:(col*cell.clientWidth)+'px',
			top:((row-1)*cell.clientHeight)+'px'
		});
		_this.css('height', row*cell.clientHeight+'px');
	}
	
	function _initCellContainerStyle(cell){
		cell.css({
			width:Math.round(100/_param.columnCount)+'%',
			display:'inline-block',
			overflow:'hidden',
			textAlign:'center',
			position:'absolute'
		});
	}
	
	function _makeCellContent(cell, json){
		cell.append(_.Image(json['icon']));
		if(json['label']){
			cell.append(_.Element('br'));
			cell.append(_.TextNode(json['label']));
		}
	}
	
	function _initCellContainerBehavior(element, json){
		if(json['handler'])
			element.bind('click', function(evt){json['handler'](json.data);});
	}
	
	
	_this.css({
		position:'relative'
	});
}