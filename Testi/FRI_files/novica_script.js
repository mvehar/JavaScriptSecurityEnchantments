/**
 *Scripta za stran posamezna novica, nastavi slider spodaj 
 */

var clickedElement = null;
var preImg = null;

$(document).on("click touchstart", ".mail-inline-block .subscribe", function(e) {
	var email = $(this).parent().find(".mail").val();
	var block = $(this);
	if(validateEmail(email)){
        $.ajax({
            type: 'POST',
            url: '/subscribe',
            dataType: 'json', 
            data: {'mail': email },
            success: function(data) {

                block.parent().html("<b>" + Drupal.t("Uspešno ste se prijavili na prejemanje novic!") + "</b>");
            },
            error: function(data) {
                console.log(data);
                block.parent().html(Drupal.t("Pri prijavi je prišlo do napake."));
            }
        });
    } else {
        block.parent().html("<b>" + Drupal.t("Ni pravilen e-mail!") );
    }
});
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$(document).on("click", ".mail-inline-block-unsubscribe .unsubscribe", function(e) {
	var email = $(this).parent().find(".mail").val();
	var block = $(this);
	
	$.ajax({
  		type: 'POST',
      	url: '/unsubscribe',
      	dataType: 'json', 
		data: {'mail': email },
      	success: function(data) {
            block.parent().find(".message").html("<b>" + Drupal.t("Uspešno ste se odjavili iz prejemanja novic.") + "</b>");
     	},
     	error: function(data) {
     		block.parent().find(".message").html(Drupal.t("Pri odjavi je prišlo do napake."));
     	}
	});
});

$("#simplenews-confirm-removal-form").submit(function() {
	$(this).find(".form-actions").html("<span class='success'>Odjava uspešna!</span>");
	
	setTimeout(function(){
		return true;
	}, 2000);
	
	
});

$("#simplenews-confirm-add-form").submit(function() {
	$(this).find(".form-actions").html("<span class='success'>Prijava uspešna!</span>");
	
	setTimeout(function(){
		return true;
	}, 2000);
	
	
});


$(document).ready(function(){
	$(".mail-inline-block .label").text(Drupal.settings.newsletter.text);
	$(".mail-inline-block .subscribe").text(Drupal.settings.newsletter.button_text);
	
	//console.log('novica slider script');


	novicaSlider = $('.news-gallery');
	if(novicaSlider.length){

				
		//console.log('novica slider obstaja');
		novicaSlider.bxSlider({
			nextText : '<img src="/sites/all/themes/fri_theme/images/novica-slider-right.png" />',
			prevText : '<img src="/sites/all/themes/fri_theme/images/novica-slider-left.png"/>',
			infiniteLoop: true,
	        //auto: true,
	        preloadImages: 'all',
	        randomStart: false,
	        slideWidth: 180,
	        maxSlides: 4,
	        slideMargin: 30,
	        moveSlides: 1,
	        pager:false	
		});
	}
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
   
    $(".news-image-popup .close").click(function(e){
        
        $(".news-image-popup").removeClass("news-image-popup-show");
        
    });
    $(".news-image-popup .right").click(function(){
        if(clickedElement != null){
            var srcSLika = clickedElement.parent().next().find("img").attr("src");
            
            var error_img = false;
            if (typeof srcSLika == 'undefined'){
                srcSLika = clickedElement.parent().parent().children("li").first().find("img").attr("src");
                
                clickedElement =clickedElement.parent().parent().children("li").first().find("img");
                error_img = true;
            }
            
            $(".news-image-popup").find("img").attr("src", srcSLika);
            clickedElement = clickedElement.parent().next().find("img");
            
            
            
        }
    });
    $(".news-image-popup .left").click(function(){
        if(clickedElement != null){
            var srcSLika = clickedElement.parent().prev().find("img").attr("src");
            var error_img = false;
            if (typeof srcSLika == 'undefined'){
                srcSLika = clickedElement.parent().parent().children("li").last().find("img").attr("src");
                clickedElement = clickedElement.parent().parent().children("li").last().find("img");
                error_img = true;
            }
            
            $(".news-image-popup").find("img").attr("src", srcSLika);
            clickedElement = clickedElement.parent().prev().find("img");
            
        }
    });
    
});
$(document).on("click", ".news-gallery img", function(e){
   if( e.target != this ) 
       return;
    clickedElement = $(this);
    var pot = $(this).attr("src");
    $(".news-image-popup").addClass("news-image-popup-show");
    $(".news-image-popup").find("img").attr("src", pot);
});
