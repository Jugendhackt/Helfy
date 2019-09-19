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

var selectedIndex	=	[];
var selectedElement	=	[];
var version			=	"v1.1";

(function ($){
	$.fn.combobox	=	function(options){

		drawOptions	=	function(_id_e, listElement, _showOptions, inputId){
			var appendList	=	'<div style="width: '+listElement.parent().parent().width()+'px;" class="list-group bootstrap-combobox-list-group" id="'+_id_e+'_list">';

			if(_showOptions.length > 0)
			{
				for(var z = -1; ++z < _showOptions.length;)
				{
					var _option	=	_showOptions[z];

					appendList	+=	'<a href="javascript:void(0)" class="list-group-item bootstrap-combobox-list-group-item" data-value="'+_option['value']+'" data-label="'+_option['label_org']+'" data-field-id="'+_id_e+'">'+_option['label']+'</a>';
				}

			}
			else
			{
				appendList	+=	'<span class="list-group-item">'+notFound+'</span>';
			}

			appendList	+=	'</div>';

			listElement.parent().parent().append(appendList);

			$('#'+inputId).trigger($.Event('openDropDownList'));

			$('.bootstrap-combobox-list-group-item').click(function(){
				var data			=	$(this).data();
				var selectInput		=	$('#'+_id_e);

				selectedElement[_id_e]	=	data.value;

				$('#'+data.fieldId).val(data.label);

				selectInput.val(data.label);

				$('#'+inputId+' option[value="'+data.value+'"]').attr('selected', 'selected');

				$('#'+inputId).trigger($.Event('selectDropDownListItem', {value: data.value}));

				removeList(_id_e+'_list', _id_e, inputId);
			});
		};


		getAllOptions	=	function(_val, _allOptions){
			var back	=	[];
			var regex	=	new RegExp('('+_val+')', 'gi');

			for(var t = -1; ++t < _allOptions.length;)
			{
				var option			=	_allOptions[t];
				var option_label	=	option.label;

				var res		=	option_label.match(regex);

				if((res && res.length > 0) || _val == null)
				{
					if(res && res.length > 0)
					{
						option_label	=	option_label.replace(regex, '<strong>$1</strong>');
					}

					var addItem				=	[];
					addItem['label']		=	option_label;
					addItem['label_org']	=	option.label;
					addItem['value']		=	option.value;

					back.push(addItem);
				}
			}

			return back;
		};

		removeList	=	function(_id_element_list, _id_element, _id_input){
			selectedIndex[_id_element]		=	-1;
			selectedElement[_id_element]	=	null;

			$('#'+_id_element_list).remove();

			$('#'+_id_input).trigger($.Event('closeDropDownList'));
		};

		var arrow		=	((options && options.hasOwnProperty('arrow')) ? options.arrow : '⬇');
		var notFound	=	((options && options.hasOwnProperty('nothing_found_message')) ? options.nothing_found_message : 'Nothing found');

		$('head').append('<link rel="stylesheet" type="text/css" media="all" href="http://cdn.bootstrap-plugins.de/'+version+'/plugins/bootstrap-combobox/css/bootstrap-combobox.min.css">');


		//Alle Selects durchgehen
		$(this).each(function(){

			var selectInput	=	$(this);
			selectInput.hide();
			selectInput.css('position', 'relative');

			if(!selectInput.attr('id'))
			{
				selectInput.attr('id', guid());
			}

			var id_boostrap_combobox	=	guid();
			var id_element				=	guid();
			var id_arrow				=	guid();
			var id_input				=	selectInput.attr('id');
			var element_val				=	selectInput.val();

			selectedElement[id_element]	=	null;
			selectedIndex[id_element]	=	-1;

			var val;
			var id_e;

			var appendElement	=	'' +
			'<div class="input-group bootstrap-combobox" id="'+id_boostrap_combobox+'">'+
			'	<input type="text" value="'+element_val+'" id="'+id_element+'" data-id-input="'+id_input+'" class="form-control" aria-describedby="'+id_arrow+'" class="bootstrap-combobox">'+
			'	<span class="input-group-addon bootstrap-combobox-addon" data-id-input="'+id_input+'" data-id-element="'+id_element+'" id="'+id_arrow+'">'+arrow+'︎︎</span>'+
			'</div>';

			selectInput.parent().append(appendElement);

			$('#'+id_arrow).click(function(){

				var data		=	$(this).data();
				var id_element	=	data.idElement;
				var allOptions	=	$('#'+data.idInput).find('option');

				if($('#'+id_element+'_list').length > 0)
				{
					removeList(id_element+'_list', id_element, data.idInput);
				}
				else
				{
					var showOptions		=	getAllOptions(null, allOptions);
					drawOptions(id_element, $('#'+id_element), showOptions, data.idInput);
				}
			});

			$('#'+id_element).on('input', function(){

				var data		=	$(this).data();
				var id_input	=	data.idInput;
				var allOptions	=	$('#'+id_input).find('option');
				val				=	$(this).val();
				id_e			=	$(this).attr('id');

				$('#'+selectInput.attr('id')+' option:selected').removeAttr("selected");
				$('#'+selectInput.attr('id')+' option[value="'+val+'"]').attr('selected', 'selected');

				removeList(id_e+'_list', id_e, id_input);

				if(!val)
				{
					return;
				}

				var showOptions		=	getAllOptions(val, allOptions);

				drawOptions(id_e, $(this), showOptions, id_input);

			}).on('keydown', function(evt){

				val				=	$(this).val();
				id_e			=	$(this).attr('id');

				if((evt.which == 40 || evt.which == 38) && $('#'+id_e+'_list').length > 0) // Pfeil nach oben oder unten
				{
					var element2;

					$('#'+id_e+'_list a.bootstrap-combobox-list-group-item').each(function(i, el){

						if(selectedIndex[id_e] == i)
						{
							$(this).removeClass('active');
						}

						if(evt.which == 40) // Nach unten
						{
							if((selectedIndex[id_e] + 1) == i)
							{
								element2	=	$(this);
							}
						}
						else
						{
							if((selectedIndex[id_e] - 1) == i)
							{
								element2	=	$(this);
							}
						}
					});

					if(element2)
					{
						if(evt.which == 40) // Nach unten
						{
							++selectedIndex[id_e];
						}
						else
						{
							--selectedIndex[id_e];
						}
					}

					if(element2)
					{
						element2.addClass('active');

						$('#'+id_e+'_list').scrollTop($('#'+id_e+'_list').scrollTop() + element2.position().top - $('#'+id_e+'_list').height() + element2.height() + 40);

						selectedElement[id_e]	=	element2;
					}
				}
				else if(evt.which == 40 && $('#'+id_e+'_list').length == 0)
				{
					var data		=	$(this).data();
					var id_input	=	data.idInput;
					var allOptions	=	$('#'+id_input).find('option');

					var showOptions		=	getAllOptions(null, allOptions);
					drawOptions(id_e, $('#'+id_e), showOptions, id_input);
				}
				else if(evt.which == 13 && selectedIndex[id_e] >= 0) // Enter
				{
					evt.preventDefault();
					selectedElement[id_e].click();
				}
			});

			return $(this);
		});

		return $(this);
	};
}(jQuery));