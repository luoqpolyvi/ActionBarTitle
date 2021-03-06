/*
#########################################################################

	xMesh v1.0
	Author: Songjc 
	Base on: xCube 1.0
	Run @ Webkit & IE10+
	Polyvi

#########################################################################
*/

var xmesh = new function(){
	
	var $ = window.POLYVI_XCUBE;
	if(!$) throw new Error('xMesh requires xCube.');
	var _this = $.XObject(this);
	var _history = new PageStack();
	var _pageManager;
	
	var _CONST = {
		BACK:1,
		FORWARD:2,
		NONE:3 
	}
	
	var _root;
	var _controllerTemp = {};
	var _currentPath = '/';
	var _currentNode = null;
	var _EVENTS = {
		pathChange 	: 'pathChange',
		pathError		: 'pathError',
		actionError	: 'actionError'
	}
	
	
	this.loadMap = function(url){
		$.get(url, {
			sync:true,
			dataType:'xml',
			success:function(data){
				_root = data.documentElement;
				_loadModel(_root);
				_fixActionTemplate(_root);
				_this.to(_currentPath);
			},
			error:function(){$.log('Can not find map: '+url);}
		});
		return this;
	}
	
	this.attachPageManger = function(pageManager, noHistory){
		pageManager
		.bind('xanchor', _handleOnGetXAnchor)
		.bind('xfield', _handleOnScanXField);
		if(!noHistory) _pageManager = pageManager.bind('loadpage', function(evt){
			this.activePage.pathNode = _currentNode;
			_history.forward(_currentPath, _currentNode, this.activePage);
		})
		return this;
	}
	
	
	/////////////////////////////////////////////////////////////////////////////////////
	//	Controller
	/////////////////////////////////////////////////////////////////////////////////////
	
	this.to = function(actionPath, direction, param, singleton){
		if(actionPath.tagName){
			var pageCache = actionPath;
			_syncPathInfo(pageCache.xpath, pageCache.xnode);
			this.trigger(createPathEvent(_EVENTS.pathChange, pageCache.xpath, direction, pageCache, param, singleton));
		}else{
			var pageCache = _history.to(actionPath);
			if(pageCache){
				_syncPathInfo(pageCache.xpath, pageCache.xnode);
				this.trigger(createPathEvent(_EVENTS.pathChange, pageCache.xpath, 1, pageCache, param, singleton));
			}else{
				var targetNode = _excuteActionPath(actionPath);
				if(targetNode){
					if(!targetNode.getAttribute('src')) throw new Error('Can not find attribute "src" @ current action node');
					_syncPathInfo(actionPath, targetNode);
					this.trigger(createPathEvent(_EVENTS.pathChange, actionPath, direction, pageCache, param, singleton));
				}else{
					this.trigger(createPathEvent(_EVENTS.pathError, actionPath));
				}
			}
			$.log(actionPath, '<'+this.activeNode.src+'>');
		}
		return this;
	}
		
	this.home = function(noAnimation){
		return this.to('/', noAnimation?_CONST.NONE:_CONST.BACK);
	}
	
	this.back = function(){
		if(typeof _pageManager.activePage.back == 'function'){
			var preventDefault = _pageManager.activePage.back();
			if(!preventDefault){
				if(_currentPath=='/'){
					_this.trigger($.Event('exit'));
				}else{
					return this.to(_history.back()||_currentPath.replace(/\/[^\/]+$/, ''), _CONST.BACK);
				}
			}else{
				return this;
			}
		}else if(_pageManager.popStack.length){
			var targetPop = _pageManager.popStack[_pageManager.popStack.length-1];
			if(typeof targetPop.contentPage.back == 'function'){
				var preventDefault = targetPop.contentPage.back();
				if(!preventDefault){
					_pageManager.popStack.pop();
					targetPop.close();
				}
			}else{
				_pageManager.popStack.pop();
				targetPop.close();
			}
			return this;
		}else if(_currentPath=='/'){
			_this.trigger($.Event('exit'));
			return this;
		}else{
			return this.to(_history.back()||_currentPath.replace(/\/[^\/]+$/, ''), _CONST.BACK);
		}
	}
	
	this.defineActivePageBackBehavior = function(callback){
		_pageManager.activePage.back = callback;
	}
	
	this.act = function(action, param, singleton){
		var kids = _pageManager.activePage.pathNode.childNodes;
		var targetPath = null;
		
		$.each(kids, function(i, kid){
			if(kid.nodeType!=1) return;
			var name = kid.getAttribute('name');
			if(name == action){
				targetPath = _currentPath.replace(/[^\/]*\/$/, '')+'/'+action;
				return true;
			}
		});
		if(targetPath) return this.to(targetPath, null, param, singleton);
		
		var tempLink = _controllerTemp[action];
		if(tempLink){
			var quoteNode = tempLink.cloneNode(true);
			quoteNode.setAttribute('quote', 'true');
			_currentNode.appendChild(quoteNode);
			return this.act(action, param, singleton);
		}
		
		return this.trigger(createActionEvent(_EVENTS.actionError, action));
	}
	
	this.lastQuote = function(mark){
		var target = _currentNode;
		var path = [];
		var startGatherPath = false;
		do{
			var action = target.getAttribute('name');
			if(startGatherPath){
				path.unshift(action);
			}else if(mark){
				var reg = new RegExp('^('+mark+')$', 'i');
				if(reg.test(action)){
					startGatherPath = true;
					path.unshift(action);
				}
			}else{
				if(target.getAttribute('quote')=='true')
					startGatherPath = true;
			}
			target = target.parentNode;
		}while(target!=_root);
		return this.to('/'+path.join('/'));
	}
	
	this.getter('activeNode', function(){return ActiveNode.call(_currentNode);})
	getter('currentPath', function(){return _currentPath;});
	
	
	this.showModalDialog = function(url, param, callback){
		_pageManager.showModalDialog(url, param, callback);
	}
	
	this.closeAllModalDialog = function(){
		_pageManager.closeAllModalDialog();
	}
	
	/////////////////////////////////////////////////////////////////////////////////////
	//	Model
	/////////////////////////////////////////////////////////////////////////////////////
	
	var _modelMap = {};
	
	this.getter('model', function(){return _modelMap;});
	
	this.addModel = function(name, Model){
		if(typeof Model != 'function') throw new Error('Model needs a constructor.');
		initModel(name, new Model($), Model.name);
		return this;
	}
	
	
	function initModel(name, m, type){
		var m = $(m);
		m._name = name;
		m._isModel = true;
		m._elementMap = {};
		m._format = m._format||{};
		_modelMap[name] = m;
		
		var defaultValues = {};
		
		$.each(m, function(mark, item){
			if(typeof item!='function'&&String(item).indexOf('_')!=0){
				var _privateVar = item;
				defaultValues[mark] = item;
				m.setter(mark, function(value){
					var srcElement = m.srcElement;
					if(!m._noValidation&&!validateByKey(m._name+'.'+mark, value, srcElement, true)) return;
					_privateVar = value;
					var evt = $($.Event('propertyChange'));
					evt.value = value;
					evt.property = mark;
					this.trigger(evt);
				});
				m.getter(mark, function(){return _privateVar;});
			}
		});
		
		m.toString = function(){
			var result = {};
			$.each(defaultValues, function(mark, item){
				if(/^_/.test(mark)) return;
				result[mark] = m[mark];
			});
			return $.toJson(result);
		}
		
		m.validate = function(form){
			return validateForm(form, m._name);
		}
		
		m.reset = function(fieldName){
			m._noValidation = true;
			if(fieldName){
				m[fieldName] = defaultValues[fieldName];
			}else{
				$.each(defaultValues, function(mark, item){m[mark] = item;});
			}
			m._noValidation = false;
			m.trigger($.Event('reset'));
		}
		
		m.hasProperty = function(property){return String(m[property]) != 'undefined';}
		
		m.bind('propertyChange', function(evt){
			var queue = this._elementMap[evt.property];
			if(!queue) return;
			$.each(queue, function(i, item){
				m.output(item, evt.property);
			});
		}).bind('validateModelProperty', function(evt){
			_this.trigger(evt);
		});
		
		m.addField = function(property, element){
			if(!this._elementMap[property]) this._elementMap[property] = [];
			if(hasField(property, element)) return;
			this._elementMap[property].push(element);
		}
		
		m.removeField = function(property, element){
			var fields = this._elementMap[property];
			if(!fields) return;
			$.each(fields, function(i, item){
				if(item==element)
					m._elementMap[property].splice(i, 1);
			});
		}
		
		m.output = function(element, mark){
			var fun = m._format[mark];
			if(fun)
				_setXField(element, fun.call(m, m[mark]));
			else
				_setXField(element, m[mark]);
		}
		
		function validateByKey(mark, value, srcElement, noEvent){
			var map = m._validation;
			if(!map) return true;
			
			var segments = mark.replace(/^[^.]+./, '').split('.');
			var info = map;
			var fun;
			do{
				info = info[segments.shift()];
				if(!info) return true;
				fun = info[0];
			}while(segments.length);
			if(typeof fun != 'function'){return true;}
			
			if(noEvent) return true;
			var result = fun?fun(value):null;
			var evt = $($.Event('validateModelProperty'));
			evt.hasError = !!result;
			evt.message = info[1]||(result?result:null);
			evt.property = mark;
			evt.value = value;
			evt.model = m;
			evt.getter('srcElement', function(){return srcElement;});
			m.trigger(evt);
			return !evt.hasError;
		}
		
		function validateForm(formElement, modelName){
			var hasError = false;
			$.each(formElement, function(i, item){
				var xfield = item.attribute('x-field');
				if(xfield){
					if(!validateByKey(xfield, item.value, item)){
						return hasError=true;
					}
				};
			});
			return !hasError;
		}
		
		function hasField(property, element){
			var result = false;
			$.each(m._elementMap[property], function(i, item){
				return result=result||(item==element);
			});
			return result;
		}
		
		return m;
	}
	
	
	/////////////////////////////////////////////////////////////////////////////////////
	//	Private members
	/////////////////////////////////////////////////////////////////////////////////////
	
	function _fixActionTemplate(root){
		_parseActionTemp(_findActionTempBaseNode(root));
	}
	
	function _findActionTempBaseNode(root){
		var tempBase;
		$.each(root.childNodes, function(i, item){
			if(String(item.tagName).match(/^actionTemp$/i)){
				tempBase = item;
				return true;
			}
		});
		return tempBase;
	}
	
	function _parseActionTemp(base){
		$.each(base.childNodes, function(i, item){
			if(String(item.tagName).match(/^action$/i))
				_controllerTemp[item.getAttribute('name')] = item;
		});
	}
	
	function _handleOnScanXField(evt){
		var element = evt.element;
		if(element._hasAttachedXField) return;
		element._hasAttachedXField = true;
		
		var model = _findModeByPath(evt.name);
		if(!model) return;
		
		var property = evt.name.split('.').pop();
		if(!model.hasProperty(property)) return;
		
		model.addField(property, element);
		element.bind('term', function(){
			model.removeField(property, element);
		});
		
		if(_isFormElement(element.tagName)){
            element.bind('change', function(evt){
				model.srcElement = this;
				if(typeof model[property] == "boolean"
                    && element.tagName.match(/input/i)
                    && element.type.match(/checkbox|radio/i)){
                    model[property] = element.checked;
                }else{
                    model[property] = this.value;
                }
            });
        }
		
		model.output(element, property);
	}
	
	
	function _findModeByPath(path){
		var segments = path.split('.');
		if(segments.length<2) return null;
		
		var property = segments.pop();
		var name = segments.join('.');
		var model = _this.model[segments.shift()];
		var validation = model._validation||{};
		var format = model._format||{};
		if(!model) return null;
		
		while(segments.length>0){
			var name = segments.shift();
			var model = model[name];
			if(model&&!model._isModel){
				var m = initModel(name, model, 'json');
				m._validation = validation[name];
				m._format = format[name];
			}else if(!model){
				return null;
			}
		};
		
		return model;
	}
	
	
	function _setXField(element, value){
		if(_isFormElement(element.tagName)){
			if(element.tagName.match(/^select$/i)){
				var existValue = false;
				$.each(element.options, function(i, item){
					existValue = existValue||item.value==value;
					return existValue;
				});
				if(!existValue) return;
			}
			element.value = value;
		}else if(element.tagName.match(/^img$/i)){
			element.src = value;
		}else{
			element.html(value);
		}
		var evt = $.Event('x-ondata');
		evt.data = value;
		element.trigger(evt);
	}
	
	function _isFormElement(tagName){
		return tagName.match(/input|textarea|select|output/i);
	}
	
	function _handleOnGetXAnchor(evt){
		switch(evt.data.toUpperCase()){
			case 'BACK':
				_this.back();
				break;
			case 'ACTION':
				_this.act(evt.param[0], evt.param.slice(1));
				break;
			case 'HOME':
				_this.home();
				break;
			default:
				alert('Can not handle the XAnchor command: '+evt.data);
				break;
		}
	}
	
	function _loadModel(root){
		$.each(root.childNodes, function(i, item){
			if(item.tagName=='model'){
				var src = item.getAttribute('src');
				var name = item.getAttribute('name');
				var constuctor = src.replace(/^([\w\W]*\/)|.js$/gi, '');
				$.get(src, {
								sync:true, 
								success:function(data){eval('(function(){'+data+';_this.addModel("'+name+'",'+constuctor+');})();');}, 
								error:function(){$.log('Can not find Model File: '+ src);}
								}
						);
			}
		});
	}

	function ActiveNode(){
		if(this.isActiveNode) return this;
		this.isActiveNode = true;
		var _this = this;
		$.each(_this.attributes, function(i, item){
			_this[item.name] = item.value;
		});
		return _this;
	}
	
	function createPathEvent(eventType, path, direction, oldPage, param, singleton){
		var evt = $.Event(eventType);
		evt.path = path;
		evt.cachedPage= oldPage;
		evt.direction = direction||_CONST.FORWARD;
		evt.param = param;
		evt.singleton = !!singleton;
		return evt;
	}
	
	function createActionEvent(eventType, action){
		var evt = $.Event(eventType);
		evt.action = action;
		return evt;
	}
	
	function findActionChild(baseNode, targetName){
		var result = null;
		var quote = null;
		$.each(baseNode.childNodes, function(i, kid){
			if(kid.nodeType!=1) return;
			if(kid.getAttribute('name') == targetName) return result=kid;
			if(kid.getAttribute('name') == '@'+targetName && _controllerTemp[targetName]){
				quote = _controllerTemp[targetName].cloneNode(true);
				baseNode.appendChild(quote);
				baseNode.removeChild(kid);
			}
		});
		return result||quote;
	}
	
	function findChild4XPath(baseNode, pathInfo){
		var kids = baseNode.childNodes;
		$.each(kids, function(i, kid){
			if(kid.nodeType!=1) return true;
			if(kid.tagName==pathInfo) return kid;
		});
		return null;
	}
	
	function _syncPathInfo(xpath, xnode){
		_currentPath = xpath;
		_currentNode = xnode;
	}
	
	function _excuteActionPath(xpath){
		if(xpath=='/') return _root;
		var path = xpath.split('/');
		var currentNode = _root;
		while(path.length>0&&currentNode){
			var currentPos = path.shift();
			if(currentPos=='') continue;
			currentNode = findActionChild(currentNode, currentPos);
			if(!currentNode&&path.length>0) break;
		}
		return currentNode;
	}
	
	
	/////////////////////////////////////////////////////////////////////////////////////
	//	Plugin xmesh-data-holder
	/////////////////////////////////////////////////////////////////////////////////////
	
	function DataHolder(_){
		var onData = getParam('onData', null);
		if(!this.attribute('style'))
			this.css({'display':'block', width:'100%'});
		this.html = function(data){
			var evt = _.Event('data');
			evt.data = data;
			this.trigger(evt);
			if(onData) onData.call(this, evt);
		}
	}
	
	$.plugin('xmesh-data-holder', DataHolder);
	
	
	/////////////////////////////////////////////////////////////////////////////////////
	//	InnerClass PageStack
	/////////////////////////////////////////////////////////////////////////////////////
	
	function PageStack(){
		
		var _stack = [];
		
		this.forward = function(xpath, xnode, page){
			page.xpath = xpath;
			page.xnode = xnode;
			_stack.push(page);
		}
		
		this.back = function(){
			if(_stack.length<2) return null;
			_stack.pop().close();
			return _stack.pop();
		}
		
		this.to = function(xpath){
			var cache = null;
			$.each(_stack, function(index, item){
				if(item.xpath==xpath){
					$.each(_stack.slice(index+1), function(i, item){item.close();});
					_stack = _stack.slice(0, index);
					cache = item;
					return true;
				}
			});
			return cache;
		}
	}
	
	
};