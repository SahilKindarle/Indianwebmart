(function( $ ) {

	'use strict';

	var verticalMenuScroll = null;

	$( document ).ready(function() {

		var hasCentralMenu = $( 'body' ).hasClass( 'btMenuCenterEnabled' );
		var verticalMenuEnabled = $( 'body' ).hasClass( 'btMenuVerticalLeftEnabled' ) || $( 'body' ).hasClass( 'btMenuVerticalRightEnabled' );

		var belowMenu = $( 'body' ).hasClass( 'btBelowMenu' );
		var touchDevice = $( 'html' ).hasClass( 'touch' );
		window.btStickyEnabled = $( 'body' ).hasClass( 'btStickyEnabled' );
		window.btStickyOffset = 250;
		var swapHeaderStyle = belowMenu && window.btStickyEnabled && ( $( '.btAltLogo' ).length > 0 || $( '.btTextLogo' ).length > 0 ); // If alt logo exists we will swap header skin

		var skinToSwap = $( 'body' ).hasClass( 'btDarkSkin' ) ? "btLightSkin" : "btDarkSkin";
		$( '.btPageWrap .btAltLogo' ).hide( );
		$( '.btPageWrap .btMainLogo' ).show( );

		if ( ! $( '.logo img' ).length ) {
			$( '.logo' ).addClass( 'boldthemes_logo_text' );
		}

		function divide_menu() {
			if ( ! hasCentralMenu || $( '.rightNav' ).length > 0 ) return false;
			var logoWidth = $( '.logo' ).height() * $( '.logo .btMainLogo' ).data( 'hw' );
			if ( $( '.boldthemes_logo_text' ).length ) {
				logoWidth = $( '.boldthemes_logo_text' ).width();
			}
			$( '.menuPort nav' ).addClass( 'leftNav' );
			$( '.menuPort' ).append( '<nav class="rightNav"><ul></ul></nav>' );
			var halfItems = Math.ceil( $( '.menuPort nav.leftNav ul>li:not(li li)' ).length * .5 );
			$( '.menuPort nav.rightNav > ul' ).append( $( '.menuPort nav.leftNav > ul > li' ).slice ( halfItems ) );
			$( '.menuPort nav.leftNav > ul > li' ).slice( halfItems ).remove();

			$( '.logo' ).css( 'transform', 'translateX(' + Math.round(-logoWidth * .5) + 'px)' );
			$( '.menuPort nav.leftNav' ).css( 'margin-right', Math.round(logoWidth * .5) + 'px' );
			$( '.menuPort nav.rightNav' ).css( 'margin-left', Math.round(logoWidth * .5) + 'px' );
		}

		function undivide_menu() {
			if ( ! hasCentralMenu || $( '.rightNav' ).length == 0 ) return false;
			$( '.menuPort nav.leftNav>ul' ).append( $( '.menuPort nav.rightNav>ul>li' ) );
			$( '.menuPort nav.rightNav' ).remove();
			$( '.menuPort nav.leftNav' ).removeAttr( 'style' );
			$( '.menuPort nav' ).removeClass( 'leftNav' );
			$( '.logo' ).css( 'transform', '' );

		}

		/* Vertical menu setup */

		function init_menu() {
			if ( verticalMenuEnabled ) {
				if ( $( 'body' ).hasClass( 'btMenuVerticalLeftEnabled' )) $( 'body' ).addClass( 'btMenuVerticalLeft btMenuVertical' );
				if ( $( 'body' ).hasClass( 'btMenuVerticalRightEnabled' )) $( 'body' ).addClass( 'btMenuVerticalRight btMenuVertical' );
				move_menu_to_vertical();
			} else {
				$( 'body' ).removeClass( 'btMenuVerticalLeft btMenuVerticalRight btMenuVertical btMenuVerticalOn' );
				if ( $( 'body' ).hasClass( 'btMenuRightEnabled' )) $( 'body' ).addClass( 'btMenuRight btMenuHorizontal' );
				if ( $( 'body' ).hasClass( 'btMenuLeftEnabled' )) $( 'body' ).addClass( 'btMenuLeft btMenuHorizontal' );
				if ( $( 'body' ).hasClass( 'btMenuCenterEnabled' )) $( 'body' ).addClass( 'btMenuCenter btMenuHorizontal' );
			}

		}

		function move_menu_to_vertical() {
			$( '.menuPort' ).prependTo( 'body' );
			$( '.mainHeader .logo' ).clone().prependTo( '.menuPort' );
			$( '.menuPort' ).prepend( '<div class="btCloseVertical"></div>');
			$( '.btCloseVertical' ).unbind('click');
			$( '.btCloseVertical' ).on( 'click', function() {
				$( 'body' ).toggleClass( 'btMenuVerticalOn' );
			});

			$( '.mainHeader .topBar' ).appendTo( '.menuPort' );
			$( '.mainHeader .topBarInLogoArea' ).appendTo( '.menuPort' );

			$( 'body' ).removeClass( 'btStickyHeaderActive' );
			$( 'li.current-menu-ancestor:not(.on)').each(function() {
				$( this ).find( '.subToggler' ).toggle( 'click' );
			});

			// Vertical Menu Desktop Scroll

			$( '.btMenuVertical .menuPort' ).wrapInner( '<div class="menuScrollPort"></div>' );

			if ( $( 'body' ).hasClass( 'btMenuVertical' ) && $( 'html' ).hasClass( 'no-touch' ) ) {

				if ( verticalMenuScroll === null ) {
					verticalMenuScroll = new IScroll( '.no-touch .btMenuVertical .menuPort', {
						scrollbars: true,
						mouseWheel: true,
						click: true,
						interactiveScrollbars: true,
						shrinkScrollbars: 'scale',
						fadeScrollbars: true
					});
				}
			}
		}

		function reset_menu_to_original() {

			$('.menuPort .menuScrollPort').contents().unwrap();
			$('.iScrollVerticalScrollbar, .menuScrollPort').remove();
			verticalMenuScroll = null;

			init_menu();

			$( '.menuPort .sub-menu' ).removeAttr( 'style' );

			$( 'body > .menuPort .logo' ).remove();
			$( 'body > .menuPort .btCloseVertical' ).unbind('click');
			$( 'body > .menuPort .btCloseVertical' ).remove();

			if( $('.btBelowLogoArea').length == 0 ) {
				$( '.menuPort' ).appendTo( '.btLogoArea' );
			} else {
				$( '.menuPort' ).appendTo( '.btBelowLogoArea' );
			}
			$( '.menuPort .topBar' ).prependTo( '.mainHeader > .port' );
			$( '.mainHeader .topBarInLogoArea' ).insertAfter( '.mainHeader .logo' );

			$( 'body' ).removeClass( 'btStickyHeaderActive' );
			divide_menu();
		}

		/* activate sticky */

		window.boldthemes_activate_sticky = function() {
			var fromTop = $( window ).scrollTop();
			if ( window.btStickyEnabled ) {
				if ( fromTop > window.btStickyOffset ) {
					if ( $('body').hasClass('btStickyHeaderActive') ) return false;
					$( 'body' ).addClass( 'btStickyHeaderActive' );
					if ( hasCentralMenu ) {
						var logoWidth = $( '.logo' ).height() * $( '.logo .btMainLogo' ).data( 'hw' );
						if ( $( '.boldthemes_logo_text' ).length ) {
							logoWidth = $( '.boldthemes_logo_text' ).width();
						}
						$( '.logo' ).css( 'transform', 'translateX(' + Math.round(-logoWidth * .5) + 'px)' );
						$( '.menuPort nav.leftNav' ).css( 'margin-right', Math.round(logoWidth * .5) + 'px' );
						$( '.menuPort nav.rightNav' ).css( 'margin-left', Math.round(logoWidth * .5) + 'px' );
					}

					if( swapHeaderStyle ) {
						$( '.mainHeader' ).removeClass( skinToSwap );
						$( '.btPageWrap .btAltLogo' ).hide( );
						$( '.btPageWrap .btMainLogo' ).show( );
					}
					setTimeout( function() { $( 'body' ).addClass( 'btStickyHeaderOpen' ) }, 20 );
				} else {
					if ( !$('body').hasClass('btStickyHeaderActive') ) return false;
					$( 'body' ).removeClass( 'btStickyHeaderOpen btStickyHeaderActive' );
					if ( hasCentralMenu ) {
						var logoWidth = $( '.logo' ).height() * $( '.logo .btMainLogo' ).data( 'hw' );
						if ( $( '.boldthemes_logo_text' ).length ) {
							logoWidth = $( '.boldthemes_logo_text' ).width();
						}
						$( '.logo' ).css( 'transform', 'translateX(' + Math.round(-logoWidth * .5) + 'px)' );
						$( '.menuPort nav.leftNav' ).css( 'margin-right', Math.round(logoWidth * .5) + 'px' );
						$( '.menuPort nav.rightNav' ).css( 'margin-left', Math.round(logoWidth * .5) + 'px' );
					}

					if( swapHeaderStyle ) {
						$( '.mainHeader' ).addClass( skinToSwap );
						if ( swapHeaderStyle )	{
							$( '.btPageWrap .btAltLogo' ).show( );
							$( '.btPageWrap .btMainLogo' ).hide( );
						}
					}
				}
				/*undivide_menu();
				divide_menu();*/
			}
		}

		/* Wide menu setup btMenuWideDropdown */

		$( 'li.btMenuWideDropdown' ).addClass(function(){
			return 'btMenuWideDropdownCols-' + $( this ).children( 'ul' ).children( 'li' ).length;
		});

		$( 'li.btMenuWideDropdown' ).each(function() {
			var maxChildItems = 0;
			$( this ).find( '> ul > li > ul' ).each(function( index ) {
				if ( $( this ).children().length > maxChildItems ) {
					maxChildItems = $( this ).children().length;
				}
			});
			$( this ).find( '> ul > li > ul' ).each(function( index ) {
				var bt_menu_base_length = $( this ).children().length;
				if ( bt_menu_base_length < maxChildItems ) {
					for ( var i = 0; i < maxChildItems - bt_menu_base_length; i++ ) {
						$( this ).append( '<li><a class="btEmptyElement">&nbsp;</a></li>' );
					}
				}
			});
		});

		/* Show hide menu */

		$( '.btHorizontalMenuTrigger' ).on( 'click', function () {
			$( '.mainHeader' ).toggleClass( 'btShowMenu' );
			return false;
		});

		/* responsive menu toggler */

		$( '.btVerticalMenuTrigger' ).on( 'click', function () {
			$( 'body' ).toggleClass( 'btMenuVerticalOn' );
			return false;
		});

		/* Top tools search */

		$('.btTopBox .btSearchInner').prependTo('body').addClass( 'btFromTopBox' );

		$( '.btSearch .btIco, .btSearchInnerClose' ).on( 'click', function () {
			$( 'body' ).toggleClass( 'btTopToolsSearchOpen' );
			return false;
		});

		/* Vertical menu setup */

		init_menu();

		/* Load enquire */

		var responsiveResolution = '1023';

		var is_vertical = false;

		if ( $( window ).width() <= responsiveResolution ) {
			if ( ! verticalMenuEnabled ) {
				undivide_menu();
				$( 'body' ).addClass( 'btMenuVerticalLeft btMenuVertical' ).removeClass( 'btMenuLeft btMenuCenter btMenuRight btMenuHorizontal btMenuVerticalRight' );
				move_menu_to_vertical();
				is_vertical = true;
				if ( ! belowMenu ) $( '.btContentWrap' ).css( 'padding-top', $( '.mainHeader' ).height() +'px');
			}
		} else {
			if ( ! verticalMenuEnabled ) {
				reset_menu_to_original();
				if ( ! belowMenu ) $( '.btContentWrap' ).css( 'padding-top', $( '.mainHeader' ).height() +'px');
			}
		}

		setTimeout( function() { $( '.topBar' ).css( 'visibility', 'visible' ); $( '.topBarInLogoArea' ).css( 'visibility', 'visible' ); $( '.menuPort' ).css( 'visibility', 'visible' ); $( '.mainHeader .logo' ).css( 'visibility', 'visible' ); $( '.menuPort .logo' ).css( 'visibility', 'visible' ); }, 100 );

		btModernizr.load([
			//first test need for matchMedia polyfill
			{
				test: window.matchMedia,
				nope: window.BoldThemesURI + '/framework/js/media.match.min.js'
			},
			//and then load enquire
			{
				load : window.BoldThemesURI + '/framework/js/enquire.min.js',
				complete : function() {
					//load supersized if NOT mobile.
					enquire.register( 'screen and (max-width:' + responsiveResolution + 'px)', {
						match: function() {
							/* Force vertical menu */
							if ( ! verticalMenuEnabled ) {
								undivide_menu();
								$( 'body' ).addClass( 'btMenuVerticalLeft btMenuVertical' ).removeClass( 'btMenuLeft btMenuCenter btMenuRight btMenuHorizontal btMenuVerticalRight' );
								if ( ! is_vertical ) move_menu_to_vertical();
								if ( ! belowMenu ) $( '.btContentWrap' ).css( 'padding-top', $( '.mainHeader' ).height() +'px');
							}

						},
						unmatch: function () {
							if ( ! verticalMenuEnabled ) {
								reset_menu_to_original();
								is_vertical = false;
								if ( ! belowMenu ) $( '.btContentWrap' ).css( 'padding-top', $( '.mainHeader' ).height() +'px');
							}

						}
					})
				}
			}
		]);

		/* menu split */

		if ( hasCentralMenu ) divide_menu();

		/* responsive menu sub togglers */
		$( '.menuPort ul ul' ).parent().prepend( '<div class="subToggler"></div>');

		$( '.menuPort ul li' ).on( 'mouseenter mouseleave', function (e) {
			if ( $( 'body' ).hasClass( 'btMenuVertical' ) || $( 'html' ).hasClass( 'touch' ) ) {
				return false;
			}
			e.preventDefault();
			$( this ).siblings().removeClass( 'on' );
			$( this ).toggleClass( 'on' );
		});

		$( 'div.subToggler' ).on( 'click', function(e) {
			var parent = $( this ).parent();
			parent.siblings().removeClass( 'on' );
			parent.toggleClass( 'on' );
			if ( $( 'body' ).hasClass( 'btMenuVertical' ) ) {
				parent.find( 'ul' ).first().slideToggle( 200 );
				setTimeout(function () {
					if ( verticalMenuScroll !== null ) {
						verticalMenuScroll.refresh();
					}
				}, 280 );
			}
			return false;
		});

		// move content bellow menu

		if ( ! belowMenu ) {
			$( '.btContentWrap' ).css( 'padding-top', $( '.mainHeader' ).height() +'px');
		} else {
			if ( swapHeaderStyle ) {
				$( '.mainHeader' ).addClass( skinToSwap );
				$( '.btPageWrap .btAltLogo' ).show();
				$( '.btPageWrap .btMainLogo' ).hide();
			}
		}

	});

	$( window ).on( 'load', function() {

		boldthemes_activate_sticky();
		$( window ).scroll(function(){
			boldthemes_activate_sticky();
		});

	});

})( jQuery );
