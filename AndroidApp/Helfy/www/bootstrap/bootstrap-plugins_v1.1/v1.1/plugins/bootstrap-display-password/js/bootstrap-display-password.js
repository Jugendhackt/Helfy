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

(function($){
    $.fn.display_password	=	function(options){

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

		$(this).each(function(){

			var element							=	$(this);
			var id_password						=	guid();
			var id_password_addon				=	guid();
			var id_password_group				=	guid();
			var password_val					=	element.val();

			$(this).hide();

			$(this).parent().append('<div class="input-group bootstrap-display-password" id="'+id_password_group+'">' +
				'	<input type="password" value="'+password_val+'" class="form-control" id="'+id_password+'">' +
				'	<span style="cursor: pointer;" class="input-group-addon bootstrap-combobox-addon" id="'+id_password_addon+'"><i class="fa fa-eye"></i></span>' +
				'</div>');

			$('#'+id_password).on('input', function(){
				element.val($(this).val());
			});


			$('#'+id_password_addon).click(function(){
				if($('#'+id_password).attr('type') == 'password')
				{
					$(this).html('<i class="fa fa-eye-slash"></i>');
					$('#'+id_password).attr('type', 'text');
					element.trigger($.Event('visiblePassword'));
				}
				else
				{
					$(this).html('<i class="fa fa-eye"></i>');
					$('#'+id_password).attr('type', 'password');
					element.trigger($.Event('invisiblePassword'));
				}

				$('#'+id_password).focus();
			});

			return $(this);
		});

		return $(this);
	}
}(jQuery));