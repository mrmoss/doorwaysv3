//Creates a window.
//  div is the containing div to append to.
//  options is a JSON object that should look like the object specified
//          in .save().
function doorway_t(div,options)
{
	if(!div)
		return null;
	this.div=div;
	this.el=document.createElement("div");
	this.div.appendChild(this.el);
	this.el.className="jquery_window";
	var _this=this;

	//There seems to be a hardcoded offset...be nice to get this dynamically...
	this.size_offset=
	{
		w:8,
		h:0
	};

	//When resizing, window constrains windows to the window.
	this.resize_event=window.addEventListener("resize",function()
	{
		_this.load(_this.save());
	});

	$(function()
	{
		$(_this.el).dialog
		({
			create:function(event,ui)
			{
				var widget=$(this).dialog("widget");
				$(".ui-dialog-titlebar-close span",widget)
					.addClass("ui-test");
			},

			//Disable built in close button action and just hide the window.
			//  Note, .close() resets position and size...
			beforeClose:function()
			{
				_this.set_minimized(true);
				return false;
			},

			//Manual upper left containment when real containment is off.
			//  Note, you need to uncomment this if containment is off.
			/*dragStop:function(event,ui)
			{
				var obj=_this.save();
				_this.move({x:obj.pos.x,y:obj.pos.y});
			}*/
		});

		//Uncomment to turn containment off.
		/*$(_this.el).dialog().dialog("widget").
			draggable("option","containment",false);
		$(_this.el).dialog().dialog("widget").
			resizable("option","containment",false);*/
	});

	//Initial load...
	this.load(options);
}

//Moves window to given position.
//  Position should look like: {x:INT,y:INT}
//  JQuery uses anonymous functions, so after is a function that is
//  called after the move has actually taken place.
doorway_t.prototype.move=function(pos,after)
{
	//Make a copy of the pos...
	if(!pos)
		pos={};

	//Set position with containment.
	//Note, when containment is off, you should change the Math.max(...)
	//      to just pos.x and pos.copy.y.
	var _this=this;
	var obj=this.save();
	$(function()
	{
		if(pos.x==0||pos.x)
			$(_this.el).dialog("widget")[0].style.left=
				Math.max(0,Math.min(pos.x,window.innerWidth-
					obj.size.w-_this.size_offset.w))+"px";
		if(pos.y==0||pos.y)
			$(_this.el).dialog("widget")[0].style.top=
				Math.max(0,Math.min(pos.y,window.innerHeight-
					obj.size.h-_this.size_offset.h))+"px";
		if(after)
			after();
	});
}

//Resizes window to given size.
//  Size should look like: {w:INT,h:INT}
//  JQuery uses anonymous functions, so after is a function that is
//  called after the resize has actually taken place.
doorway_t.prototype.resize=function(size,after)
{
	if(!size)
		size={};
	var _this=this;
	$(function()
	{
		if(size.w==0||size.w)
			$(_this.el).dialog({width:Math.min(size.w,window.innerWidth-_this.size_offset.w)});
		if(size.h==0||size.h)
			$(_this.el).dialog({height:Math.min(size.h,window.innerHeight-_this.size_offset.h)});
		if(after)
			after();
	});
}

//Saves the object into a JSON object.
// Object looks like: {title:STRING,size:{w:INT,h:INT},pos:{x:INT,y:INT}}
doorway_t.prototype.save=function()
{
	var data=
	{
		pos:
		{
			x:$(this.el)[0].offsetParent.offsetLeft,
			y:$(this.el)[0].offsetParent.offsetTop
		},
		size:
		{
			w:$(this.el)[0].offsetParent.offsetWidth-this.size_offset.w,
			h:$(this.el)[0].offsetParent.offsetHeight-this.size_offset.h
		},
		minimized:($(this.el)[0].offsetParent.style.visibility=="hidden"),
		z:this.real_z //will be implemented in manager...
	};
	return data;
}

//Loads a window from the save format above.
doorway_t.prototype.load=function(data)
{
	//Make a copy of the object...
	if(!data)
		data={};
	var data_copy=JSON.parse(JSON.stringify(data));

	//Set default values...
	if(!data_copy)
		data_copy={};
	if(!data_copy.title)
		data_copy.title="";
	if(!data_copy.pos)
		data_copy.pos={};
	if(!data_copy.pos.x)
		data_copy.pos.x=0;
	if(!data_copy.pos.y)
		data_copy.pos.y=0;
	if(!data_copy.size)
		data_copy.size={};
	if(!data_copy.size.w)
		data_copy.size.w=200;
	if(!data_copy.size.h)
		data_copy.size.h=200;
	if(!data_copy.minimized)
		data_copy.minimized=false;

	//Set our actual values...
	var _this=this;
	this.el.title=data_copy.title;
	this.resize(data_copy.size,function()
	{
		_this.move(data_copy.pos,function()
		{
			_this.set_minimized(data_copy.minimized);

			//Close button seems to be focused when a window is made.
			//  Stop that...
			if("activeElement" in document)
				document.activeElement.blur();
		});
	});
}

//Hides or shows the window.
doorway_t.prototype.set_minimized=function(minimize)
{
	var _this=this;
	if(minimize)
		$(this.el)[0].offsetParent.style.visibility="hidden";
	else
		$(this.el)[0].offsetParent.style.visibility="visible";
}