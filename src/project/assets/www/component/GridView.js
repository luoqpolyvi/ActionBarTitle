/**
 * 分页Touch网格控件
 * @type {*}
 */
var GridView = (function (window) {
    var isIE = /MSIE/gi.test(navigator.appVersion);
    var hasPointerEvent = navigator.msPointerEnabled;
    /**
     * 组根据下标删除元素方法
     * @param index
     * @return {*}
     */
    function removeArrayItem(array, index) {
        if (index < 0) {
            return array;
        } else {
            return array.slice(0, index).concat(array.slice(index + 1, array.length));
        }
    }

    /**
     * 事件触发器
     * @constructor
     */
    function EventEmitter() {
        this.callbacks = {};
        this.bind = function (event, fn) {
            (this.callbacks[event] = this.callbacks[event] || [])
                .push(fn);
            return this;
        };
        this.unbind = function(event, fn){
            if(!event)return;
            if(fn){
                var callbacks = this.callbacks[event];
                if(!callbacks)return;
                var tmp = [];
                for(var i=0;i<callbacks.length;i++){
                    var callback = callbacks[i];
                    if(fn === callback)tmp.push(i);
                }
                for(var j=0;j<tmp.length;j++){
                    this.callbacks[event] = removeArrayItem(this.callbacks[event],tmp[j]);
                }
            }else{
                this.callbacks[event] = [];
            }
            return this;
        };
        this._emit = function (event) {
            var args = Array.prototype.slice.call(arguments, 1)
                , callbacks = this.callbacks[event]
                , len;
            if (callbacks) {
                len = callbacks.length;
                for (var i = 0; i < len; ++i) {
                    callbacks[i].apply(this, args)
                }
            }
            return this;
        };
    }

    function GetterSetter(){
        if(!Object.prototype.__defineGetter__){
            this.__defineGetter__ = function(property,callback){
                Object.defineProperty(this, property, {get:callback, configurable:true});
            }
        }
        if(!Object.prototype.__defineSetter__){
            this.__defineSetter__ = function(property,callback){
                Object.defineProperty(this, property, {set:callback, configurable:true});
            }
        }
    }

    function TouchHandler(el,start,move,end){
        var _this = el;
        var eventMap = {"MSPointerDown" : "touchstart","MSPointerMove" : "touchmove","MSPointerUp" : "touchend"};

        var EventHandler = {
            start:hasPointerEvent ? "MSPointerDown" : eventMap["MSPointerDown"],
            move:hasPointerEvent ? "MSPointerMove" : eventMap["MSPointerMove"],
            end:hasPointerEvent ? "MSPointerUp" : eventMap["MSPointerUp"]
        };

        _this.addEventListener(EventHandler.start, touchStart, false);

        function touchStart(e){
            var target = hasPointerEvent ? document : _this;
            target.addEventListener(EventHandler.move, touchMove, false);
            target.addEventListener(EventHandler.end, touchEnd, false);
            start.call(_this,e);
        }

        function touchMove(e){
            if(hasPointerEvent){
                Object.defineProperty(e, "currentTarget", {get:function(){
                    return _this;
                }, configurable:true});
            }
            move.call(_this,e);
        }

        function touchEnd(e){
            var target = hasPointerEvent ? document : _this;
            target.removeEventListener(EventHandler.move, touchMove, false);
            target.removeEventListener(EventHandler.end, touchEnd, false);
            if(hasPointerEvent){
                Object.defineProperty(e, "currentTarget", {get:function(){
                    return _this;
                }, configurable:true});
            }
            end.call(_this,e);
        }
    }

    /**
     *  队列对象，存储队列数据。
     * @type {*}
     */
    var Queue = (function () {//闭包
        var Queue = function (maxSize) {
            // 队列存放的数组
            this.list = [];
        };
        Queue.prototype = {
            pop:function () {
                this.list.pop();
            },
            /**
             * 往队列添加一个元素
             * @param item
             */
            push:function (item) {
                this.list.push(item);
            },
            /**
             * 返回队列的长度
             * @return {Number}
             */
            size:function () {
                return this.list.length;
            },
            /**
             * 从队列中移除一个元素
             * @param itemOrIndex
             */
            remove:function (itemOrIndex) {
                var index = isNaN(itemOrIndex) ? this.list.indexOf(itemOrIndex) : itemOrIndex;
                this.list = removeArrayItem(this.list, index);
            },
            /**
             * 清空队列数据
             */
            clear:function () {
                this.list = [];
            },
            /**
             * 根据下标从队列中取元素
             * @param index
             * @return {*}
             */
            get:function (index) {
                return this.list[index];
            },
            /**
             * 获取元素在队列中的下标位置
             * @param item
             * @return {Number}
             */
            indexOf:function (item) {
                return this.list.indexOf(item);
            },
            /**
             * 队列重新排序
             * @param func
             */
            sort:function (func) {
                this.list.sort(func);
            },
            /**
             * 替换队列中的两个元素
             * @param a
             * @param b
             */
            replace:function (a, b) {
                if (isNaN(a))a = this.indexOf(a);
                if (isNaN(b))b = this.indexOf(b);
                var _a = this.get(a);
                this.remove(a);
                this.list.splice(b, 0, _a);
            },
            /**
             * 往队列中指定下标插入新元素
             */
            insert:function (index, item) {
                this.list.splice(index, 0, item);
            },
            /**
             * 向队列目标元素之前插入新元素
             * @param target > 目标元素
             * @param item > 新元素
             */
            insertBefore:function (target, item) {
                var index = this.list.indexOf(target);
                this.insert(index - 1, 0, item);
            },
            /**
             * 向队列目标元素之后插入新元素
             * @param target > 目标元素
             * @param item > 新元素
             */
            insertAfter:function (target, item) {
                var index = this.list.indexOf(target);
                this.insert(index + 1, 0, item);
            }
        };
        return Queue;
    })();
    /**
     * 滑动页面对象
     * @type {*}
     */
    var Page = (function(){
        function Page(gridViewOption,container,containerWidth) {
            GetterSetter.call(this);
            EventEmitter.call(this);
            if(isNaN(containerWidth))containerWidth = container.offsetWidth;
            var currentPageX = 0, maxPageX = 0, totalPage = 1, currentPageIndex = 0;
            var _enable = true;
            var pageQueue = new Queue();
            var draggble = true;
            /**
             * 页面滑动功能开关
             * @param enable
             */
            this.setEnable = function (enable) {
                _enable = !!enable;
            };
            this.isEnable = function(){
                return _enable;
            };
            this.setDraggble = function(bdraggble){
                draggble = !!bdraggble;
            };
            this.isDraggble = function(){
                return draggble;
            };
            /**
             * 是否还有下一页
             * @return {Boolean}
             */
            this.hashNext = function () {
                return currentPageX < maxPageX;
            };
            /**
             * 是否还有上一页
             * @return {Boolean}
             */
            this.hashPrev = function () {
                return currentPageX > 0;
            };
            /**
             * 添加一个新页面
             */
            this.add = function () {
                maxPageX += containerWidth;
                totalPage++;
//                setCss(container, {
//                    "width":totalPage * containerWidth
//                });
                pageQueue.push(0);
                this._emit("addpage");
            };
            /**
             * 滑动到下一页面
             * @param duration
             */
            this.goNext = function (duration) {
                if (!this.hashNext() || !_enable)return;
                if (isNaN(duration))duration = gridViewOption.duration;
                currentPageX += containerWidth;
                currentPageIndex = Math.max(currentPageIndex+1,0);
                setCss(container, {
                    "-webkit-transform":"translateX(-" + currentPageX + "px)",
                    "-webkit-transition":duration + "ms"
                });
                this._emit("pagedown",currentPageIndex);
            };
            /**
             * 滑动到上一页面
             * @param duration
             */
            this.goPrev = function (duration) {
                if (!this.hashPrev() || !_enable)return;
                if (isNaN(duration))duration = gridViewOption.duration;
                currentPageX -= containerWidth;
                currentPageIndex = Math.max(currentPageIndex-1,0);
                setCss(container, {
                    "-webkit-transform":"translateX(-" + currentPageX + "px)",
                    "-webkit-transition":duration + "ms"
                });
                this._emit("pageup",currentPageIndex);
            };
            /**
             * 从队列中获取页面对象
             * @param index
             * @return {*}
             */
            this.get = function (index) {
                return pageQueue.get(index);
            };
            /**
             * 移除一个页面 由于是队列形式，只能移除最后一个，元素自动往前挤压。
             */
            this.remove = function () {
                currentPageX = Math.max(currentPageX - containerWidth,0);
                maxPageX = Math.max(maxPageX - containerWidth,0);
                totalPage = Math.max(totalPage-1,1);
                currentPageIndex = Math.max(currentPageIndex-1,0);
                setCss(container, {
                    "-webkit-transform":"translateX(-" + currentPageX + "px)"
                });
                this._emit("poppage");
            };
            this.translateStart = function(event){
                this._emit("dragstart",event);
            };
            this.translateX = function (x) {
                setCss(container, {
                    "-webkit-transform":"translateX(" + x + "px)",
                    "-webkit-transition":"0s"
                });
                this.ox = x;
                this._emit("dragmove",x);
            };
            this.translateEnd = function (direction, moveX) {
                var x = this.ox;
                if (isNaN(x))return;
                if (moveX > 100) {
                    if ("right" == direction) {
                        if (this.hashPrev()) {
                            this.goPrev();
                        } else {
                            reset();
                        }
                    } else if ("left" == direction) {
                        if (this.hashNext()) {
                            this.goNext();
                        } else {
                            reset();
                        }
                    }else{
                        reset();
                    }
                } else {
                    reset();
                }
                function reset() {
                    setCss(container, {
                        "-webkit-transform":"translateX(-" + currentPageX + "px)",
                        "-webkit-transition":"260ms"
                    });
                }
                this._emit("dragend",moveX);
            };
            /**
             * 当前页面的真实X坐标
             */
            this.__defineGetter__("currentPageX", function () {
                return currentPageX;
            });
            /**
             * 当前总共页面数量
             */
            this.__defineGetter__("totalPage", function () {
                return totalPage;
            });
            /**
             * 当前页面的相对left坐标
             */
            this.__defineGetter__("relativeLeft", function () {
                return currentPageX;
            });
            /**
             * 当前页面的相对right坐标
             */
            this.__defineGetter__("relativeRight", function () {
                return currentPageX + containerWidth;
            });
            /**
             * 当前页面的下标
             */
            this.__defineGetter__("currentPageIndex", function () {
                return currentPageIndex;
            });
            /**
             * 页面X轴最大值,相对于left
             */
            this.__defineGetter__("maxPageX", function () {
                return maxPageX;
            });
            this.__defineGetter__("countPage",function(){
                return parseInt(maxPageX/containerWidth);
            });
            // 添加touch事件
            this._dragHandler = new DragPageHandler(this);

            function DragPageHandler(page) {
                var record = {
                    startX:0,
                    startY:0,
                    currentX:0,
                    currentY:0,
                    reset:function () {
                        this.startX = 0;
                        this.startY = 0;
                        this.currentX = 0;
                        this.currentY = 0;
                    }
                };

                function dragPageStart(e) {
                    if(!_checkCanDrag(e))return;
                    e.preventDefault();
                    var touch = e.touches ? e.touches[0] : e;
                    record.reset();
                    record.startX = record.currentX = touch.pageX;
                    record.startY = record.currentY = touch.pageY;
                    page.translateStart(e);
                }

                function dragPage(e) {
                    if(!_checkCanDrag(e))return;
                    e.preventDefault();
                    var touch = e.touches ? e.touches[0] : e;
                    record.currentX = touch.pageX;
                    record.currentY = touch.pageY;
                    if (record.startX < record.currentX) {
                        e.direction = "right";
                    } else if (record.startX > record.currentX) {
                        e.direction = "left";
                    }
                    var x = -(record.startX - touch.pageX + page.currentPageX);
                    page.translateX(x);
                }

                function dragPageEnd(e) {
                    if(!_checkCanDrag(e))return;
                    e.preventDefault();
                    var x = record.currentX;
                    if (record.startX < record.currentX) {
                        e.direction = "right";
                    } else if (record.startX > record.currentX) {
                        e.direction = "left";
                    }
                    var moveX = Math.abs(record.startX - x);
                    setTimeout(function(){
                        page.translateEnd(e.direction, moveX);
                    },50);
                    record.reset();
                }

                function _checkCanDrag(event){
                    if(!page.isDraggble())return false;
                    if(!gridViewOption.bounce && (event.type == "touchmove" || event.type == "MSPointerDown")){
                        var touch = event.touches ? event.touches[0] : event;
                        if(page.currentPageIndex <= 0 && touch.pageX >= record.startX)return false;
                        if((page.currentPageIndex+1) == page.totalPage && touch.pageX <= record.startX)return false;
                    }
                    return true;
                }

                this.reset = function(){
                    record.reset();
                };

                new TouchHandler(container,dragPageStart,dragPage,dragPageEnd);
            }
        }
        return Page;
    })();

    /**
     * GridView 可拖动分页九宫格对象
     * @constructor
     */
    function GridView(el,containers,GridViewOption) {
        GetterSetter.call(this);
        /**
         * GridView容器配置对象
         * @type {Object}
         */
        var gridViewOption = {
                /**
                 * 每一行元素的最大个数，超出就换行。自动排列为"auto";
                 */
                numColumns:"auto",
                /**
                 * 列宽，即每一列元素最大的宽度,不包含间距在内。
                 */
                columnWidth:75,
                /**
                 * 元素行间距
                 */
                verticalSpacing:10,
                /**
                 * 元素列间距
                 */
                horizontalSpacing:10,
                /**
                 * 容器上下间距
                 */
                xSpacing:8,
                /**
                 * 容器左右间距
                 */
                ySpacing:8,
                /**
                 * 是否允许拖曳
                 */
                draggable:true,
                // 弹跳
                bounce:true,
                // 拖曳动画持续时间(毫秒)
                duration:300,
                // 触感效果(点击元素触发拖曳事件后震动效果)
                tactile:true,
                // 顶部偏移位置 容器距离顶部的位置
                offsetTop:0,
                // 元素长按事件触发所需时间
                itemHoldTimeout:300,
                // 元素可替换
                replaceable:true,

                wrapperHeight:null,
                wrapperWidth:null
            },
            /**
             * 网格元素配置对象
             */
                gridItemOption = {
                /**
                 * 元素高度，不包含间距。
                 */
                height:75,
                /**
                 * 元素宽度，不包含间距。
                 */
                width:75,
                /**
                 * 元素相对于X轴的坐标位置。
                 */
                x:0,
                /**
                 * 元素相对于Y轴的坐标位置。
                 */
                y:0,
                /**
                 * 是否允许拖曳，如果不允许则不会存入坐标队列中。
                 * 默认为true
                 */
                draggable:true,
                overflow:null
            };
        // left 和 top的坐标偏移量。(如果没有偏移量,当边界元素的焦点触发拖曳事件后放大效果边界位置会被剪切掉)
        var ofx = 0,ofy= 0, recX = ofx, recY = ofy;
        //把传入对象的配置复制到gridView配置对象中。如果没有则保持默认的。
        copyProperties(GridViewOption, gridViewOption);
        // 网格元素和坐标队列，每一个元素对应一个坐标。
        var gridQueue = new Queue(), positionQueue = new Queue();
        ofx = gridViewOption.xSpacing;
        ofy = gridViewOption.ySpacing;
        recX = ofx;
        recY = ofy;
        this.Queue = gridQueue;
        if (typeof el == "string") el = document.getElementById(el);
        if (!el)throw new Error("Parent node can not be null");
        el.setAttribute("draggable","false");
        EventEmitter.call(this);
        var appContainer = this.appContainer = el;
        var container = this.container = containers;
        setCss(el, {
            
            "width":"100%",
            "height":"100%",
            "-webkit-transition":"300ms"
        });
        var containerWidth = gridViewOption.wrapperWidth || el.offsetWidth,
            containerHeight = gridViewOption.wrapperHeight || el.offsetHeight;
        var page = this.page = new Page(gridViewOption,appContainer,containerWidth);
        // 计算组件距离屏幕顶部的距离
        if(gridViewOption.offsetTop<=0)gridViewOption.offsetTop = el.offsetTop;
        /**
         * 设置GridView的配置
         * @param option
         */
        this.setOption = function (option) {
            copyProperties(option, gridViewOption);
        };
        this.options = function(){
            return {
                gridView:gridViewOption,
                item:gridItemOption
            }
        };
        /**
         * 向GridView中添加一个元素
         * @param item = 元素原生对象
         * @param GridItemOption = 元素配置信息
         */
        this.add = function (item, GridItemOption) {
            copyProperties(GridItemOption, gridItemOption);
            if (!GridItemOption || isNaN(GridItemOption.width)){
                gridItemOption.width = gridViewOption.columnWidth;
            }
            var _this = _createItem(item, gridItemOption);
            container[page.totalPage-1].appendChild(_this);
            new ItemDragHandler(this,_this,page);
            gridQueue.push(_this);
            gridItemOption.overflow = null;
            this._emit("additem",_this);
            return _this;
        };
        /**
         * 移除一个元素
         * @param itemOrIndex
         */
        this.remove = function (itemOrIndex) {
            var item = isNaN(itemOrIndex) ? itemOrIndex : this.get(itemOrIndex);
            if (!item || !item.parentNode)return;
            item.parentNode.removeChild(item);
            gridQueue.remove(item);
            positionQueue.remove(positionQueue.size() - 1);
            resortAll(gridQueue,positionQueue);
            var lastItemPos = positionQueue.get(positionQueue.size() - 1);
            if (!lastItemPos) {
                recX = ofx;
                recY = ofy;
            } else {
                recX = lastItemPos.x;
                recY = lastItemPos.y;
                if (lastItemPos.x < page.maxPageX) {
                    page.remove();
                }
            }
            this._emit("removeitem",item);
        };

        this.removeAll = function(){
            for(var i=0;i<gridQueue.size();i++){
                this.remove(gridQueue.get(i));
            }
        };

        this.pop = function () {
            this.remove(gridQueue.get(gridQueue.size() - 1));
        };
        /**
         * 根据下标获取元素
         * @param index
         * @return {*}
         */
        this.get = function (index) {
            return gridQueue.get(index);
        };
        /**
         * 九宫格所有元素个数
         * @return {Number}
         */
        this.size = function () {
            return gridQueue.size();
        };
        /**
         * 指定元素的下标位置
         * @param item
         * @return {Number}
         */
        this.indexOf = function (item) {
            return gridQueue.indexOf(item);
        };

        this.destroy = function(){
            container.parentNode.removeChild(container);
            container = undefined;
            this.page = undefined;
            delete (container);
            delete (this.page);
            delete (this);
        };

        this.__defineGetter__("verticalSpacing", function () {
            return gridViewOption.verticalSpacing;
        });
        this.__defineGetter__("horizontalSpacing", function () {
            return gridViewOption.horizontalSpacing;
        });
        /**
         * 创建一个新元素
         * @param item
         * @param options
         * @return {Element}
         */
        function _createItem(item, options) {
            GetterSetter.call(item);
            if (!options)options = {};
            var width = options.width && options.width < gridViewOption.columnWidth ? options.width : gridViewOption.columnWidth;
            var _item = item;
            if (typeof item != "object") {
                item = document.createTextNode(item);
                _item = createBox(width, options.height);
                _item.appendChild(item);
            }
            var position = _calculatePosition();
//            var cssOptions = (navigator.userAgent.match(/iPhone OS 7/)) ?{
//                "width":75,
//                "overflow": options.overflow || "",
//                "-webkit-transition":gridViewOption.duration + "ms"
//            }:{
//                "width":75,
//                "overflow": options.overflow || "",
//                "-webkit-backface-visibility": "hidden",
//                "-webkit-transition":gridViewOption.duration + "ms"
//            }
           // setCss(_item, cssOptions);
            //console.log("position::" + JSON.stringify(position));
            positionQueue.push({x:position.x, y:position.y});
            _item.draggable = gridItemOption.draggable;
            _item.__defineGetter__("x", function () {
                var index = gridQueue.indexOf(this);
                return positionQueue.get(index).x;
            });
            _item.__defineGetter__("y", function () {
                var index = gridQueue.indexOf(this);
                return positionQueue.get(index).y;
            });
            _item.__defineGetter__("index", function () {
                return gridQueue.indexOf(this);
            });
            gridItemOption.draggable = true;
            return _item;
        }
        /**
         * 计算新建元素应该放置的位置
         * @return {Object}
         * @private
         */
        function _calculatePosition() {
            var height = gridItemOption.height, width = gridItemOption.width;
            var i = gridQueue.size();
            var columns = gridViewOption.numColumns;
            if (columns == "auto") {
                columns = Math.floor(screen.availWidth / (width + gridViewOption.horizontalSpacing + gridViewOption.xSpacing));
            }
            columns = parseInt(columns);
            var cy = i % columns;
            var _rex, _rey;
            if (cy == 0 && i != 0) {
                _rex =  page.maxPageX;
                _rey = recY + height + gridViewOption.verticalSpacing;
            } else {
                // 分页偏移量
                var offsetPageX = (page.totalPage - 1) * containerWidth;
                _rex = cy * parseInt(screen.availWidth/columns) + offsetPageX;
                _rey = recY;
            }
            recX = _rex;
            recY = _rey;
           // console.log(recY + "--" + height + "--" + gridViewOption.verticalSpacing + "--" + containerHeight);
            if ((recY + height + gridViewOption.verticalSpacing) > containerHeight) {
                recY = ofy;
                recX = containerWidth * page.totalPage + ofx;
                page.add(gridQueue);
            }
            return {x:recX, y:recY};
        }

        /**
         * 给元素添加拖曳功能
         * @type {*}
         */
        function ItemDragHandler(gridView,item,page) {
            item._isMoved = false;
            var holdTimer,isHold;
            var record = {
                startX:0,
                startY:0,
                currentX:0,
                currentY:0,
                startTime:0,
                endTime:0,
                reset:function () {
                    this.startX = 0;
                    this.startY = 0;
                    this.currentX = 0;
                    this.currentY = 0;
                }
            };
            function Handler(gridViewOption,_item){
                var item = _item;
                this.hold = function () {
                    if (!gridViewOption.draggable || !item.draggable)return;
                    activeDragDrop(item);
                };
                this.dragMove=function (e) {
                    if (!gridViewOption.draggable || !item.draggable || !item.activity)return;
                    var touch = e.touches ? e.touches[0] : e;
                    var moveX = touch.pageX - item.offsetWidth / 2 + page.currentPageX,
                        moveY = touch.pageY - item.offsetHeight / 2 - gridViewOption.offsetTop;
                    setCss(item, {
                        "left":moveX,
                        "top":moveY
                    });
                    if(!gridViewOption.replaceable)return;
                    _checkDragDrop(item);
                };
                this.dragEnd=function (e) {
                    if (gridViewOption.draggable && item.draggable && item.activity) {
                        unactiveDragDrop(item);
                        setCss(item, {
                            "left":item.x,
                            "top":item.y
                        });
                    }
                    page.setEnable(true);
                }
            }
            var handler = new Handler(gridViewOption,item);
            function onTouchStart(e){
                e.preventDefault();
                var touch = e.touches ? e.touches[0] : e;
                var time = isNaN(gridViewOption.itemHoldTimeout) ? 500 : gridViewOption.itemHoldTimeout;
                record.startTime = e.timeStamp;
                gridView._emit("focusitem",touch,item);
                holdTimer = setTimeout(function () {
                    record.startX = record.currentX = touch.pageX;
                    record.startY = record.currentY = touch.pageY;
                    if(record.currentX == record.startX && record.currentY == record.startY){
                        isHold = true;
                        handler.hold(e);
                        gridView._emit("holditem",touch,item);
                    }
                }, time);
            }
            function onTouchMove(e){
                e.preventDefault();
                var touch = e.touches ? e.touches[0] : e;
                record.currentX = touch.pageX;
                record.currentY = touch.pageY;
                if(isHold){
                    gridView._emit("dragitem",touch,item);
                    handler.dragMove(e);
                    page.setDraggble(false);
                    e.stopPropagation();
                }
                if(holdTimer)clearTimeout(holdTimer);
            }
            function onTouchEnd(e){
                page.setDraggble(true);
                e.preventDefault();
                if(isHold){
                    if(e.stopPropagation)e.stopPropagation();
                    handler.dragEnd(e);
                    e.pageX = record.currentX;
                    e.pageY = record.currentY;
                    gridView._emit("releaseitem",e,item);
                }
                if(holdTimer)clearTimeout(holdTimer);
                record.endTime = e.timeStamp;
                var timestamp = record.endTime - record.startTime;
                if(timestamp < 480){
                    if(Math.abs(record.currentX - record.startX)<10 &&
                        Math.abs(record.currentY - record.startY) < 10){
                        gridView._emit("tapitem",e,item);
                        var evt = document.createEvent("HTMLEvents");
                        evt.initEvent("tap",true,true);
                        item.dispatchEvent(evt);
                    }
                }
                isHold = false;
                record.reset();
            }

            new TouchHandler(item,onTouchStart,onTouchMove,onTouchEnd);
            /**
             * 激活拖曳联动事件
             * @param _item
             */
            function activeDragDrop(_item) {
                if (gridViewOption.tactile) {
                    var notify = navigator.notification;
                    if (notify && notify.vibrate)
                        notify.vibrate(30);//震动30毫秒
                }
                _item.setAttribute("active"," ");
                setCss(_item,{"-webkit-transition":"0ms","z-index":"999"});
                _item.activity = true;
            }

            /**
             * 取消拖曳联动事件
             * @param _item
             */
            function unactiveDragDrop(_item) {
                _item.removeAttribute("active");
                setCss(_item,{"-webkit-transition":gridViewOption.duration + "ms","z-index":""});
                _item.activity = false;
            }
            /**
             * 检查元素被拖到某个元素之上的状态
             * 使用相对坐标循环计算队列中每一个元素和当前元素坐标相减的值,检查是否在重合点。
             * @param currentItem >> 当前拖曳的元素
             * @private
             */
            function _checkDragDrop(currentItem) {
                for (var i = 0; i < gridQueue.size(); i++) {
                    var item = gridQueue.get(i);
                    if (item != currentItem && item.draggable) {
                        var cx = currentItem.offsetLeft, cy = currentItem.offsetTop;
                        var mx = cx - item.x, my = cy - item.y;
                        var r = item.offsetWidth / 2;
                        if (mx > -r && mx < r && my < r && my > -r) {
                            moveItems(gridQueue,positionQueue,currentItem, item);
                            return;
                        } else {
                            item._isMoved = false;
                            if (cx + r * 1.6 >= page.relativeRight) {
                                page.goNext();
                                page.setEnable(false);
                            } else if (cx + r / 1.6 <= page.currentPageX) {
                                page.goPrev();
                                page.setEnable(false);
                            } else {
                                page.setEnable(true);
                            }
                        }
                    } else {
                        item._isMoved = false;
                    }
                }
            }
            return item;
        }
        /**
         * 替换元素。替换后自动重新排列
         * @param current
         * @param target
         * @return {Boolean}
         */
        function moveItems(gridQueue,positionQueue,current, target) {
            var currentIndex = gridQueue.indexOf(current);
            var targetIndex = gridQueue.indexOf(target);
            if (currentIndex == targetIndex)return false;
            gridQueue.replace(currentIndex, targetIndex);
            resortItem(gridQueue,positionQueue,currentIndex, targetIndex);
            return true;
        }
        /**
         * 刷新重新排列后元素的坐标位置
         * @param ci
         * @param ti
         */
        function resortItem(gridQueue,positionQueue,ci, ti) {
            if (ci < ti) {
                for (var i = ci; i < ti; i++) {
                    var item = gridQueue.get(i);
                    var pos = positionQueue.get(i);
                    setCss(item, {
                        "left":pos.x,
                        "top":pos.y
                    });
                }
            } else {
                for (var i = ci; i > ti; i--) {
                    var item = gridQueue.get(i);
                    var pos = positionQueue.get(i);
                    setCss(item, {
                        "left":pos.x,
                        "top":pos.y
                    });
                }
            }
        }
        function resortAll(gridQueue,positionQueue){
            for (var i = 0; i < gridQueue.size(); i++) {
                var pos = positionQueue.get(i);
                setCss(gridQueue.get(i), {
                    "left":pos.x,
                    "top":pos.y
                });
            }
        }
    }
    /**
     * 对象属性复制
     * @param a
     * @param b
     */
    function copyProperties(a, b) {
        if (typeof a != "object")a = {};
        for (var p in a) {
            b[p] = a[p];
        }
    }

    /**
     * 创建一个指定大小盒子
     * @param width
     * @param height
     * @return {Element}
     */
    function createBox(width, height) {
        var box = document.createElement("div");
        box.width = width;
        box.height = height;
        setCss(box, {
            "width":width,
            "height":height,
            "overflow":"hidden"
        });
        return box;
    }

    /**
     * 设置dom元素的css样式属性
     * @param o
     * @param css
     */
    function setCss(o, css) {
        for (var i in css) {
            var v = css[i];
            if (typeof v == "number") {
                v = v + "px";
            }
            o.style[i] = v;
            if(/^-webkit-/.test(i)){
                i = i.replace(/^-webkit-/,"");
                o.style[i] = v;
            }
        }
    }
    return GridView;
})(this);