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
var allForms	=	[];

(function ($) {
	$.fn.validator	=	function(){

		getForm	=	function(_element){
			return _element.closest('form');
		}

		addFormEvent	=	function(_form){
			_form.submit(function(e){
				controlAllFields(_form);

				if(_form.find('.has-error').length > 0)
				{
					e.preventDefault();
				}
			});
		};

		controlAllFields	=	function(_form){
			$('[data-control]', '#'+_form.attr('id')).each(function(index){
				controlField($(this));
			});
		};


		controlField	=	function(element){
			var data			=	element.data();
			var name_element	=	element.attr('name');

			element.parent().removeClass('has-error').removeClass('has-success');

			var helpBlock	=	$('#'+name_element+'_help');

			if(helpBlock.length == 0)
			{
				element.parent().append('<span id="'+name_element+'_help" class="help-block">'+data.errorMessage+'</span>');
				helpBlock	=	$('#'+name_element+'_help');
			}

			helpBlock.hide();

			if(element.is(':input'))
			{
				var val			=	element.val();

				if(val == '')
				{
					return;
				}

				var regex;
				var hasError	=	false;

				switch(element.attr('type'))
				{
					case 'text':

						if(data.hasOwnProperty('regex'))
						{
							regex	=	new RegExp(data.regex, 'g');

							if(!regex.test(val))
							{
								hasError	=	true;
							}
						}

						if(data.hasOwnProperty('control'))
						{
							if(data.control == 'creditcard')
							{
								regex	=	/^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;

								if(!regex.test(val))
								{
									hasError	=	true;
								}
							}
						}

					break;
					case 'email':

						regex	=	/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

						if(!regex.test(val))
						{
							hasError	=	true;
						}

					break;
					case 'tel':

						regex	=	/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

						if(!regex.test(val))
						{
							hasError	=	true;
						}

					break;
					case 'url':

						regex	=	/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;

						if(!regex.test(val))
						{
							hasError	=	true;
						}

					break;
				}

				if(data.hasOwnProperty('match'))
				{
					var matchVal	=	$('#'+data.match).val();

					if(matchVal != val)
					{
						hasError	=	true;
					}
				}

				if(hasError)
				{
					helpBlock.show();
					element.parent().addClass('has-error');
				}
				else
				{
					element.parent().addClass('has-success');
					helpBlock.hide();
				}

				if(data.hasOwnProperty('ajax'))
				{
					$.ajax({
						method: "POST",
						url: data.ajax,
						data: {name_element: val},
						dataType: 'json'
					}).done(function(datas){
						element.trigger($.Event('ajaxCallbackSuccess', {datas: datas}));
					}).fail(function(jqXHR, textStatus){
						element.trigger($.Event('ajaxCallbackFail', {error: textStatus}));
					});
				}
			}
		};

		$(this).each(function(){
			var form	=	getForm($(this));
			var formID	=	form.attr('id');

			if(!formID)
			{
				form.attr('id', guid());
				formID	=	form.attr('id');
			}

			if(allForms.indexOf(formID) == -1)
			{
				addFormEvent(form);
				allForms.push(formID);
			}

			$(this).on('change keyup', function(){
				controlField($(this));
			});

			controlField($(this));

			return $(this);
		});

		return $(this);
	}
}(jQuery));