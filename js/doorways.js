function doorway_t(div,title,options)
{
	if(!div)
		return null;
	this.div=div;

	this.el=document.createElement("div");
	this.div.appendChild(this.el);
	this.el.className="jquery_window";

	var _this=this;
	$(function()
	{
		$(_this.el).dialog
		({
			beforeClose:function()
			{
				_this.set_minimized(true);
				return false;
			},
			dragStop:function(event,ui)
			{
				var obj=_this.save();
				_this.move({x:obj.pos.x,y:obj.pos.y});
			}
		});
		$(_this.el).dialog().dialog("widget").
			draggable("option","containment",false);
		$(_this.el).dialog().dialog("widget").
			resizable("option","containment",false);
	});
	this.load(options);
	this.set_title(title);
}

doorway_t.prototype.move=function(pos)
{
	if(!pos)
		pos={};
	var _this=this;
	$(function()
	{
		if(pos.x==0||pos.x)
			$(_this.el).dialog("widget")[0].style.left=Math.max(0,pos.x)+"px";
		if(pos.y==0||pos.y)
			$(_this.el).dialog("widget")[0].style.top=Math.max(0,pos.y)+"px";
	});
}

doorway_t.prototype.resize=function(size)
{
	if(!size)
		size={};
	var _this=this;
	$(function()
	{
		if(size.w==0||size.w)
			$(_this.el).dialog({width:size.w});
		if(size.h==0||size.h)
			$(_this.el).dialog({height:size.h});
	});
}

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
			w:$(this.el)[0].offsetParent.offsetWidth-8,
			h:$(this.el)[0].offsetParent.offsetHeight
		},
		minimized:($(this.el)[0].offsetParent.style.visibility=="hidden"),
		z:this.real_z //will be implemented in manager...
	};
	return data;
}

doorway_t.prototype.load=function(data)
{
	if(!data)
		data={};
	if(!data.pos)
		data.pos={};
	if(!data.pos.x)
		data.pos.x=0;
	if(!data.pos.y)
		data.pos.y=0;
	if(!data.size)
		data.size={};
	if(!data.size.w)
		data.size.w=200;
	if(!data.size.h)
		data.size.h=200;
	if(!data.minimized)
		data.minimized=false;
	this.resize(data.size);
	this.move(data.pos);
	this.set_minimized(data.minimized);
}

doorway_t.prototype.set_minimized=function(minimize)
{
	var _this=this;
	if(minimize)
		$(this.el)[0].offsetParent.style.visibility="hidden";
	else
		$(this.el)[0].offsetParent.style.visibility="visible";
}

doorway_t.prototype.set_title=function(title)
{
	if(!title)
		title="";
	this.el.title=title;
}