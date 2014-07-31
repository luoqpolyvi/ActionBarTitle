
function Prefetch(_){
		
	var _this = this;
	var _param = {};
	_param.src = getParam('src', null);
	_param.type = getParam('type', 'text');
	_param.delay = getParam('delay', 1000);
	
	
	if(!_param.src||_._prefetchLib[_param.src]) return;
	setTimeout(prefetch, _param.delay);
	
	function prefetch(){
		switch(_param.type){
			case 'image':
				loadAsImage(_param.src);
				break;
			default:
				loadAsText(_param.src);
				break;
		}
	}
	
	function loadAsImage(url){
		var img = _.Image(url);
		if(img.complete){
			handleOnImageLoaded();
		}else{
			img.bind('load', handleOnImageLoaded);
		}
	}
	
	function loadAsText(url){
		_.get(url, {
			sync:false,
			type:'text',
			success:handleOnGetText
		});
	}
	
	function handleOnImageLoaded(){
		_._prefetchLib[_param.src] = true;
	}
	
	function handleOnGetText(data){
		_._prefetchLib[_param.src] = data;
	}
	
}
