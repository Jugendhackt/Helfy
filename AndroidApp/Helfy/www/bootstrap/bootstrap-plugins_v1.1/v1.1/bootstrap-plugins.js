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
var version		=	'v1.1';

function s4()
{
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function guid()
{
	return 'a'+s4()+s4()+s4()+s4()+s4()+'_b';
}

(function($){
    $.fn.bootstrap_plugins = function(plugin, options){

		var _pluginEditor	=	$(this);
		var _id;
		var _function;

        switch(plugin.toLowerCase())
		{
			case 'bootstrap-tags':
			case 'tags':
			case 'bootstrap tags':
			case 'tag':

				_id			=	'bootstrap-tags';
				_function	=	'tags';

			break;
			case 'bootstrap-wysiwyg-editor':
			case 'bootstrap-wysiwyg':
			case 'wysiwyg-editor':
			case 'wysiwyg':

				_id			=	'bootstrap-wysiwyg';
				_function	=	'wysiwyg';

			break;
			case 'bootstrap-validator':
			case 'validator':

				_id			=	'bootstrap-validator';
				_function	=	'validator';

			break;
			case 'bootstrap-combobox':
			case 'combobox':

				_id			=	'bootstrap-combobox';
				_function 	=	'combobox';

			break;
			case 'bootstrap-display-password':
			case 'display_password':
			case 'display-password':

				_id			=	'bootstrap-display-password';
				_function	=	'display_password';

			break;
			default:

				throw ('Error: plugin "'+plugin+'" not found');

			break
		}

		$.cachedScript('http://cdn.bootstrap-plugins.de/'+version+'/plugins/'+_id+'/js/'+_id+'.min.js').done(function(){
			_pluginEditor[_function](options);
		}).fail(function(){
			$.cachedScript('http://cdn.bootstrap-plugins.de/'+version+'/plugins/'+_id+'/js/'+_id+'.js').done(function(){
				_pluginEditor[_function](options);
			}).fail(function(){
				throw 'Error: script '+_id+' not found';
			});
		});
    };

}(jQuery));

jQuery.cachedScript = function(url, options)
{
	options = $.extend( options || {}, {
    	dataType: "script",
    	cache: true,
    	url: url
  	});

  	return jQuery.ajax(options);
};