'use strict';

window.onunload = function(){};

window.boldthemes_loaded = false;

(function( $ ) {

	function boldthemes_video_resize() {
		$( 'iframe' ).not( '.twitter-tweet' ).each(function() {
			if ( ! $( this ).parent().hasClass( 'boldPhotoBox' ) ) {
				$( this ).css( 'width', '100%' );
				$( this ).css( 'height', $( this ).width() * 9 / 16 );
			}
		});

		$( 'embed' ).each(function() {
			if ( ! $( this ).parent().hasClass( 'boldPhotoBox' ) ) {
				$( this ).css( 'width', '100%' );
				$( this ).css( 'height', $( this ).width() * 9 / 16 );
			}
		});
	}

	jQuery.fn.isOnScreen = function() {
		var element = this.get( 0 );
		if ( element == undefined ) return false;
		var bounds = element.getBoundingClientRect();
		return bounds.top + 75 < window.innerHeight && bounds.bottom > 0;
	}

	$( document ).ready(function() {

		boldthemes_video_resize();

		$( '.widget_archive select option' ).each(function() {
			$( this ).html( $( this ).html().replace( /([\d]+)$/, '($1)' ) );
			$( this ).html( $( this ).html().replace( /^\s/, '' ) );
		});

		$( '.widget_categories select option' ).each(function() {
			$( this ).html( $( this ).html().replace( /\&nbsp;\&nbsp;(\()/, ' $1' ) );
		});

		/* position on screen */

		$( '.no-touch .btSidebar select, .no-touch select.orderby, .no-touch #btSettingsPanelContent select, .no-touch .wpcf7-form select:not([multiple])' ).fancySelect().on( 'change.fs', function() {
			$( this ).trigger( 'change.$' );
		});

		if ( $( '.btGhost' ).length > 0 ) {
			$( 'body' ).append( $( '.btGhost' ) );
			$( 'body' ).addClass( 'btHasGhost' );
		}

		$( '.btQuoteSlider' ).wrap( '<div class="btQuoteWrapper"></div>' );

		$( '.btHasGhost .btGhostSliderThumb a' ).on( 'click', function( e ) {
			e.preventDefault();
			$( '.single-portfolio .btGhost' ).removeClass( 'btRemoveGhost' );
			$( '.btHasGhost .btGhostSliderThumb' ).removeClass( 'btMarkedImage' );
			boldthemes_disable_scroll();
			$( '.btGhost .slick-slider' ).slick( 'slickGoTo', $( this ).closest( '.btGhostSliderThumb' ).data( 'order-num' ) );
		});

		if ( $( window ).scrollTop() > 0 || $( 'html' ).hasClass( 'no-csstransforms3d' ) ) {
			$( '.btGhost' ).addClass( 'btRemoveGhost' );
		}

		window.boldthemes_theme_loaded = false;

		window.boldthemes_disable_scroll = function() {
			window.onmousewheel = document.onmousewheel = function() {
				if ( window.boldthemes_theme_loaded ) {
					$( '.btCloseGhost' ).click();
				}
				if ( ! window.boldthemes_theme_loaded || ! window.boldthemes_theme_allow_scroll ) {
					return false;
				}
			};
			$( window ).on( 'DOMMouseScroll', function( e ) {
				if ( window.boldthemes_theme_loaded ) {
					$( '.btCloseGhost' ).click();
				}
				if ( ! window.boldthemes_theme_loaded || ! window.boldthemes_theme_allow_scroll ) {
					e.preventDefault();
				}
			});
		}

		window.boldthemes_enable_scroll = function() {
			window.onmousewheel = document.onmousewheel = null;
		}

		var articleWithGhost = $( '.btPostOverlay' ).length > 0;

		if ( $( '.btRemoveGhost' ).length == 0 && $( '.btGhost' ).length > 0  ) {
			window.boldthemes_theme_allow_scroll = false;
			boldthemes_disable_scroll();
		}

		$('.btPriceTable').each(function(){
			$(this).closest('.rowItem').addClass('rowItemPriceTable');
		});

		$('.btIconHexagonShape .btIcoHolder').append('<svg viewBox="0 0 110 125" preserveAspectRatio="xMaxYMax meet"><polygon class="hex" points="55,5 105,30 105,95 55,120 5,95 5,30"></polygon></svg>');

    	if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
    		$('body').addClass('ieEleven');
    		$('.fixedSliderHeight .slick-track').each(function(){
    			var goalHeight = $(this).height();
    			$(this).find('.btSliderCell').css('height',goalHeight);
    		});
    	}

		$( '.wpcf7-date' ).on( 'change', function() {
			$( this ).addClass( 'placeholderclass' );
		});

	});

	$( window ).load(function() {
		window.boldthemes_theme_loaded = true;

		// remove preloader
		$( 'body' ).addClass( 'btRemovePreloader' );

		// trigger custom load event
		setTimeout( function() { $( window ).trigger( 'btload' ); window.boldthemes_loaded = true; }, 1000 );

		// gmaps with img overlay
		$( window ).trigger( 'resize' );

	});

	$( window ).resize(function() {
		boldthemes_video_resize();
	});

	/* Animate classic elements */

	function btAnimateRows() {
		var $elems = $( 'body:not(.btPageTransitions) .rowItem.animate:not(.animated), .headline .animate, article.animate' ).not( '.slided .animate' );
		$elems.each(function() {
			var $elm = $( this );
			if (
			( $elm.isOnScreen() && ! $( 'body' ).hasClass( 'impress-enabled' ) ) ||
			( $elm.isOnScreen() && $( 'body' ).hasClass( 'impress-enabled' ) && $elm.closest( '.boldSection' ).hasClass( 'active' ) )
			) {
				$elm.addClass( 'animated' );
			}
		});
	}

	if ( ! $( 'body' ).hasClass( 'impress-enabled' ) ) {
		$( window ).scroll(function() {
			btAnimateRows();
		});
	}

	$( window ).on( 'load', function() {
		btAnimateRows();

		// autoplay
		if ( $( 'li.btAnimNavNext' ).length && $( 'body' ).data( 'autoplay' ) > 0 ) {
			window.boldthemes_autoplay_interval = setInterval( function(){ $( 'li.btAnimNavNext' ).trigger( 'click' ); }, $( 'body' ).data( 'autoplay' ) );
		}
	});

	$( window ).on( 'boldthemes_section_animation_out', function( e, el ) {
		$( el ).find( '.rowItem.animated' ).removeClass( 'animated' );
	});

	$( window ).on( 'boldthemes_section_animation_end', function( e, el ) {
		$( el ).find( '.rowItem.animate' ).addClass( 'animated' );
	});

	$( document ).ready(function() {

		var doc = document.documentElement;
		doc.setAttribute('data-useragent', navigator.userAgent);

		// basic functions

		if ( ! String.prototype.startsWith ) {
			String.prototype.startsWith = function(searchString, position) {
				position = position || 0;
				return this.lastIndexOf(searchString, position) === position;
			};
		}

		if ( ! String.prototype.endsWith ) {
			String.prototype.endsWith = function(searchString, position) {
				var subjectString = this.toString();
				if (position === undefined || position > subjectString.length) {
					position = subjectString.length;
				}
				position -= searchString.length;
				var lastIndex = subjectString.indexOf(searchString, position);
				return lastIndex !== -1 && lastIndex === position;
			};
		}

		/* scroll handlers */

		function scrollPage() {
			var fromTop = $( this ).scrollTop();
			$( '.btCloseGhost' ).click();
		}

		function scrollPageTo( val ) {
			val = parseInt( val );
			$( 'body, html' ).animate({ scrollTop: val + 'px' }, 500 );
		}

		function scrollPageToId(id) {
			if ( $( id ).length == 0 ) return false;
			var topOffset = $( id ).offset().top;
			if ( window.btStickyEnabled && topOffset > window.btStickyOffset ) {
				topOffset -= $( '.mainHeader' ).height();

			}
			$( 'html, body' ).animate({ scrollTop: topOffset }, 500);
		}

		/* init scroll listener */

		window.addEventListener( 'scroll', scrollPage );

		// delay click to allow on page leave screen

		$( document ).on( 'click', 'a', function() {
			if ( ! $( this ).hasClass( 'lightbox' ) && ! $( this ).hasClass( 'add_to_cart_button' ) ) {
				var href = $( this ).attr( 'href' );
				if ( href !== undefined ) {
					if ( location.href == href || ( location.href.split( '#' )[0] != href.split( '#' )[0] && ! href.startsWith( '#' ) && ! href.startsWith( 'mailto' ) && ! href.startsWith( 'callto' ) ) ) {
						if ( $( this ).attr( 'target' ) != '_blank' && ! href.endsWith( '#respond' ) ) {
							if ( $( '#btPreloader' ).length ) {
								$( 'body' ).removeClass( 'btRemovePreloader' );
								setTimeout( function() { window.location = href }, 1500 );
								return false;
							}
						}
					} else if ( href != "#" && ! href.startsWith( 'mailto' ) ) {
						if ( $( this ).parent().parent().attr('class') != 'tabsHeader' ) scrollPageToId( href );
						return false;
					}
				}
			}
		});

		// Vertical alignment fix

		$( '.rowItem.btMiddleVertical, .rowItem.btBottomVertical, .rowItem.btTopVertical' ).parent().parent().addClass( 'btTableRow' );

		/* Footer widgets count and column set */

		$( '#boldSiteFooterWidgetsRow' ).children().addClass( 'rowItem col-md-' + 12 / $( '#boldSiteFooterWidgetsRow' ).children().length + ' col-sm-12' );

		// Gallery slider info bar toggler

		$( '.btGetInfo' ).on( 'click', function () {
			$(this).toggleClass( 'on' ).next().toggleClass( 'open' );
			return false;
		});

		// Close gallery slider

		$( '.btCloseGhost' ).on( 'click', function () {
			if ( ! $( '.btGhost' ).hasClass( 'btRemoveGhost' ) ) {
				$( '.btGhost' ).addClass( 'btRemoveGhost' );
				$( window ).trigger( 'resize' );
				var pos = $( this ).parent().find( '.slick-slider' ).first().slick( 'slickCurrentSlide' );
				var num_slides = $( this ).parent().find( '.slick-slider' ).find( '.slick-slide' ).length;
				var thumbs = $( '.btGridGallery' ).first().find( '.btGhostSliderThumb' );
				if ( thumbs.length > 0 ) {
					var num_thumbs = thumbs.length;
					if ( num_slides > num_thumbs && pos > 0 ) {
						$( thumbs[ pos - 1 ] ).addClass( 'btMarkedImage' );
						$( 'html, body' ).animate({
							scrollTop: $( thumbs[ pos - 1 ] ).offset().top + $( thumbs[ pos - 1 ] ).height() * .5 - window.innerHeight * 0.5
						}, 0 );
					} else if ( num_slides == num_thumbs ) {
						$( thumbs[ pos ] ).addClass( 'btMarkedImage' );
						$( 'html, body' ).animate({
							scrollTop: $( thumbs[ pos ] ).offset().top + $( thumbs[ pos ] ).height() * .5 - window.innerHeight * 0.5
						}, 0 );
					}
				}
				setTimeout( function() { window.boldthemes_theme_allow_scroll = true; $( '.btMarkedImage' ).removeClass( 'btMarkedImage' ) }, 800 );
				return false;
			}
		});

		// magnific-popup grid gallery

		$( '.tilesWall.lightbox' ).each(function() {
			$( this ).find( 'a' ).magnificPopup({
				type: 'image',
				// other options
				gallery:{
					enabled:true
				},
				closeMarkup:'<button class="mfp-close" type="button"><i class="mfp-close-icn">&times;</i></button>',
				image: {
					titleSrc: 'data-title'
				},
				closeBtnInside:false
			});
		});

		// magnific-popup product gallery
		$( 'body.single-product .product .images' ).each(function() {
			$( this ).find( 'a' ).magnificPopup({
				type: 'image',
				// other options
				callbacks: {
					beforeClose: function() {
						var photo = $( this.st.el ).closest( '.bpgPhoto' );
						photo.removeClass( 'out-top' );
						photo.removeClass( 'out-right' );
						photo.removeClass( 'out-bottom' );
						photo.removeClass( 'out-left' );
					}
				},
				gallery:{
					enabled:true
				},
				closeMarkup:'<button class="mfp-close" type="button"><i class="mfp-close-icn">&times;</i></button>',
				image: {
					titleSrc: 'data-title'
				},
				closeBtnInside:false
			});
		});

		if ( window.boldthemes_anim_selector ) {

			$( window ).on( 'btload', function() {
				$( '.btPageWrap' ).append( '<div id="btAnimSelector" class="btDarkSkin"><select id="btFwdAnim"></select><select id="btBckAnim"></select></div>' );

				var anim = [];

				anim[1] = 'Move to left | from right';
				anim[2] = 'Move to right | from left';
				anim[3] = 'Move to top | from bottom';
				anim[4] = 'Move to bottom | from top';
				anim[5] = 'Fade | from right';
				anim[6] = 'Fade | from left';
				anim[7] = 'Fade | from bottom';
				anim[8] = 'Fade | from top';
				anim[9] = 'Fade left | Fade right';
				anim[10] = 'Fade right | Fade left';
				anim[11] = 'Fade top | Fade bottom';
				anim[12] = 'Fade bottom | Fade top';
				anim[13] = 'Different easing | from right';
				anim[14] = 'Different easing | from left';
				anim[15] = 'Different easing | from bottom';
				anim[16] = 'Different easing | from top';
				anim[17] = 'Scale down | from right';
				anim[18] = 'Scale down | from left';
				anim[19] = 'Scale down | from bottom';
				anim[20] = 'Scale down | from top';
				anim[21] = 'Scale down | scale down';
				anim[22] = 'Scale up | scale up';
				anim[23] = 'Move to left | scale up';
				anim[24] = 'Move to right | scale up';
				anim[25] = 'Move to top | scale up';
				anim[26] = 'Move to bottom | scale up';
				anim[27] = 'Scale down | scale up';
				anim[28] = 'Glue left | from right';
				anim[29] = 'Glue right | from left';
				anim[30] = 'Glue bottom | from top';
				anim[31] = 'Glue top | from bottom';
				anim[32] = 'Flip right';
				anim[33] = 'Flip left';
				anim[34] = 'Flip top';
				anim[35] = 'Flip bottom';
				anim[36] = 'Rotate fall';
				anim[37] = 'Rotate newspaper';
				anim[38] = 'Push left | from right';
				anim[39] = 'Push right | from left';
				anim[40] = 'Push top | from bottom';
				anim[41] = 'Push bottom | from top';
				anim[42] = 'Push left | pull right';
				anim[43] = 'Push right | pull left';
				anim[44] = 'Push top | pull bottom';
				anim[45] = 'Push bottom | pull top';
				anim[46] = 'Fold left | from right';
				anim[47] = 'Fold right | from left';
				anim[48] = 'Fold top | from bottom';
				anim[49] = 'Fold bottom | from top';
				anim[50] = 'Move to right | unfold left';
				anim[51] = 'Move to left | unfold right';
				anim[52] = 'Move to bottom | unfold top';
				anim[53] = 'Move to top | unfold bottom';
				anim[54] = 'Room to left';
				anim[55] = 'Room to right';
				anim[56] = 'Room to top';
				anim[57] = 'Room to bottom';
				anim[58] = 'Cube to left';
				anim[59] = 'Cube to right';
				anim[60] = 'Cube to top';
				anim[61] = 'Cube to bottom';
				anim[62] = 'Carousel to left';
				anim[63] = 'Carousel to right';
				anim[64] = 'Carousel to top';
				anim[65] = 'Carousel to bottom';
				anim[66] = 'Sides';

				if ( $('body.btHalfPage').length ) {
					var titleLeft = 'Select left animation';
					var titleRight = 'Select right animation';
				} else {
					var titleLeft = 'Select forward animation';
					var titleRight = 'Select backward animation';
				}

				$( '#btAnimSelector #btFwdAnim' ).append( '<option value="">' + titleLeft + '</option>' );
				$( '#btAnimSelector #btBckAnim' ).append( '<option value="">' + titleRight + '</option>' );

				for ( var i = 1; i < anim.length; i++ ) {
					$( '#btAnimSelector #btFwdAnim' ).append( '<option value="' + i + '">' + anim[ i ] + '</option>' );
					$( '#btAnimSelector #btBckAnim' ).append( '<option value="' + i + '">' + anim[ i ] + '</option>' );
				}

				$( '#btAnimSelector #btFwdAnim' ).on( 'change', function( e ) {
					var val = $( this ).val();
					var $pages = $( 'section.btSectionTransitions' );
					$pages.each( function() {
						$( this ).data( 'animation', val );
					});
					$( '.btAnimNavNext' ).trigger( 'click' );
				});

				$( '#btAnimSelector #btBckAnim' ).on( 'change', function( e ) {
					var val = $( this ).val();
					var $pages = $( 'section.btSectionTransitions' );
					$pages.each( function() {
						$( this ).data( 'animation-back', val );
					});
					$( '.btAnimNavPrev' ).trigger( 'click' );
				});

				$( '.no-touch #btAnimSelector select' ).fancySelect().on('change.fs', function() {
					$(this).trigger('change.$');
				});

				setTimeout( function() { $( 'body' ).addClass( 'btShowAnimSelector' ); }, 10 );
			});

		}

	});



})( jQuery );

function boldthemes_swipedetect( el, callback ) {

	var touchsurface = el,
	swipedir,
	startX,
	startY,
	distX,
	distY,
	threshold = 150, //required min distance traveled to be considered swipe
	restraint = 100, // maximum distance allowed at the same time in perpendicular direction
	allowedTime = 300, // maximum time allowed to travel that distance
	elapsedTime,
	startTime,
	handleswipe = callback || function( swipedir ) {}

	touchsurface.addEventListener( 'touchstart', function( e ) {
		var touchobj = e.changedTouches[0];
		swipedir = 'none';
		startX = touchobj.pageX;
		startY = touchobj.pageY;
		startTime = new Date().getTime(); // record time when finger first makes contact with surface
	}, false );

	touchsurface.addEventListener( 'touchmove', function( e ) {

	}, false );

	touchsurface.addEventListener( 'touchend', function( e ) {
		var touchobj = e.changedTouches[0];
		distX = touchobj.pageX - startX;// get horizontal dist traveled by finger while in contact with surface
		distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface

		elapsedTime = new Date().getTime() - startTime; // get time elapsed
		if ( elapsedTime <= allowedTime ) { // first condition for awipe met
			if ( Math.abs( distX ) >= threshold && Math.abs( distY ) <= restraint ) { // 2nd condition for horizontal swipe met
				swipedir = ( distX < 0 ) ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
			} else if ( Math.abs( distY ) >= threshold && Math.abs( distX ) <= restraint ) { // 2nd condition for vertical swipe met
				swipedir = ( distY < 0 ) ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
			}
		}

		handleswipe( swipedir );

	}, false );
}

function bt_refresh_cart() {
	jQuery( '.btCartWidgetIcon' ).unbind('click').on( 'click', function ( e ) {
		jQuery(this).parent().parent().toggleClass( 'on' );
		jQuery('body').toggleClass( 'btCartDropdownOn' );
	});
	jQuery('.verticalMenuCartToggler').unbind('click').on( 'click', function(){
		jQuery(this).closest('.widget_shopping_cart_content').removeClass('on');
		jQuery('body').removeClass('.btCartDropdownOn');
	});
}
