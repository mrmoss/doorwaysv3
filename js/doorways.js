function doorway_t(div,options)
{
	if(!div)
		return null;
	this.div=div;

	if(!options)
		options={};
	if(!options.title)
		options.title="";
	if(!options.pos)
		options.pos={};
	if(!options.pos.x)
		options.pos.x=0;
	if(!options.pos.y)
		options.pos.y=0;
	if(!options.size)
		options.size={};
	if(!options.size.w)
		options.size.w=200;
	if(!options.size.h)
		options.size.h=200;

	this.el=document.createElement("div");
	this.div.appendChild(this.el);
	this.el.className="jquery_window";
	this.el.title=options.title;

	var _this=this;
	$(function()
	{
		$(_this.el).dialog(
		{
			beforeClose:function()
			{
				_this.set_minimize(true);
				return false;
			}
		});
	});
	this.resize(options.size);
	this.move(options.pos);
}

doorway_t.prototype.move=function(pos)
{
	if(!pos)
		pos={};
	var _this=this;
	$(function()
	{
		if(pos.x==0||pos.x)
			$(_this.el).dialog("widget")[0].style.left=pos.x+"px";
		if(pos.y==0||pos.y)
			$(_this.el).dialog("widget")[0].style.top=pos.y+"px";
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

doorway_t.prototype.set_minimize=function(minimize)
{
	var _this=this;
	if(minimize)
		$(this.el)[0].offsetParent.style.visibility="hidden";
	else
		$(this.el)[0].offsetParent.style.visibility="visible";
}