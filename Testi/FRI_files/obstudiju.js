(function ($) { 
	
	$(window).load(function() {
		$(".Sodelovanje .vsebina").each(function() {
			$(this).css("margin-top", "-" + $(this).find(".naslov").outerHeight() + "px");
		});
	});
	
	$(window).resize(function() {
		$(".Sodelovanje .vsebina").each(function() {
			$(this).css("margin-top", "-" + $(this).find(".naslov").outerHeight() + "px");
		});
		
		
	});
	
	$(document).on({
	    mouseenter: function () {
	        if(window.matchMedia("(min-width: 849px)").matches) {
				var tmph = $(this).find(".naslov").outerHeight() + $(this).find(".content").outerHeight();
				$(this).find(".vsebina").css("margin-top", "-" + tmph + "px");
			} else {
				
			}
	    },
	    mouseleave: function () {
	        if(window.matchMedia("(min-width: 849px)").matches) {
				var tmph = $(this).find(".naslov").outerHeight();
				$(this).find(".vsebina").css("margin-top", "-" + tmph + "px");
			} else {
				
			}
	    }
	}, ".Sodelovanje .sodelovanjeSub, .Sodelovanje .sodelovanjeSub-small");
	
	
})(jQuery)