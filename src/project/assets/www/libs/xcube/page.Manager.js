
function Manager(_){
	
	var _param = {};
	_param.invokeScript = getParam('invokeScript', false);
	_param.onloadPage = getParam('onloadPage', null);
	_param.onloadError = getParam('onloadError', null);
	_param.defaultPage = getParam('defaultPage', null);
	_param.useCache = getParam('cache', true);
	_param.defaultPageCallback = getParam('defaultPageCallback', null);
	_param.sync = getParam('sync', false);
	_param.overflow = getParam('overFlow', 'visible');
	_param.flipStyle = getParam('flipStyle', 1);
	
	var _this = this;
	var _pageCache = {};
	var _activePage;
	var _popStack = [];
	var _pageBox = new DisorderFlipBox().appendTo(_this);
	
	
	var _CONST = {
		MOVE_FROM_LEFT:1,
		MOVE_FROM_RIGHT:2,
		MOVE_NONE:3 
	}
	
	
	/////////////////////////////////////////////////////////
	//	Initialize
	/////////////////////////////////////////////////////////
	
	_this.css({
		display:'block',
		overflow:_param.overflow,
		height:'100%'
	});
	
	/////////////////////////////////////////////////////////
	//	Public: propertys
	/////////////////////////////////////////////////////////
	
	_this.getter('activePage', function(){return _activePage;});
	_this.getter('MOVE_FROM_LEFT', function(){return _CONST.MOVE_FROM_LEFT;});
	_this.getter('MOVE_FROM_RIGHT', function(){return _CONST.MOVE_FROM_RIGHT;});
	_this.getter('MOVE_NONE', function(){return _CONST.MOVE_NONE;});
	
	/////////////////////////////////////////////////////////
	//	Public: method
	/////////////////////////////////////////////////////////
	
	_this.open = function(url, initFun, param, direction, noAnimation, singleton){
			if(url.tagName){
				handleOnGetPage(url, direction, noAnimation);
			}else if(_param.useCache&&_pageCache[url]){
				handleOnGetPageHTML(url, _pageCache[url], initFun, param, direction, noAnimation, singleton);
			}else{
				var _url = url;
				_.get(_url, {
					type:'text',
					sync:_param.sync,
					success:function(data){
						handleOnGetPageHTML(url, data, initFun, param, direction, noAnimation, singleton);
					}, 
					error:function(code){handleOnLoadError(url);}
				});
			}
			return _this;
	};
	
	_this.getter('popStack', function(){return _popStack;});
	
	_this.showModalDialog = function(url, param, callback){
		if(_param.useCache&&_pageCache[url]){
			handleOnGetModalDialogData(url, _pageCache[url], param, callback);
		}else{
			_.get(url, {
				type:'text',
				sync:_param.sync,
				success:function(data){
					handleOnGetModalDialogData(url, data, param, callback);
				},
				error:function(code){handleOnLoadError(url);}
			});	
		}
		return _this;
	}
	
	_this.closeAllModalDialog = function(){
		_.each(_popStack, function(index, item){item.close();});
	}
	
	_this.registerSystemEvent = function(srcElement, eventType, useCapture){
		srcElement.bind(eventType, throwEvent2ActivePage, !!useCapture);
		return _this;
	}

    _this.unRegisterSystemEvent = function(srcElement, eventType, useCapture){
        srcElement.unbind(eventType, throwEvent2ActivePage, !!useCapture);
		return _this;
    }
	
	/////////////////////////////////////////////////////////
	//	Private: method
	/////////////////////////////////////////////////////////
	
	function handleOnGetModalDialogData(url, dom, param, callback){
		_popStack.push(new ModalDialog(url, dom, param, callback).show());
	}
	
	function ModalDialog(url, html, param, callback){
		var container = document.body;
		var _this = _.Element('div').css({position:'absolute', left:'0px', top:'0px', width:'100%', height:'100%', zIndex:'100000'});
		var _page = new Page(url, html, null, param, false).css({width:'100%'}).appendTo(_this);
		_page.dialog = _this;
		_this.show = function(){
			container.appendChild(_this);
			return _this;
		}
		
		_this.close = function(){
			if(_this.parentNode==container) container.removeChild(_this);
			_page.dettachModelFields().term();
			_popStack.pop();
			return _this;
		}
		
		return _this.getter('contentPage', function(){return _page;});
	}
	
	function throwEvent2ActivePage(evt){
		if(!_this.activePage || _locked) return;
		var event = _.Event(evt.type, evt.bubbles, evt.cancelabel);
		_.merge(event, evt);
		_this.activePage.trigger(event);
	}
	
	function handleOnGetPageHTML(url, html, initFun, param, direction, noAnimation, singleton){
		handleOnGetPage(new Page(url, html, initFun, param, singleton), direction, noAnimation);
	}
	
	function handleOnGetPage(page, direction, noAnimation){
		page.show(direction, noAnimation);
		var evt = _.Event('loadpage');
		evt.data = page;
		evt.title = page.title;
		_this.trigger(evt);
		if(_param.onloadPage) _param.onloadPage.call(_this, evt);
	}
	
	function handleOnLoadError(url){
		var evt = _.Event('error');
		evt.data = url;
		_this.trigger(evt);
		if(_param.onloadError) _param.onloadError.call(_this, evt);
	}
	
	/////////////////////////////////////////////////////////
	//	InnerClass: Page
	/////////////////////////////////////////////////////////
	
	var _singletonPages = {};
	
	function Page(url, html, initFun, param, singleton){
		if(singleton&&_singletonPages[url]) return _singletonPages[url];
		if(_param.useCache&&url) _pageCache[url] = html;
		
		var _scriptReady = true;
		var _bodyHTML = fetchBodyHTML(html);
		var _newURL = document.location.toString().replace(/[\/]?[^\/]*$/, '/');
		var _xFields = [];
		var _page = _.Element('div').css('height', '100%');
		_page.lock = null;
		_page.innerHTML = fetchCssfromHead(html)+_bodyHTML;
		_page.param = param;
		
		if(singleton) _singletonPages[url] = _page;
		if(_param.invokeScript){
			_scriptReady = false;
			_this.bind('ready', function(){_scriptReady=true;})
			invokeScript(html);
		}
		_page.bind('DOMNodeInsertedIntoDocument', parseXTag)
		.bind('show', function(){
			_page.lock = _.timer(function(){_page.lock = null;}, 800);
		})
		.bind('click', function(event){
			if(_page.lock){
				event.stopPropagation();
				event.preventDefault();
			}
		}, true);
		
		_page.getter('url', function(){return url;});
		
		_page.show = function(direction, noAnimation){
			if(_page.parentNode==_this || _activePage==_page) return;
			_activePage = _page;
			_pageBox.open(_page, direction, noAnimation);
			var evt = _.Event('show');
			_page.trigger(evt);
			if(initFun) initFun.call(_page, evt);
			return _page;
		}
		
		_page.close = function(){
			_activePage = null;
			if(!singleton) _page.dettachModelFields().term();
			return _page;
		}
		
		_page.term = function(){
			setTimeout(function(){
				_page.html('');
				if(_page.parentNode) _page.parentNode.removeChild(_page);
			}, 1000);
			return _page;
		}
		
		_page.dettachModelFields = function(){
			dettachModelFields(_xFields);
			return _page;
		}
		
		function parseXTag(){
			if(!_scriptReady)
				return $.timer(parseXTag, 100, 'pageManagerScriptReady');
			_.parseXTag(_page);
			fixAnchors(_page.child('a[href]'));
			attachModelFields(_page.child('*[x-field]'));
			syncTitle(html);
			_page.unbind('DOMNodeInsertedIntoDocument', parseXTag);
			_page.trigger($.Event('pageReady'));
		}
		
		function attachModelFields(fields){
			if(!fields) return;
			if(fields.length){
				$.each(fields, function(index, value){fixXField(value);});
			}else{
				fixXField(fields);
			}
		}
		
		function dettachModelFields(fields){
			while(fields.length>0){
				fields.pop().trigger($.Event('term'));
			}
		}
		
		function syncTitle(html){
			var title = String(html.match(/<title>[\w\W]*<\/title>/i)).replace(/<title>|<\/title>/gi, '');
			var titleElement = _page.child('*[x-page=title]');
			if(titleElement) titleElement.html(title);
		}
		
		function fixXField(field){
			_xFields.push(field);
			var evt = _.Event('xfield');
			evt.name = field.attribute('x-field');
			evt.element = field;
			evt.page = _page;
			_this.trigger(evt);
		}
		
		function fixAnchors(anchors){
			if(anchors){
				if(anchors.length){
					for(var i=0; i<anchors.length; i++)
						makeupAnchor(anchors[i]);
				}else{
					makeupAnchor(anchors);
				}
			}
			
			function makeupAnchor(a){
				var href = a.attribute('href');
				if(href=='#'||href.indexOf('javascript:')==0) return;
				a.bind('click', function(evt){
					if(href.indexOf('#xcube:')==0){
						var evt = _.Event('xanchor');
						evt.data = href.replace(/(^#xcube:)|(-[\S]*$)/g, '');
						evt.param = String(href.match(/-[\S]*/g)).replace('-', '').split('-');
						_this.trigger(evt);
					}else{
						_this.open(href);
					}
				}).attribute('href', '#');
			}
		}
		
		function fetchBodyHTML(html){
			var body = html.match(/<body[^>]*?>[\W\w]*<\/body>/i);
			if(!body) throw new Error('Can not find body element @ ' + url);
			return body[0];
		}
		
		function fetchCssfromHead(html){
			var css = '';
			html.replace(/<head[^>]*?>[\W\w]*<\/head>/gi, function(head){
				head.replace(/<link[^>]+((rel=\"stylesheet\")|(type=\"text\/css\")){1,}[^>]+\/>|<style[^>]*?>[\W\w]*<\/style>/gi, function(item){
					css+=item.replace(/<link[^>]+href=\"/gi, function(str){return str+_newURL;});
				});
			});
			return css;
		}
		
		function invokeScript(html){
			var result = [];
			var ajaxCount = 0;
			html.replace(/(<script|<script[^>]+)[\W\w]*?<\/script>/gi, function(script){
				var link = script.match(/src=\"[^>]*\"/i);
				if(link){
					var src = link[0].replace(/src="|"/gi, '');
					loadExternalScript(_newURL+'/'+src, result);
					result.push('');
				}else{
					result.push(script.replace(/(<((script|script[^>]+)|\/script)>)/gi, ''));
				}
			});

			invokeIfReady();
			
			function mappingHandlersFromAttribute(node){
				if(!node.childNodes||node.childNodes.length==0) return;
				_.each(node.childNodes, function(i, item){
					if(item.nodeType!=1) return;
					var trash = [];
					_.each(item.attributes, function(j, att){
						if(att.name.match(/^(on|x-on)[\w]/i)){
							trash.push(att);
							item.bind(att.name.replace(/^on/i, ''), function(event){eval(att.value);});
						}
					});
					_.each(trash, function(j, att){item.attribute(att.name, null)});
					mappingHandlersFromAttribute(item);
				});
			}
			
			function invokeIfReady(){
				if(ajaxCount==0){
                    try{
                        var fun = eval('(function constructor(){'+result.join(';')+';('+mappingHandlersFromAttribute.toString()+')(this);})');
                        _page.runtime = fun.call(_page);
                    }catch (e){
                        throw e;
                    }finally{
                        _this.trigger(_.Event('ready'));
                    }
				}
			}
			
			function loadExternalScript(url, queue){
				var index = queue.length;
				ajaxCount++;
				_.get(url, {
					dataType:'text',
					success:function(data){
						queue[index] = data;
					},
					always:function(){
						ajaxCount--;
						invokeIfReady();
					}
				});			
			}
		}
		
		return _page;
	}
	
	if(_param.defaultPage)
		_this.open(_param.defaultPage, _param.defaultPageCallback, null, _CONST.MOVE_NONE);
	
	
	
	/*
	###################################################################
	
		DisorderFlipBox
	
	###################################################################
	*/
    var _locked = false;
	
	function DisorderFlipBox(){
		switch(_param.flipStyle){
			case 2:
				return new CoverBox();
			case 1:
			default:
				return new DefaultFlipBox();
		}
	}
	
	
	function CoverBox(){
		var _easeDuration = 0.3;
		var _this = _.Element('div').css({height: '100%', position:'relative'});
		var _lastPage, _currentPage;
		var _zIndex = 10000;
		
		_this.open = function(page, direction, noAnimation){
			if(_locked) return;
			
			var _property = 'left';
			
			_container = _.Element('div').css({
                width:"100%",
                height:"100%",
                position:'absolute',
				left:'100%',
				zIndex:_zIndex++
			})
			.defineCssAnimation(_property, noAnimation?0:_easeDuration, 'ease-out')
			.appendTo(_this);
			_container.appendChild(page);
			
			_lastPage = _currentPage;
			_currentPage = _container;
			
			switch(direction){
				case _CONST.MOVE_NONE:
					if(_lastPage&&_lastPage.parentNode) _this.removeChild(_lastPage);
                    _pos = 0;
					makeMove(_property, 0);
					return;
				case _CONST.MOVE_FROM_LEFT:
					fromLeft = true;
                    _pos = -_this.clientWidth;
					_currentPage.defineCssAnimation(_property, 0, 'ease-out');
					_lastPage.defineCssAnimation(_property, _easeDuration, 'ease-out');
					makeMove(_property, 0);
					if(_lastPage)
						_lastPage.css({
							'left':_this.clientWidth+'px',
							'zIndex':_currentPage.css('zIndex')+1
						});
					break;
				case _CONST.MOVE_FROM_RIGHT:
                default:
                    _pos = _this.clientWidth;
                    makeMove(_property, 0);
					break;
			}
			
			lockInteractive(_property);
			if(_lastPage) _lastPage.firstChild.trigger(_.Event('hide'));
		}
		
		function makeMove(property, pos){
			_container.css({'left':'-'+pos+"px"});
		}
		
		function lockInteractive(_property){
			var events = 'touchstart touchmove click';
			_locked = true;
			_this.bind(events, cancelEventFlow, true);
			setTimeout(function(){
                if(_lastPage) _this.removeChild(_lastPage);
                _locked=false;
                _this.unbind(events, cancelEventFlow, true);
            }, _easeDuration*1000);
		}
		
		return _this;
	}
	
	
	function DefaultFlipBox(){
		var _easeDuration = 0.3;
		var _this = _.Element('div').css('height', '100%');
		var _slider = _.Element('div')
								.css({position:'relative', height:'100%'})
								.appendTo(_this);
		var _pos = 0;
		var _lastPage, _currentPage;
        var _container;
		
		_this.open = function(page, direction, noAnimation){
			if(_locked) return;
			
			_container = _.Element('div').css({
                width:"100%",
                height:"100%",
                position:'absolute'
			}).appendTo(_slider);
			_container.appendChild(page);
			
			_lastPage = _currentPage;
			_currentPage = _container;

			var fromLeft = false;
            var _property = _.browserCore+'transform';
            _slider.defineCssAnimation(_property, noAnimation?0:_easeDuration, 'ease-out');
			switch(direction){
				case _CONST.MOVE_NONE:
					if(_lastPage&&_lastPage.parentNode) _lastPage.parentNode.removeChild(_lastPage);
                    _pos = 0;
					makeMove(_property, 0);
					return;
				case _CONST.MOVE_FROM_LEFT:
					fromLeft = true;
                    _pos = -_this.clientWidth;
					makeMove(_property, _pos);
					break;
				case _CONST.MOVE_FROM_RIGHT:
                default:
                    _pos = _this.clientWidth;
                    makeMove(_property, _pos);
					break;
			}
            lockInteractive(_property);
			if(_lastPage) _lastPage.firstChild.trigger(_.Event('hide'));
		}
		
		function makeMove(property, pos){
			_slider.css(property, pos==0?'':'translate3d('+(-_pos)+'px,0,0)');
			_container.css({'left':pos+"px"});
		}
		
		function lockInteractive(_property){
			var events = 'touchstart touchmove click';
			_locked = true;
			_this.bind(events, cancelEventFlow, true);
			setTimeout(function(){
                if(_lastPage && _lastPage.parentNode==_slider) _slider.removeChild(_lastPage);
                _locked=false;
                _this.unbind(events, cancelEventFlow, true);
                _slider.defineCssAnimation('transform', 0, '').css(_property, '');
                _container.css({'left':'0px'});
            }, _easeDuration*1000);
		}
		
		return _this;
	}
	
	
	function cancelEventFlow(evt){
		evt.stopPropagation();
		evt.preventDefault();
	}
}