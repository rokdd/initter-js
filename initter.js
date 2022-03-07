/* ====== initter-js ======== 
version: 0.1
author: robert kühn
download updates and help improve at github.com/rokdd/initter-js/

*/

var initter_lib = {
	b64_encode: function(str) {
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
			return String.fromCharCode(parseInt(p1, 16))
		}))
	},
	b64_decode: function(str) {
		return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
		}).join(''))
	},
	a_def: function (arr,key,def)
	{
		if(typeof arr=='undefined')
			arr={};
		if(typeof arr[key]=='undefined')
			arr[key]=def;
		return arr;
	},
	a_val: function (orig,key,def)
	{
		let arr=orig;
		if(typeof arr=='undefined')
			return 'undefined';
		var args = Array.prototype.slice.call(arguments, 1);
		for(var i = 0; i < args.length; i++) {
			if(typeof arr[args[i]]!='undefined')
			{
				initter.log(args[i]+' isset');
				arr=arr[args[i]]
			}
			else
			{
				initter.log(args[i]+' not isset');
				return 'undefined';
			}
		}

		return arr;
	},
	executeFunctionByNameArgs:function (functionName, context , args) {
		if(functionName.indexOf('.')>-1)
		{
			var namespaces = functionName.split(".");
			var func = namespaces.pop();
			for(var i = 0; i < namespaces.length; i++) {
				context = context[namespaces[i]];
			}
		}
		else
		{
			func=functionName;
		}
		if(typeof context=="undefined")
			context=window;
		if(typeof context[func]=="undefined")
		{
			initter.log(context);
			alert(functionName);
			return;
		}

		return context[func].apply(context, args);
	},
	executeFunctionByName:function (functionName, context /*, args */) {
		var args = Array.prototype.slice.call(arguments, 2);
		if(functionName.indexOf('.')>-1)
		{
			var namespaces = functionName.split(".");
			var func = namespaces.pop();
		}
		else
		{
			func=functionName;
		}
		
		for(var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}

		return context[func].apply(context, args);
	},
	getFunctionByName:function (functionName, context /*, args */) {
		if(typeof functionName=="function")
		{
			return functionName;
		}
		var args = Array.prototype.slice.call(arguments, 2);
		initter.log(functionName);
		if(functionName.indexOf('.')>-1)
		{
			var namespaces = functionName.split(".");
			var func = namespaces.pop();
			for(var i = 0; i < namespaces.length; i++) {
				initter.log(context);
				initter.log(namespaces[i]);
				initter.log(namespaces);
				initter.log(document[namespaces[i]])
			context = context[namespaces[i]];
		}
		}
		else
		{
			context=window;
			func=functionName;
		}
		

		return context[func];
	}

};




var initter={
	logger:console,
	css_class:'ii',
	//this might be helpful to not initiate inside of dimmers or modals which are not yet visible to users
	css_exclude:[':hidden'],
	//css include is not used 
	css_include:[':visible'],
	list:{

	},
	log:function (text){
		initter.logger.log('initter',text);
	},

	init:function(part)
	{
		var ini=this;
		initter.log((initter.css_exclude=="" ? '' : '*:not('+initter.css_exclude.join("):not(")+') ')+'.'+initter.css_class);
		$(part).find((initter.css_exclude=="" ? '' : '*:not('+initter.css_exclude.join("):not(")+') ')+'.'+initter.css_class).each(function (n)
		{
			var elem=this;
			initter.log(n);
			initter.log(elem);
			v=$(elem).data('ii');
			initter.log(v);
			if(typeof v!='undefined' && v!='undefined' && v!=false)
			{
				var ii_ids=$(elem).data(initter.css_class);
				//initter.log("def");
				//attribute can contain multiple instances for one elem
				if(!$.isArray(ii_ids))
					ii_ids=[ii_ids];
				var sels=ii_ids;
			}
			else
			{
				var ii_ids=[ Math.floor(Math.random() * 9996) + Date.now()];
				var sels=[""];
				$(elem).data(initter.css_class,ii_ids[0]);
			}
			initter.log("initter "+ii_ids);
			initter.log(ii_ids);
			
			for (var i =0; i<ii_ids.length; i++) {
				let ii_id=ii_ids[i];
				initter.log("initter "+i+" -> "+ii_id);

				if(typeof initter.list[ii_id]=="undefined")
				{
					initter.list[ii_id]={'id':ii_id,'evt':'click','cb':'','args':[],'repeat':'1','originalElement':elem,'selector':elem};
				}
				if(sels[i]!="")
				{
					sel='-'+sels[i];
				}
				else
					sel='';
				var discover_attr=['cb','evt','selector','args'];
				for (var k =0; k<discover_attr.length; k++) {

					var p=discover_attr[k];
					initter.log('ii'+sel+'-'+p);
					
					var v=$(elem).data('ii'+sel+'-'+p);
					initter.log(v);
					if(v!="undefined" && v!=false && typeof v !="undefined")
					{
						initter.list[ii_id][p]=$(elem).data('ii'+sel+'-'+p);
					}

				}
				
				initter.log(initter.list[ii_id]);
				//get all parameters to init the package

				//when the evt is this is means it applys the function to the element at at once
				if(initter.list[ii_id]['evt']=='this')
				{
					//$(initter.list[ii_id]['selector'])[initter.list[ii_id]['cb']]();
					initter.log(initter.list[ii_id]['evt']+' for '+initter.list[ii_id]['cb']);
					initter_lib.executeFunctionByNameArgs(initter.list[ii_id]['cb'],$(initter.list[ii_id]['selector']),initter.list[ii_id]['args']);
					continue;
				}
				//else we check for the function
				else
				{
					initter.log('callback will be "'+initter.list[ii_id]['cb']+'". Convert str to callable object');
					initter.list[ii_id]['cb']=initter_lib.getFunctionByName(initter.list[ii_id]['cb'],window);
				}
				if(initter.list[ii_id]["repeat"]=="0")
				{
					$(elem).removeClass('ii');

					initter.log(initter.list[ii_id]['evt']+' for '+initter.list[ii_id]['cb']);
					$(initter.list[ii_id]['selector']).one(initter.list[ii_id]['evt'],initter.list[ii_id]['cb']);

				}
				else if(initter.list[ii_id]['evt']=="ready")
				{
					$(elem).removeClass('ii');
					initter.log('ready for '+initter.list[ii_id]['cb']);
					$(initter.list[ii_id]['selector']).ready(function () { initter.list[ii_id]['cb'].apply(initter.list[ii_id]['selector']); } );
				}
				else

				{
					initter.log(initter.list[ii_id]['selector']);
					initter.log(initter.list[ii_id]['evt']);
					initter.log(initter.list[ii_id]['cb']);

					$(initter.list[ii_id]['selector']).on(initter.list[ii_id]['evt'],initter.list[ii_id]['cb']);
				//	$(initter.list[ii_id]['selector']).on(initter.list[ii_id]['evt'],function(e) { initter_lib.executeFunctionByName(initter.list[ii_id]['cb'],this,e);});
			}
		}
	});
		initter.log("Fisnied initter");
		initter.log(initter.list);
	}
};
