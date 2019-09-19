/*!
 * Bootstrap-Plugins Library v1
 * http://bootstrap-plugins.de/
 *
 * Copyright 2015 Bootstrap-Plugins
 * Released under the MIT license
 * https://opensource.org/licenses/MIT
 *
 * Date: 2015-12-21T19:57Z
 */
var fontAwesomeLoaded	=	false;

(function ($) {
	$.fn.wysiwyg	=	function(options){

		if(!fontAwesomeLoaded)
		{
			fontAwesomeLoaded	=	true;

			var link	=	document.createElement('link');
			link.rel	=	'stylesheet';
			link.type	=	'text/css';
			link.media	=	'all';
			link.href	=	'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css';

			document.getElementsByTagName('head')[0].appendChild(link);
		}

		createBtnGroup	=	function(id, _toolbar){
			_toolbar.append('<div id="'+id+'" class="btn-group"></div>');
		};

		addButton	=	function(group, dataEdit, title, icon){
			$('#'+group).append('<a class="btn btn-default" data-edit="'+dataEdit+'" title="'+title+'"><i class="'+icon+'"></i></a>');
		};

		addlink		=	function(group, dataEdit, title, icon, name){
			$('#'+group).append('<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="'+title+'"><i class="'+icon+'"></i></a>' +
				'<div class="dropdown-menu input-append">'+
				'	<div class="row" style="padding: 10px">'+
				'		<div class="col-md-12">'+
				'			<div class="form-group">'+
				'				<label>URL</label>'+
				'				<input id="'+name+'" class="form-control" type="text" data-edit="'+dataEdit+'"/>'+
				'			</div>'+
				'			<button class="btn btn-default" type="button" data-id="'+name+'">Add</button>'+
				'		</div>'+
				'	</div>'+
				'</div>');
		};

		getCurrentRange = function(){
			var sel = window.getSelection();
			if(sel.getRangeAt && sel.rangeCount)
			{
				return sel.getRangeAt(0);
			}
		};

		saveSelection = function(_toolbar){
			selectedRange[_toolbar] = getCurrentRange();
		};

		updateToolbox 	=	function(_toolbar, _allElements){
			for(var i = -1; ++i < _allElements.length;)
			{
				var command	=	_allElements[i];
				var element	=	$('#'+_toolbar+' a[data-edit="'+command+'"]');

				if(document.queryCommandState(command))
				{
					element.addClass('active');
				}
				else
				{
					element.removeClass('active');
				}
			}
		};

		getGroupName 	=	function(element, _toolbar){
			for(var t = -1; ++t < availableElements.length;)
			{
				var _temp	=	availableElements[t];

				if(_temp.indexOf(element) != -1)
				{
					return _temp.toString().replace(/,/g, '_')+'_'+_toolbar;
				}
			}

			return '';
		};

		setSelection 	=	function(_toolbar){
			var selection = window.getSelection();

			if(selectedRange)
			{
				try{
					selection.removeAllRanges();
				}catch(ex){
					document.body.createTextRange().select();
					document.selection.empty();
				}

				selection.addRange(selectedRange[_toolbar]);
			}
		};

		var selectedRange		=	[];

		//Erlaubte Elemente
		var availableElements	=	[];
		availableElements.push(['bold', 'italic', 'underline', 'strikethrough']);
		availableElements.push(['insertunorderedlist', 'insertorderedlist']);
		availableElements.push(['outdent', 'indent']);
		availableElements.push(['justifyleft', 'justifyright', 'justifycenter', 'justifyfull']);
		availableElements.push(['hyperlink']);
		availableElements.push(['unlink']);
		availableElements.push(['picture']);
		availableElements.push(['undo', 'redo']);

		var fontAwesome						=	[];
		fontAwesome['bold']					=	'bold';
		fontAwesome['italic']				=	'italic';
		fontAwesome['underline']			=	'underline';
		fontAwesome['strikethrough']		=	'strikethrough';
		fontAwesome['insertorderedlist']	=	'list-ol';
		fontAwesome['insertunorderedlist']	=	'list-ul';
		fontAwesome['outdent']				=	'outdent';
		fontAwesome['indent']				=	'indent';
		fontAwesome['justifyleft']			=	'align-left';
		fontAwesome['justifyright']			=	'align-right';
		fontAwesome['justifycenter']		=	'align-center';
		fontAwesome['justifyfull']			=	'align-justify';
		fontAwesome['undo']					=	'undo';
		fontAwesome['redo']					=	'repeat';
		fontAwesome['picture']				=	'file-image-o';
		fontAwesome['hyperlink']			=	'link';
		fontAwesome['unlink']				=	'chain-broken';

		$(this).each(function(){

			var availableLinks		=	['hyperlink', 'picture'];

			//Editor & Toolbar aufbauen
			var htmlContent	=	$(this).html();

			$(this).html('');

			var _toolbarID	=	guid();
			var _editorID	=	guid();

			$(this).append('<div id="'+_toolbarID+'" class="btn-toolbar bp_toolbar" data-role="editor-toolbar" style="margin-top: 10px;"></div>');
			$(this).append('<div id="'+_editorID+'" class="bp_content_editor" style="border: 1px solid silver; overflow:scroll; max-height: 300px; margin-top: 10px; margin-bottom: 10px; padding: 5px; outline: none; min-height: 300px; background-color: #ffffff;" contenteditable="true">'+htmlContent+'</div>');

			var editor	=	$('#'+_editorID);
			var toolbar	=	$('#'+_toolbarID);

			var allElements					=	[];

			for(i = -1; ++i < availableElements.length;)
			{
				allElements 	=	allElements.concat(availableElements[i]);
			}

			//Events Editor Box
			editor.on('mouseup keyup mouseout', function(){
				saveSelection(_toolbarID);
				updateToolbox(_toolbarID, allElements);
			});

			for(var z = -1; ++z < allElements.length;)
			{
				var element	=	allElements[z];
				var id		=	getGroupName(element, _toolbarID);

				if(options && options.hasOwnProperty(element) && options[element] != true)
				{
					continue;
				}

				if(toolbar.find(id))
				{
					createBtnGroup(id, toolbar);
				}

				if(availableLinks.indexOf(element) == -1)
				{
					addButton(id, element, element, 'fa fa-'+fontAwesome[element]);
				}
				else
				{
					addlink(id, element, element, 'fa fa-'+fontAwesome[element], element);
				}
			}

			$('#'+_toolbarID+' button').click(function(){
				var data			=	$(this).data();
				var element			=	$('#'+data.id);
				var data_element	=	element.data();
				var url				=	element.val();

				if(url == '')
				{
					return;
				}

				setSelection(_toolbarID);

				if(data_element.edit == 'picture')
				{
					document.execCommand('insertimage', false, url);
				}
				else
				{
					document.execCommand('createLink', false, url);
				}

				element.val('');
			});

			$('#'+_toolbarID+' a:not(.dropdown-toggle)').click(function(){
				var data	=	$(this).data();

				document.execCommand(data.edit);

				updateToolbox(_toolbarID, allElements);
			});

			return $(this);
		});

		return $(this);
	};
}(jQuery));