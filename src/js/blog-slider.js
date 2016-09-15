;(function blogSlider() {
	$(document).ready(function(){
		$(".owl-carousel").owlCarousel({
			nav:true,
			navText: [
			'<span class="glyphicon" aria-hidden="true"></span>',
			'<span class="glyphicon" aria-hidden="true"></span>'
			],
			margin: 30,
			responsive:{
				0:{
					items:1
				},
				380:{
					items:2
				},
				600:{
					items:3
				},
				1000:{
					items:4
				}
			}
		});
	});
})();