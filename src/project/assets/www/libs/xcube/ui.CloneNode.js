function CloneNode(_){
	
	var _target = getParam('target', null);
	if(!_target) throw new Error('Can not find target.');
	var _this = this;
	
	_this.field = function(name, value){
		if(value!=undefined){
			setField(_this.child('[name='+name+']'), value);
		}else{
			return getField(_this.child('[name='+name+']'));
		}
	}

	var param = [];
	_.each(_this.childNodes, function(i, item){
		if(item.nodeType==1&&item.tagName.match(/^xtag:param$/i))
			param.push(item);
	});
	
	_this.html('');
	_target.clone(true).appendTo(_this);
	_.parseXTag(_this.firstChild);
	_.each(param, function(i, item){
		_this.field(item.name, item.value);
	});
	
	
	function setField(element, value){
		if(!element) return;
		var tagName = element.tagName;
		element.html(value);
	}
	
	function getField(element){
		if(!element) return '';
		return element.html();
	}
}