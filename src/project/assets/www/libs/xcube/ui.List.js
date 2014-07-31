
function List(_){
	
	var _this = this.extend('ui.AbstractList');
	
	/////////////////////////////////////////////////////////
	//	Public: methods
	/////////////////////////////////////////////////////////
	
	
	
	
	/////////////////////////////////////////////////////////
	//	Override
	/////////////////////////////////////////////////////////
	
	_this._createItem = function(element, json, preventDefault, useTemplate){
		if(preventDefault) return;
		if(!useTemplate)
			element.html(json['label']||'').addClass('item');
		element.json = json;
		_initItemBehavior(element, json);
	}
	
	
	/////////////////////////////////////////////////////////
	//	Private: methods
	/////////////////////////////////////////////////////////
	
	function _initItemBehavior(element, json){
		if(typeof json['handler'] == 'function'){
			element.bind('click', function(evt){
				json['handler'](json.data);
			});
		}
	}
	
}