jQuery(document).ready(function($) {
	var $tabelas = $('table');

	if ($tabelas.length > 0) {
		$tabelas.each(function(index, el) {

			// adicionando a paginacao para tabelas gigantescas.

			var nMaxRows = 50; // Numero maximo de linhas por 'pagina'
			var nMinRowsPag = 20; // Uma pagina tem que ter no minimo esse numero de itens, caso contrario ela se mescla a anterior.
			var $rows = $(el).find('tbody > tr');
			var nRows = $rows.length;

			if ( nRows > Math.floor(nMaxRows + nMinRowsPag) ) {
				var nPaginas = Math.floor(nRows / nMaxRows);
				if ( nRows % nMaxRows > nMinRowsPag ) {
					nPaginas += 1;
				}
				$rows.addClass('dn').slice(0, nMaxRows).removeClass('dn');

				// var colspanPags = 0;
				// $rows.each(function(id2, el2) {
				// 	$(el2).children().each(function(id3, el3) {
				// 		if ($(el3).attr('attribute', 'value');) {}
				// 	});
				// });
				

				$(el).find('thead').append('<tr class="paginacao"><th colspan="30"></th></tr>');
				var $containerPags = $(el).find('thead tr.paginacao th');
				var htmlPags = []
				for (var i = 0; i < nPaginas; i++) {
					htmlPags.push('<a href="#">'+(i+1)+'</a>');
				}
				$containerPags.append(htmlPags.join(''));
			}
			
			// Replicando o thead de cada tabela para se tornar o head fixo.
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

		var dimensoesCorpo = [];
		dimensoesCorpo.push($('body').width());
		dimensoesCorpo.push($('body').height());
		
		var checarTamanhoBody = function(){
			var mudou = false;
			if ($('body').width() != dimensoesCorpo[0]) {
				dimensoesCorpo[0] = $('body').width();
				mudou = true;
			}

			if ($('body').height() != dimensoesCorpo[1]) {
				dimensoesCorpo[1] = $('body').height();
				mudou = true;
			}

			if (mudou === true) {
				posicionarTheadsFixo();
			}
		}
		setInterval(checarTamanhoBody, 5000);
	}

	






	var $sumario = $('#sumario');
	var $btsumario = $sumario.find('.btsumario');
	var $htmlECorpo = $('html, body');

	var abreFechaSumario = function(abreOuFecha){
		if (abreOuFecha === 'abre') {
			$sumario.addClass('visivel');
			$htmlECorpo.addClass('blockscroll');

		} else if(abreFechaSumario === 'fecha'){
			$sumario.removeClass('visivel pode-ser-fechado segundo-menu').find('.itens').stop().animate({'scrollTop' : 0}, 400);
			$htmlECorpo.removeClass('blockscroll');

		} else{

			if ($sumario.hasClass('visivel')) {
				$sumario.removeClass('visivel pode-ser-fechado segundo-menu').find('.itens').stop().animate({'scrollTop' : 0}, 400);
				$htmlECorpo.removeClass('blockscroll');

			} else{
				$sumario.addClass('visivel');
				$htmlECorpo.addClass('blockscroll');
			}
		}
	}

	$btsumario.on('click', function(event) {
		abreFechaSumario();
	});

	$sumario.find('.submenu').on('click', function(event) {
		event.preventDefault();
		$sumario.addClass('segundo-menu');
	});

	$sumario.find('.backmenu').on('click', function(event) {
		event.preventDefault();
		$sumario.removeClass('segundo-menu');
	});

	var transitionendPrefixed = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';

	$sumario.on(transitionendPrefixed, function(event) {

		if ($(this).is(event.target)) {
			if ($(this).hasClass('visivel') ) {
				$(this).addClass('pode-ser-fechado');
			}

			$(this).removeClass('segundo-menu').find('.itens').scrollTop(0);
		}
	});

	$('html').on('click', function(event) {
		if ($sumario.hasClass('pode-ser-fechado') && $(event.target).closest('#sumario').length === 0){
			abreFechaSumario('fecha');
		}
	});

	$(window).on('keyup', function(event) {
		if (event.which === 27) {
			if ($sumario.hasClass('pode-ser-fechado')) {
				abreFechaSumario('fecha');
			}
		}
	});


	// notas de rodapé
	var html = $('html')
	var corpo = $('body');
	var btRodape = $('button.botao-rodape');
	var notasRodape = $('.nota-rodape');

	var transitionendPrefixed = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';
	notasRodape.each(function(index, el) {
		$(el).prepend('\
			<button class=\'fechar\' title=\'Fechar nota de rodapé\'>\
			</button>');

		$(el).find('.fechar').on('click', function(event) {
			$(el).addClass('easing-saida');
			notasRodape.removeClass('visivel');
			btRodape.removeClass('ativado');
			rodapeAtual = 0;
		});

		$(el).on(transitionendPrefixed, function(event) {
			if (!$(this).hasClass('visivel')) {
				$(this).removeClass('db easing-saida');
			}
		});
	});

	var rodapeAtual = 0;

	var rodapeAtual = 0;

	btRodape.on('click', function(event) {
		var thisNumero = parseInt($(this).attr('data-numero'));
		if (thisNumero !== rodapeAtual) {
			var thisTop = $(this).offset().top;
			var thisLeft = $(this).offset().left;
			var thisHeight = $(this).outerHeight();
			notasRodape.filter('[data-numero=\''+rodapeAtual+'\']').addClass('easing-saida');
			notasRodape.removeClass('visivel');
			var notaRevelar = notasRodape.filter('[data-numero=\'' + thisNumero + '\']');
			notaRevelar.addClass('db');
			notaRevelar.css({
				'top': '',
				'left': ''
			});

			var topNota = (function(){
				var topCalculado = thisTop - notaRevelar.outerHeight();
				if (topCalculado > 0) {
					notaRevelar.removeClass('origem-top');
					return thisTop - notaRevelar.outerHeight();
				} else{
					notaRevelar.addClass('origem-top');
					return thisTop + thisHeight;
				}
			})();

			var leftNota = (function(){
				var leftCalculado = thisLeft - notaRevelar.outerWidth()/2;
				if (leftCalculado < 0) {
					return 0;
				} else if(leftCalculado + notaRevelar.outerWidth() > corpo.width() ){
					return corpo.width() - notaRevelar.outerWidth();
				} else{
					return leftCalculado;
				}
			})();
			btRodape.removeClass('ativado');
			$(this).addClass('ativado');
			notaRevelar.css({
				'top': topNota,
				'left': leftNota
			}).addClass('visivel');


			if (topNota < html.scrollTop()) {
				html.animate({'scrollTop' : topNota}, 200);
			}

			rodapeAtual = thisNumero;
		}
	});

	
});