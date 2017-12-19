jQuery(document).ready(function($) {
	var $tabelas = $('table');

	if ($tabelas.length > 0) {
		$tabelas.each(function(index, el) {
			
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


	var $mosaicos = $('.mosaico');

	if ($mosaicos.length > 0) {
		
		var rodarMosaico = function($mosaicoEscolhido){
			$mosaicoEscolhido.addClass('carregado');

			var $fotosContainer = $mosaicoEscolhido.find('.fotos');
			var $fotosScroller = $fotosContainer.find('.scroller');
			var $fotos = $fotosScroller.children('figure');
			var nFotos = $fotos.length;
			$mosaicoEscolhido.append('<div class="captions"><div class="scroller"></div></div><div class="thumbnails"></div>');
			var $contThumbs = $mosaicoEscolhido.find('.thumbnails');
			var $contCaptions = $mosaicoEscolhido.find('.captions');
			$fotos.each(function(id2, el2) {
				var srcImg = $(el2).find('img').attr('src');
				var txtCaption = $(el2).find('figcaption').html();
				var captionLista = $('<p>'+txtCaption+'</p>');
				var botaoThumb = $('<button style="background-image: url('+srcImg+')"></button>');
				$contThumbs.append(botaoThumb);
				$contCaptions.children('.scroller').append(captionLista);
			});

			var $thumbnails = $contThumbs.children('button');
			var $captions = $contCaptions.find('p');

			$fotosContainer.append('<button></button><button></button>');

			var $btPrev = $fotosContainer.children('button').eq(0);
			var $btNext = $fotosContainer.children('button').eq(1);

			var fotoAtual = 1;

			var trocarSlide = function(){

				console.log('Mosaico ' + ($mosaicos.index($mosaicoEscolhido)+1) + ' está na ' + fotoAtual+ 'ª foto');
				var crossBrowserTransform = function(valor){
					return {
						'-webkit-transform': valor,
						    '-ms-transform': valor,
						        'transform': valor
					};
				}

				var $fotoAtual = $fotos.eq(fotoAtual-1);
				var posFotos = $fotosContainer.width()/2 - $fotoAtual.position().left - $fotoAtual.width()/2;

				var $captionAtual = $captions.eq(fotoAtual-1);
				var posCaptions = $contCaptions.width()/2  - $captionAtual.position().left - $captionAtual.width()/2;

				$fotos.removeClass('atual');
				$fotoAtual.addClass('atual');

				$captions.removeClass('atual');
				$captionAtual.addClass('atual');

				$thumbnails.removeClass('atual').eq(fotoAtual-1).addClass('atual');

				$fotosScroller.css(crossBrowserTransform('translateX('+posFotos+'px)'));
				$contCaptions.children('.scroller').css(crossBrowserTransform('translateX('+posCaptions+'px)'));
				
				
				if (fotoAtual === 1) {
					$btPrev.attr('disabled', 'disabled');
					$btNext.removeAttr('disabled');
				} else if(fotoAtual === nFotos) {
					$btNext.attr('disabled', 'disabled');
					$btPrev.removeAttr('disabled');
				} else{
					$btNext.removeAttr('disabled');
					$btPrev.removeAttr('disabled');
				}
			}

			$btPrev.on('click', function(event) {
				if (fotoAtual > 1) {
					fotoAtual -= 1;
					trocarSlide();
				}
			});

			$btNext.on('click', function(event) {
				if (fotoAtual < nFotos) {
					fotoAtual += 1;
					trocarSlide();
				}
			});

			$thumbnails.on('click', function(event) {
				fotoAtual = $thumbnails.index($(this))+1;
				trocarSlide();
			});

			trocarSlide();
		}

		$mosaicos.each(function(index, el) {
			var $loading = $('<div class="loading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>')
			$(el).append($loading);
			var $esseMosaico = $(el);
			var imgsCarregadas = 0;
			var $imgsMosaico = $(el).find('img');
			var nImgsMosaico = $imgsMosaico.length;

			var imgsForLoadEvent = [];
			$imgsMosaico.each(function(index2, el2) {
				imgsForLoadEvent[index2] = new Image();
				imgsForLoadEvent[index2].src = $(el2).attr('src');
			});

			for (var i = 0; i < imgsForLoadEvent.length; i++) {
				imgsForLoadEvent[i].onload = function(){
					imgsCarregadas += 1;
					if (imgsCarregadas === imgsForLoadEvent.length) {
						$loading.remove();
						rodarMosaico($esseMosaico);
					}
				}
			}
		});

		
	}
});