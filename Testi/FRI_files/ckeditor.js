(function ($) { 

	$(".CKEditorMoreButton").after('<div class="show-more-data"><div class="text">Več</div><div class="image image-h"></div></div>');
	$(".show-more-data").click(function() {
		$(".CKEditorMoreButton").toggle();
		$(this).children(".image").toggleClass("image-h").toggleClass("image-nh");
	});

})(jQuery)