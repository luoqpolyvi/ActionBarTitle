function Data(_){
	
	var _this = this;
	var type = getParam('type', 'text');
	var sync = getParam('sync', true);
	var src = getParam('src', null);
	var onSuccess = getParam('onSuccess', null);
	var onError = getParam('onError', null);
	var _data;
	
	if(src){
		_.get(src,{
						sync:sync,
						dataType:type,
						success:function(data){
							_data = data;
							if(onSuccess) onSuccess.call(_this, data);
						},
						error:onError
					}
		);
	}
	
	_this.getter('data', function(){return _data;});
	
}