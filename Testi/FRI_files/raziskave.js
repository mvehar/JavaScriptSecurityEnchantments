function projektiNext(){
	
    var current = projektiSlider.getCurrentSlide();
    var slideCount = projektiSlider.getSlideCount();
    
    
    if(slideCount <= 4){
        
        
    } else if(slideCount == 5){
        
        $('#projekti-normal li:nth-child('+(current + 10)+')').fadeTo(200, 0.2).addClass('black-and-white');
        $('#projekti-normal li:nth-child('+(current + 6)+')').fadeTo(200, 0.2).addClass('black-and-white');
        if(current == slideCount - 1){
            $("#projekti-normal li:nth-child("+(current+11)+")").addClass('black-and-white').fadeTo(0,0.2); //DESNI SLIDE
            $el = $("#projekti-normal li:nth-child("+(current+6)+")"); //En korak preden pridemo okrog si zapomnimo naslednji element(LEVI SLIDE)
        }

        if(current == 0){ // Slider je prišel okrog, prvi element z desne potemnimo
            $el.addClass('black-and-white').fadeTo(200,0.2); //LEVI SLIDE
        }
       
    } else {
        ////console.log(slideCount);
        $('#projekti-normal li:nth-child('+(current + 12)+')').fadeTo(200, 0.2).addClass('black-and-white');
        $('#projekti-normal li:nth-child('+(current + 7)+')').fadeTo(200, 0.2).addClass('black-and-white');
        if(current == slideCount - 1){
            $("#projekti-normal li:nth-child("+(current+13)+")").addClass('black-and-white').fadeTo(0,0.2); //DESNI SLIDE
            $el = $("#projekti-normal li:nth-child("+(current+8)+")"); //En korak preden pridemo okrog si zapomnimo naslednji element(LEVI SLIDE)
        }

        if(current == 0){ // Slider je prišel okrog, prvi element z desne potemnimo
            $el.addClass('black-and-white').fadeTo(200,0.2); //LEVI SLIDE
        }
    }

}
function projektiPrev(){
	
    var current = projektiSlider.getCurrentSlide();
    var slideCount = projektiSlider.getSlideCount();


    if(slideCount <= 4){
        
        
    } else if(slideCount == 5){
        
        if(current == 0){
            $el2 = $('#projekti-normal li:nth-child('+(current + 5)+')');
            $el3 = $('#projekti-normal li:nth-child('+(current + 10)+')'); 
        }
        if(current == slideCount -1){ // Slider je prišel okrog
            $el2.addClass('black-and-white').fadeTo(200,0.2);
            $el3.addClass('black-and-white').fadeTo(200,0.2);
        } else {
            $('#projekti-normal li:nth-child('+(current + 6)+')').addClass('black-and-white').fadeTo(200,0.2);
            $('#projekti-normal li:nth-child('+(current + 10)+')').addClass('black-and-white').fadeTo(200,0.2);
        }
    } else {
        $('#projekti-normal li:nth-child('+(current + 7)+')').addClass('black-and-white').fadeTo(200,0.2);
        $('#projekti-normal li:nth-child('+(current + 12)+')').addClass('black-and-white').fadeTo(200,0.2);
        
        if(current == 0){
            $el2 = $('#projekti-normal li:nth-child('+(current + 6)+')');
            $el3 = $('#projekti-normal li:nth-child('+(current + 11)+')'); 
        }
        if(current == slideCount -1){ // Slider je prišel okrog
            $el2.addClass('black-and-white').fadeTo(200,0.2);
            $el3.addClass('black-and-white').fadeTo(200,0.2);
        }
    }
}

function sliderFix() {
	// fix za horror slider
    var mq = window.matchMedia( "(max-width: 1279px)" );
    
	if(!(mq.matches)) {
		$(".block-fri-med-ljudmi .bx-controls").hide();
	} else {
		$(".block-fri-med-ljudmi .bx-controls").show();
	}
}

$(window).resize(function(){
    if($("#mobile-nav").is(":visible")){
        if($(window).innerWidth() > 1160 ){
            if($("#mobile-menu-backgroud-dark").is(":visible")){
                $("#mobile-menu-backgroud-dark").fadeOut(100);
                $(".menu-item-button").removeClass("button-active");
                $("#mobile-nav").removeClass("mobile-nav-active");
                //$("#mobile-nav").fadeOut(100);
            }
        }
    }
    
    updateRaziskovalnaPodrocja();
    
    
    sliderFix();
    
    
    if (window.matchMedia('(min-width: 976px)').matches) {
    	
    	$(".dejavnosti-grid-custom .dejavnost-item").each(function(){
    		
		    if($(this).hasClass("dejavnostActive")) {
		    	$(this).parent().prepend(this);
		    }
		    
		    $(this).find(".mansory-image").css({"opacity" : 1});
		});
    }
    
});


// za 620px responsive raziskovalna
function updateRaziskovalnaPodrocja() {
	if (window.matchMedia('(max-width: 620px)').matches) {
		$("#raziskovalnaPodrocja-Meni .item.active").find(".responsive-menu-text").html($(".raziskovalnaPodrocja-main:not(.hidden) .content .sub-text").html());
	} else {
		$("#raziskovalnaPodrocja-Meni .item").find(".responsive-menu-text").hide();
	}
}

$(document).ready(function() {
	//updateRaziskovalnaPodrocja();
	$("#raziskovalnaPodrocja-Meni .item").on("click tap", function(event) {
		if (window.matchMedia('(max-width: 620px)').matches) {
			$(this).find(".responsive-menu-text").html($(".raziskovalnaPodrocja-main:not(.hidden) .content .sub-text").html());
			
			$(this).find(".responsive-menu-text").show();
			$(this).addClass("clicked");			
			
			$(this).siblings().find(".responsive-menu-text").hide();
			$(this).siblings().removeClass("clicked");
		}
	});
    
    $("#mobile-menu-backgroud-dark").click(function(){
        $("#mobile-menu-backgroud-dark").fadeOut(100);
        $("#mobile-nav").toggleClass("mobile-nav-active");
        $(".menu-item-button").toggleClass("button-active");
        /*$("#mobile-nav").css({
            "left": "-365px"
        });
        $("#mobile-nav").fadeOut(100);
        $("#mobile-menu-backgroud-dark").fadeOut(100);
        $(".menu-item-button").children(".b").css({
                "opacity" : "1",
                "height" : "4px"
            });
            $(".menu-item-button").children(".a").css({
                "-ms-transform": "rotate(0deg)", 
                "-webkit-transform": "rotate(0deg)", 
                "transform": "rotate(0deg)",
                "top": "0px"
            });
            $(".menu-item-button").children(".c").css({
                "-ms-transform": "rotate(0deg)", 
                "-webkit-transform": "rotate(0deg)",
                "transform": "rotate(0deg)",
                "top": "20px"
            });*/
    });
    $(".menu-item-button").click(function(){
        $("#mobile-nav").toggleClass("mobile-nav-active");
        $(this).toggleClass("button-active");
        if($("#mobile-menu-backgroud-dark").is(":visible")){
            $("#mobile-menu-backgroud-dark").fadeOut(100);
            //$("#mobile-nav").fadeOut(100);
        }
        else{
            $("#mobile-menu-backgroud-dark").fadeIn(100);
            //$("#mobile-nav").fadeIn(100);
            
        }
    });
    
    $("#mobile-nav .menus .item .image").click(function(e){
        $("#mobile-nav .links").fadeOut();
        $(this).siblings(".submenu-slide-item").addClass("active");
        
        var visina = $(this).siblings(".submenu-slide-item").height();
        $("#mobile-nav .menus").height(visina);
        
    }).siblings(".submenu-slide-item").click(function(e) {
        //////console.log(e);
        if($(e.target).parent("a").length != 0 || $(e.target).is("a") || $(e.target).parent().parent("a").length != 0){
            
        }else{
            return false;
        }
    });
    
     $("#mobile-nav .menus .item .back").click(function(){
         $("#mobile-nav .links").fadeIn();
         $("#mobile-nav .menus").height("auto");
         $(".submenu-slide-item").removeClass("active");
         // $("#mobile-nav .links").fadeIn();
     });
    
    
    
	/* bxslider za tiste slikice spodaj nad nogo na straneh(dogodki,raziskave,ob študiju) */
	bottomSlider = $('#bottomImageSlider').bxSlider({
		controls:false,
		auto:true,
		infiniteLoop : true,
		preloadImages : 'all',
		randomStart : true,
		useCSS : false,
		responsive:true,
		moveSlides : 1,
		pager : false,});	
	
	/* za animacijo pri 'Pridite na FRI' in 'Ob študijske dejavnosti' */
	var $grid = $('.dejavnosti-grid').masonry({
        itemSelector:'.dejavnost-item',
        columnWidth:272,
        gutter:22,
        isAnimated:true,
        isFitWidth: true,
    });
    
    $grid.on('click','.dejavnost-item',function(){
        ////console.log("klilk");
        
        $('.dejavnostActive').toggleClass('dejavnostActive');
        $(this).toggleClass('dejavnostActive');
        
        
        $grid.masonry();
    });
    
    
        
    /*
     * 
     * END PACKERY
     * 
     */
    
    var fade_dir = 1;
    $('.dejavnost-item').on('click', function(){
    	////console.log("dsfsf");
		if($(this).hasClass("dejavnostActive"))
			return;
        
		var mq = window.matchMedia("(min-width: 975px)");
		if(mq.matches) {
			var selectorBig = $(".dejavnosti-grid-custom .dejavnost-item.dejavnostActive");
			var selectorSmall = $(this);
			var bigHtml = selectorBig.html();
	        var smallHtml = selectorSmall.html();
	        
	        var bigImg = null; //selectorBig.find(".mansory-image").css("background-image");
	        
	        if(fade_dir == 1) {
	        	bigImg = selectorBig.find(".mansory-image").css("background-image");
	        } else {
	        	bigImg = selectorBig.find(".image-fade").css("background-image");
	        }
	        
	        var smallImg = selectorSmall.find(".mansory-image").css("background-image");
			
			// NASTAVIMO CSS
			selectorSmall.css({'transition': 'all 0.5s'});
			selectorBig.find(".mansory-image").css({'transition': 'opacity 0.5s'});
			selectorBig.find(".image-fade").css({'transition': 'opacity 0.5s'});
			selectorBig.find(".dejavnost-subContent").css({'transition': 'opacity 0.5s'});
			
			if(fade_dir == 1) {
				selectorBig.find(".image-fade").css({
					"background-image" : smallImg,
					"display" : "block"
				});
				
					
				selectorBig.find(".mansory-image").css({
					"opacity" : 0
				});
				selectorBig.find(".image-fade").css({
					"opacity" : 1
				});
				
				
			} else {
				selectorBig.find(".mansory-image").css({
					"background-image" : smallImg
				});
				
				selectorBig.find(".mansory-image").css({
					"opacity" : 1
				});
				selectorBig.find(".image-fade").css({
					"opacity" : 0
				});
				
				
			}

			// ZAZENEMO ANIMACIJE
			selectorSmall.css({'transform' : 'scale(0)'});
			selectorBig.find(".dejavnost-subContent").css({
				"opacity" : 0
			});
			
			// CAKAMO NA KONEC ANIMACIJ
			setTimeout(function(){
				selectorBig.find(".dejavnost-subContent").html(selectorSmall.find(".dejavnost-subContent").html());
				selectorBig.find(".dejavnostNaslov").html(selectorSmall.find(".dejavnostNaslov").html());
				selectorBig.find(".arrow-dropdown").html(selectorSmall.find(".arrow-dropdown").html());
				
				selectorSmall.html(bigHtml);
				
				if(fade_dir == 1) {
					selectorSmall.find(".mansory-image").css({
						"background-image" : bigImg
					});
					
					fade_dir = 0;
				} else {
					selectorSmall.find(".mansory-image").css({
						"background-image" : bigImg
					});
					
					fade_dir = 1;
				}
				
				selectorSmall.find(".image-fade").css({
					"display" : "none"
				});
				
				selectorSmall.css({'transform' : 'scale(1)'});
				selectorBig.find(".dejavnost-subContent").css({
					"opacity" : 1
				});

			}, 500);

			
			
		
		} else {
			$(".dejavnosti-grid-custom .dejavnost-item").each(function(){
			    $(this).removeClass("dejavnostActive");
			});
			
			//dodaj active in prepandaj
			$(this).addClass("dejavnostActive");
		}
		
		

   });
    
    projektiSliderMedium = $("#projekti-medium").bxSlider({
    	nextText : '<img src="/sites/all/modules/custom/raziskave/images/projekti-desno.png" style="width: 60px; height: 60px;" />',
		prevText : '<img src="/sites/all/modules/custom/raziskave/images/projekti-levo.png" style="width: 60px; height: 60px"/>',
		infiniteLoop : true,
		preloadImages : 'all',
		randomStart : false,
		useCSS : false,
		responsive:true,
		slideWidth : 273,
		minSlides : 1,
		maxSlides : 6,
		slideMargin : 22,
		moveSlides : 1,
		pager : false,
        auto: ($('#projekti-medium li').length > 4) ? true:false,
    })
    
	projektiSlider = $('#projekti-normal').bxSlider({
		nextText : '<img src="/sites/all/modules/custom/raziskave/images/projekti-desno.png" style="width: 60px; height: 60px;" />',
		prevText : '<img src="/sites/all/modules/custom/raziskave/images/projekti-levo.png" style="width: 60px; height: 60px"/>',
		infiniteLoop : true,
		preloadImages : 'all',
		randomStart : false,
		useCSS : false,
		responsive:true,
		slideWidth : 273,
		minSlides : 1,
		maxSlides : 6,
		slideMargin : 22,
		moveSlides : 1,
		pager : false,
        auto: ($('#projekti-normal li').length > 4) ? true:false,
		onSlideBefore : function($slideElement, oldIndex, newIndex) {
			//$('.projekti-wrap-ul li:nth-child('+(newIndex + 7)+')').fadeTo(200, 0.2).addClass('black-and-white');
			//$('.projekti-wrap-ul li:nth-child('+(newIndex + 12)+')').fadeTo(200, 0.2).addClass('black-and-white');
			
			/* prejšnjima zatemnjenima odstranimo črno beli efekt */
            if(projektiSlider.getSlideCount() <= 4){
                    
            }else if(projektiSlider.getSlideCount() == 5){
                //console.log(oldIndex+6);
                $('#projekti-normal li:nth-child('+(oldIndex + 6)+')').fadeTo(500, 1).removeClass('black-and-white');
                $('#projekti-normal li:nth-child('+(oldIndex + 10)+')').fadeTo(500, 1).removeClass('black-and-white');
                
            }else if(projektiSlider.getSlideCount() > 5) {
                $('#projekti-normal li:nth-child('+(oldIndex + 7)+')').fadeTo(500, 1).removeClass('black-and-white');
                $('#projekti-normal li:nth-child('+(oldIndex + 12)+')').fadeTo(500, 1).removeClass('black-and-white');
            }
			
			
		},
		onSliderLoad : function(currentIndex){
            $("#projekti-normal").css("opacity", "1");
            
			$('.izpostavljeniProjektiLoader').hide(); /* Izpostavljeni projekti loader animacija */
			
			setTimeout(function() {
                if(projektiSlider.getSlideCount() <= 4){
                    $('#projekti-slider .bx-next').css("display", "none");
                    $('#projekti-slider .bx-prev').css("display", "none");
                    
                }else if(projektiSlider.getSlideCount() == 5){
                    $('#projekti-normal li:nth-child('+(currentIndex+6)+')').addClass('black-and-white').fadeTo(0,0.2);
					$('#projekti-normal li:nth-child('+(currentIndex+10)+')').addClass('black-and-white').fadeTo(0,0.2);
                    $el2 = $('#projekti-normal li:nth-child('+(currentIndex+14)+')');
        	        $el3 = $('#projekti-normal li:nth-child('+(currentIndex+10)+')');

                }else if(projektiSlider.getSlideCount() > 5) {
	                $('#projekti-normal li:nth-child('+(currentIndex+7)+')').addClass('black-and-white').fadeTo(0,0.2);
					$('#projekti-normal li:nth-child('+(currentIndex+12)+')').addClass('black-and-white').fadeTo(0,0.2);
                    $el2 = $('#projekti-normal li:nth-child('+(currentIndex+6)+')');
        	        $el3 = $('#projekti-normal li:nth-child('+(currentIndex+11)+')');
				}
            }, 0);
			 
			 /* Če gremo v levo, je potrebno prva dva(levi in desni) pripravit za efekt */
            
        	
		},
        onSlideNext: function($slideElement, oldIndex, newIndex){
            projektiNext();
            
        },
        onSlidePrev: function($slideElement, oldIndex, newIndex){
            projektiPrev();
              
        }
        
    });

	/*
	 * Izpostavi funkcijo fix_slider, da jo lahko drupal kliče preko ajax-a
	 * Naredi novi slider ker se je vsebina spremenila
	 *
	 * */
    (function($, Drupal) {
    Drupal.ajax.prototype.commands.LoaderProjects = function(ajax, response, status) {
        // //console.log("kokk");
        
        
        
        var mq = window.matchMedia( "(max-width: 1279px)" );
        if(!(mq.matches)) { //normal slider
        	// //console.log("normal");
	        projektiSlider.destroySlider();
	        projektiSlider = $('#projekti-normal').bxSlider({
	            nextText : '<img src="/sites/all/modules/custom/raziskave/images/projekti-desno.png" style="width: 60px; height: 60px;" />',
	            prevText : '<img src="/sites/all/modules/custom/raziskave/images/projekti-levo.png" style="width: 60px; height: 60px"/>',
	            infiniteLoop : true,
	            preloadImages : 'all',
	            randomStart : false,
	            useCSS : false,
	            slideWidth : 273,
	            minSlides : 1,
	            maxSlides : 6,
	            responsive:true,
	            slideMargin : 22,
	            moveSlides : 1,
	            pager : false,
	            onSlideBefore : function($slideElement, oldIndex, newIndex) {
	                //$('.projekti-wrap-ul li:nth-child('+(newIndex + 7)+')').fadeTo(200, 0.2).addClass('black-and-white');
	                //$('.projekti-wrap-ul li:nth-child('+(newIndex + 12)+')').fadeTo(200, 0.2).addClass('black-and-white');
	
	                $('#projekti-normal li:nth-child('+(oldIndex + 7)+')').fadeTo(1000, 1).removeClass('black-and-white');
	                $('#projekti-normal li:nth-child('+(oldIndex + 12)+')').fadeTo(1000, 1).removeClass('black-and-white');
	            },
	            onSliderLoad : function(currentIndex){
	                currentIndex = 0;
	                $('.izpostavljeniProjektiLoader').hide();/* Izpostavljeni projekti loader animacija */
	
	                $('#projekti-normal li:nth-child('+(currentIndex+7)+')').fadeTo(0,0.2).addClass('black-and-white');
	                $('#projekti-normal li:nth-child('+(currentIndex+12)+')').fadeTo(0,0.2).addClass('black-and-white');
	
	                // Če gremo v levo, je potrebno prva dva(levi in desni) pripravit za efekt
	                $el2 = $('#projekti-normal li:nth-child('+(currentIndex+6)+')');
	                $el3 = $('#projekti-normal li:nth-child('+(currentIndex+11)+')');
	
	
	
	            }
	        });
	        
	        
	        
	        if (projektiSlider.getSlideCount() < 1) {
	            projektiSlider.destroySlider();
	        }
	        else if(projektiSlider.getSlideCount() <= 4) { //popravi puščice 	
	        	$('#projekti-slider .bx-next').addClass('raziskave-arrows-margin-right');
	        	$('#projekti-slider .bx-prev').addClass('raziskave-arrows-margin-left');
	        }
	        else {
	        	$('#projekti-slider .bx-next').removeClass('raziskave-arrows-margin-right');
	        	$('#projekti-slider .bx-prev').removeClass('raziskave-arrows-margin-left');
	        }
	        $('#projekti-slider .bx-next').on('click',projektiNext);
	        $('#projekti-slider .bx-prev').on('click',projektiPrev);
        }
        else {
        	// //console.log("medium");
        	
        	projektiSliderMedium.destroySlider();
	        projektiSliderMedium = $('#projekti-medium').bxSlider({
	            nextText : '<img src="/sites/all/modules/custom/raziskave/images/projekti-desno.png" style="width: 60px; height: 60px;" />',
	            prevText : '<img src="/sites/all/modules/custom/raziskave/images/projekti-levo.png" style="width: 60px; height: 60px"/>',
	            infiniteLoop : true,
	            preloadImages : 'all',
	            randomStart : false,
	            useCSS : false,
	            slideWidth : 273,
	            minSlides : 1,
	            maxSlides : 6,
	            responsive:true,
	            slideMargin : 22,
	            moveSlides : 1,
	            pager : false
	        });
	        if (projektiSliderMedium.getSlideCount() < 1) {
	            projektiSliderMedium.destroySlider();
	        }
        	
        	
        }
    }
})(jQuery, Drupal);
	

	/* Za spreminjanje raziskovalnih področji */
	$('.item').hover(function(){
		wrap = $('.podrocja-wrap');
		prev = $('.active').removeClass('active');
		$(this).addClass('active');
		
		/*if (window.matchMedia('(max-width: 620px)').matches) {
			$(wrap.children()[prev.index()+1]).toggleClass('hidden');
			$(wrap.children()[$(this).index()+1]).toggleClass('hidden');
		} else {*/
			$(wrap.children()[prev.index()]).toggleClass('hidden');
			$(wrap.children()[$(this).index()]).toggleClass('hidden');
		
		
		
	});	
	
	sliderFix();
});

/* Obarva element(a) rdeče(toggle effect)*/
function toggleActive(el) {
	$('.izpostavljeniProjektiLoader').show(); /* Izpostavljeni projekti loader gif */
	$('.activeLink').toggleClass('activeLink');
	$(el).toggleClass('activeLink');
}

