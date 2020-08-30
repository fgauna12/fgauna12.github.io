/**
 * Main JS file for Horace behaviours
 */
(function ($) {
	"use strict";

	var $body = $('body');

	$(document).ready(function () {

		// Responsive video embeds
		$('.post-content').fitVids();

		// Scroll to top
		$('#top-button').on('click', function (e) {
			$('html, body').animate({
				'scrollTop': 0
			});
			e.preventDefault();
		});

		// Sidebar
		$('#sidebar-show, #sidebar-hide').on('click', function (e) {
			$body.toggleClass('sidebar--opened');
			$(this).blur();
			e.preventDefault();
		});
		$('#site-overlay').on('click', function (e) {
			$body.removeClass('sidebar--opened');
			e.preventDefault();
		});

		// Show comments
		var interval = setInterval(function () {
			var disqusHeight = $('#disqus_thread').height();
			if (disqusHeight > 100) {
				$('#comments-area').addClass('comments--loaded');
				clearInterval(interval);
			}
		}, 100);
		$('#comments-overlay, #comments-show').on('click', function (e) {
			$('#comments-area').removeClass('comments--loaded').addClass('comments--opened');
			e.preventDefault();
		});

	});
	// Get the modal
	var modal = document.getElementById("myModal");

	// Get the button that opens the modal
	var btn = document.getElementById("myBtn");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on the button, open the modal
	btn.onclick = function () {
		modal.style.display = "block";
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	// search 
	var sjs = SimpleJekyllSearch({
		searchInput: document.getElementById('search-input'),
		resultsContainer: document.getElementById('results-container'),
		json: '/search.json',
		searchResultTemplate: '<div class="search-results"><img src="/assets/images/paper.png" alt=""/> <a class="gh-search-item" href="{url}"><h5 class="search-post-title">{title}</h5></a>'
	});

}(jQuery));