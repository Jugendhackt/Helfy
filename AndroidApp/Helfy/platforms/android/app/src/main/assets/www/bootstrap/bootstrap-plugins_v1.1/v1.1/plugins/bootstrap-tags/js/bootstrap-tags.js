/*!
 * Bootstrap-Plugins Library v1.1
 * http://bootstrap-plugins.de/
 *
 * Copyright 2015 Bootstrap-Plugins
 * Released under the MIT license
 * https://opensource.org/licenses/MIT
 *
 * Date: 2015-12-25T19:57Z
 */

var version	=	'v1.1';
var allTags	=	[];

(function($){
	$.fn.tags = function(options){

		$('head').append('<link rel="stylesheet" type="text/css" media="all" href="http://cdn.bootstrap-plugins.de/'+version+'/plugins/bootstrap-tags/css/bootstrap-tags.min.css">');

		addTag	=	function(tag, id_group_tags, _input, css_bootstrap_tags, closeIcon){
			if(!tag || tag == '')
			{
				return;
			}

			var id_tag	=	guid();

			$('#'+id_group_tags).append('<span class="'+css_bootstrap_tags+'" id="'+id_tag+'"  data-tag-value="'+tag+'"><span>'+tag+'</span><a href="#" data-id-remove="'+id_tag+'">'+closeIcon+'</a></span>');

			$('#'+id_tag+' a').click(function(e){
				e.preventDefault();

				var datas	=	$(this).data();

				removeTag(datas.idRemove, _input, id_group_tags, css_bootstrap_tags);
			});

			_input.trigger($.Event('addTagElement', {tag: tag}));

			updateTagField(_input, id_group_tags, css_bootstrap_tags);
		};


		removeTag	=	function(id_tag, _input, id_group_tags, css_bootstrap_tags){
			var data	=	$('#'+id_tag).data();
			$('#'+id_tag).remove();

			_input.trigger($.Event('removeTagElement', {tag: data.tagValue}));

			updateTagField(_input, id_group_tags, css_bootstrap_tags);
		};


		updateTagField	=	function(_input, id_group_tags, css_bootstrap_tags){
			var addAll	=	'';

			$('#'+id_group_tags+' .'+css_bootstrap_tags).each(function(){
				addAll	=	addAll+$(this).data().tagValue+',';
			});

			if(addAll)
			{
				addAll	=	addAll.slice(0, -1);
			}

			_input.val(addAll);
		};


		$(this).each(function(){

			var value	=	$(this).val().split(',');

			$(this).hide();

			var _id_group_parent	=	guid();
			var _id_group_tags		=	guid();
			var _id_input			=	guid();
			var input				=	$(this);

			var css_bootstrap_tags_group	=	((options && options.hasOwnProperty('cssBootstrapTagsGroup')) ? options.cssBootstrapTagsGroup : 'bootstrap-tags-group');
			var css_bootstrap_tags			=	((options && options.hasOwnProperty('cssBootstrapTags')) ? options.cssBootstrapTags : 'bootstrap-tags');
			var closeIcon					=	((options && options.hasOwnProperty('closeIcon')) ? options.closeIcon : 'x');


			allTags[_id_group_tags]	=	[];


			$(this).parent().append('<div id="'+_id_group_parent+'">' +
				'	<input type="text" class="form-control" id="'+_id_input+'">' +
				'	<div id="'+_id_group_tags+'" class="'+css_bootstrap_tags_group+'"></div>' +
				'</div>');

			for(var t = -1; ++t < value.length;)
			{
				addTag(value[t].replace(/"/g, '&quot;').trim(), _id_group_tags, input, css_bootstrap_tags, closeIcon);
			}

			$('#'+_id_group_parent+' input').on('keydown', function(e){
				var val	=	$(this).val().replace(/"/g, '&quot;').trim();

				if(val && (e.keyCode == 188 || e.keyCode == 13)) //Komma oder Enter
				{
					e.preventDefault();

					if($('#'+_id_group_tags+' [data-tag-value="'+val+'"]').length == 0)
					{
						addTag(val, _id_group_tags, input, css_bootstrap_tags, closeIcon);
					}

					$(this).val('').focus();
				}
			});

			return $(this);
		});

		return $(this);
	};
}(jQuery));