/*
	Story by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Browser fixes.

		// IE: Flexbox min-height bug.
			if (browser.name == 'ie')
				(function() {

					var flexboxFixTimeoutId;

					$window.on('resize.flexbox-fix', function() {

						var $x = $('.fullscreen');

						clearTimeout(flexboxFixTimeoutId);

						flexboxFixTimeoutId = setTimeout(function() {

							if ($x.prop('scrollHeight') > $window.height())
								$x.css('height', 'auto');
							else
								$x.css('height', '100vh');

						}, 250);

					}).triggerHandler('resize.flexbox-fix');

				})();

		// Object fit workaround.
			if (!browser.canUse('object-fit'))
				(function() {

					$('.banner .image, .spotlight .image').each(function() {

						var $this = $(this),
							$img = $this.children('img'),
							positionClass = $this.parent().attr('class').match(/image-position-([a-z]+)/);

						// Set image.
							$this
								.css('background-image', 'url("' + $img.attr('src') + '")')
								.css('background-repeat', 'no-repeat')
								.css('background-size', 'cover');

						// Set position.
							switch (positionClass.length > 1 ? positionClass[1] : '') {

								case 'left':
									$this.css('background-position', 'left');
									break;

								case 'right':
									$this.css('background-position', 'right');
									break;

								default:
								case 'center':
									$this.css('background-position', 'center');
									break;

							}

						// Hide original.
							$img.css('opacity', '0');

					});

				})();

	// Smooth scroll.
		$('.smooth-scroll').scrolly({ speed: 0 });
		$('.smooth-scroll-middle').scrolly({ anchor: 'middle', speed: 0 });

	// Wrapper.
		$wrapper.children()
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			});

	// Items.
		$('.items')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children()
				.wrapInner('<div class="inner"></div>');

	// Gallery.
		$('.gallery')
			.wrapInner('<div class="inner"></div>')
			// Only add arrows for galleries that are NOT the product gallery
			.each(function() {
			  var $gallery = $(this);
			  if (!($gallery.hasClass('style2') && $gallery.hasClass('large') && $gallery.hasClass('lightbox') && $gallery.hasClass('onscroll-fade-in'))) {
			    $gallery.prepend(browser.mobile ? '' : '<div class="forward"></div><div class="backward"></div>');
			  }
			})
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children('.inner')
				//.css('overflow', 'hidden')
				.css('overflow-y', browser.mobile ? 'visible' : 'hidden')
				// Force horizontal scroll for product gallery
				.each(function() {
				  var $parent = $(this).parent('.gallery');
				  if ($parent.hasClass('style2') && $parent.hasClass('large') && $parent.hasClass('lightbox') && $parent.hasClass('onscroll-fade-in')) {
				    $(this).css('overflow-x', 'scroll');
				    // === Auto-scroll for Product Gallery ===
				    var $inner = $(this);
				    var isPaused = false;
				    setInterval(function() {
				      if (!isPaused) {
				        $inner[0].scrollLeft += 1;
				        if ($inner[0].scrollLeft + $inner[0].clientWidth >= $inner[0].scrollWidth - 1) {
				          $inner[0].scrollLeft = 0;
				        }
				      }
				    }, 20);
				    $parent.on('mouseenter', function () { isPaused = true; });
				    $parent.on('mouseleave', function () { isPaused = false; });
				    $inner.on('focusin', function () { isPaused = true; });
				    $inner.on('focusout', function () { isPaused = false; });
				  } else {
				    $(this).css('overflow-x', browser.mobile ? 'scroll' : 'hidden');
				  }
				})
				.scrollLeft(0);

		// Remove mouseover scroll interaction for product gallery only
		$('.gallery').each(function() {
		  var $gallery = $(this);
		  if ($gallery.hasClass('style2') && $gallery.hasClass('large') && $gallery.hasClass('lightbox') && $gallery.hasClass('onscroll-fade-in')) {
		    $gallery.off('mouseenter mouseleave', '.forward, .backward');
		    $gallery.find('.forward, .backward').remove();
		  }
		});

		// Style #2.
			$('.gallery')
				// Only attach wheel and arrow handlers for non-product galleries
				.each(function() {
				  var $gallery = $(this);
				  if (!($gallery.hasClass('style2') && $gallery.hasClass('large') && $gallery.hasClass('lightbox') && $gallery.hasClass('onscroll-fade-in'))) {
				    $gallery
				    .on('wheel', '.inner', function(event) {
				      var $this = $(this),
				        delta = (event.originalEvent.deltaX * 10);
				      if (delta > 0)
				        delta = Math.min(25, delta);
				      else if (delta < 0)
				        delta = Math.max(-25, delta);
				      $this.scrollLeft($this.scrollLeft() + delta);
				    })
				    .on('mouseenter', '.forward, .backward', function(event) {
				      var $this = $(this),
				        $inner = $this.siblings('.inner'),
				        direction = ($this.hasClass('forward') ? 1 : -1);
				      clearInterval(this._gallery_moveIntervalId);
				      this._gallery_moveIntervalId = setInterval(function() {
				        $inner.scrollLeft($inner.scrollLeft() + (5 * direction));
				      }, 10);
				    })
				    .on('mouseleave', '.forward, .backward', function(event) {
				      clearInterval(this._gallery_moveIntervalId);
				    });
				  }
				});

		// Lightbox.
			$('.gallery.lightbox')
				.on('click', 'a', function(event) {

					var $a = $(this),
						$gallery = $a.parents('.gallery'),
						$modal = $gallery.children('.modal'),
						$modalImg = $modal.find('img'),
						href = $a.attr('href');

					// Not an image? Bail.
						if (!href.match(/\.(jpg|gif|png|mp4)$/))
							return;

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Locked? Bail.
						if ($modal[0]._locked)
							return;

					// Lock.
						$modal[0]._locked = true;

					// Set src.
						$modalImg.attr('src', href);

					// Set visible.
						$modal.addClass('visible');

					// Focus.
						$modal.focus();

					// Delay.
						setTimeout(function() {

							// Unlock.
								$modal[0]._locked = false;

						}, 600);

				})
				.on('click', '.modal', function(event) {

					var $modal = $(this),
						$modalImg = $modal.find('img');

					// Locked? Bail.
						if ($modal[0]._locked)
							return;

					// Already hidden? Bail.
						if (!$modal.hasClass('visible'))
							return;

					// Lock.
						$modal[0]._locked = true;

					// Clear visible, loaded.
						$modal
							.removeClass('loaded')

					// Delay.
						setTimeout(function() {

							$modal
								.removeClass('visible')

							setTimeout(function() {

								// Clear src.
									$modalImg.attr('src', '');

								// Unlock.
									$modal[0]._locked = false;

								// Focus.
									$body.focus();

							}, 475);

						}, 125);

				})
				.on('keypress', '.modal', function(event) {

					var $modal = $(this);

					// Escape? Hide modal.
						if (event.keyCode == 27)
							$modal.trigger('click');

				})
				.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
					.find('img')
						.on('load', function(event) {

							var $modalImg = $(this),
								$modal = $modalImg.parents('.modal');

							setTimeout(function() {

								// No longer visible? Bail.
									if (!$modal.hasClass('visible'))
										return;

								// Set loaded.
									$modal.addClass('loaded');

							}, 275);

						});

})(jQuery);

document.addEventListener('DOMContentLoaded', function () {
  const videoElements = document.querySelectorAll('.video-fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
		entry.target.classList.add('is-visible');
        entry.target.play(); // Play the video when it becomes visible
      } else {
		entry.target.classList.remove('is-visible');
        entry.target.pause(); // Pause the video when it leaves the viewport
      }
    });
  }, { threshold: 0.2 });

  videoElements.forEach(video => observer.observe(video));
});

// Navigation Bar Active Link Highlighting
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#main-nav ul li a');

    function changeLinkState() {
        let index = sections.length;

        while(--index && window.scrollY + 70 < sections[index].offsetTop) {} // Adjusted offset for fixed nav

        navLinks.forEach((link) => link.classList.remove('active'));
        
        // Ensure the link to be activated exists
        if (navLinks[index]) {
            navLinks[index].classList.add('active');
        }
    }

    // Initial call to set active link on page load/refresh
    if (sections.length > 0 && navLinks.length > 0) {
        changeLinkState();
        window.addEventListener('scroll', changeLinkState);
    }
});

// Hamburger menu toggle for mobile nav

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger-menu');
  const nav = document.getElementById('main-nav');
  const body = document.body;

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      body.classList.toggle('nav-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close nav when a link is clicked (for mobile UX)
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
});