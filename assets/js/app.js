jQuery(document).ready(function($) {
	var $tabelas = $('table');

	$tabelas.each(function(index, el) {
		var $clonethead = $(el).find('caption, thead').clone();
		var $replicathead = $('<table></table>').append($clonethead);
		$replicathead.addClass('thead-fixo');
		$(el).after($replicathead);
	});

	var $theadsFixos = $('.thead-fixo');
	var posicoesTabelas = [];
	var posicionarTheadsFixo = function(){
		console.log('reposicionado');
		$tabelas.each(function(index, el) {
			var $tableEquiv = $theadsFixos.eq(index);
			var $theadEquiv = $tableEquiv.children('thead');
			var $theadEquivChildren = $theadEquiv.find('*');
			
			$(el).children('thead').find('*').each(function(id2, el2) {
				$theadEquivChildren.eq(id2).css('width', $(el2).css('width'));
			});

			$tableEquiv.css('left', $(el).offset().left);

			posicoesTabelas[index] = {
				'inicio': $(el).offset().top,
				'fim': $(el).offset().top + $(el).height() - $tableEquiv.height()
			}
		});
	}

	var timeOutResize;

	$(window).on('resize', function(event) {
		clearTimeout(timeOutResize);
		timeOutResize = setTimeout(posicionarTheadsFixo, 300);
	});

	$(window).on('scroll', function(event) {
		var thisScroll = $(this).scrollTop();
		for (var i = 0; i < posicoesTabelas.length; i++) {
			if (thisScroll >= posicoesTabelas[i]['inicio'] && thisScroll <= posicoesTabelas[i]['fim']) {
				$theadsFixos.eq(i).addClass('db');
			} else{
				$theadsFixos.eq(i).removeClass('db');
			}
		}
		
	});

	posicionarTheadsFixo();
	$(window).on('load', posicionarTheadsFixo);
});