$(document).ready(function() {
    var childern_bx = $(".bxslider3 > li").length;
    
    var otrok = 6;
    if(childern_bx < 6)
    {
        otrok = 4;
    }
    else{
        $("#slider-fri-med-ljudmi").addClass("left-right-align");
    }
	bx3 = $('.bxslider3').bxSlider({
        nextText: '<div style="width: 38px; height: 60px; background-color: rgba(255,255,255,0.5); position: relative"><img style="position: absolute; top: 30%;" src="/sites/all/themes/fri_theme/images/transperentarrow_10.png"/></div>',
        prevText: '<div style="width: 38px; height: 60px; background-color: rgba(255,255,255,0.5); position: relative"><img style="position: absolute; top: 30%; right:0px;" src="/sites/all/themes/fri_theme/images/transL_07.png"/></div>',
        infiniteLoop: true,
        // responsive: true,
        preloadImages: 'all',
        randomStart: false,
        // moveSlideQty: 1,
        // useCSS: false,
        slideWidth: 270,
        minSlides: otrok,
        maxSlides: otrok,
        slideMargin: 26,
        moveSlides: 1,
        pager:false,
        onSliderLoad:function(currentIndex){
        	console.log(otrok);
        	
            if(otrok > 5){
                $("#slider-fri-med-ljudmi-vidno li:nth-child(7)").addClass("black-and-white").fadeTo(0,0.2);
                $("#slider-fri-med-ljudmi-vidno li:nth-child(12)").addClass("black-and-white").fadeTo(0,0.2);
                /* Če gremo v levo, je potrebno prva dva pripravit za efekt */
                $el2 = $('#slider-fri-med-ljudmi-vidno li:nth-child('+(currentIndex+6)+')');
                $el3 = $('#slider-fri-med-ljudmi-vidno li:nth-child('+(currentIndex+11)+')');
            }
        },
        onSlideBefore:function($slideElement, oldIndex, newIndex){
            if(otrok > 5){
                $('#slider-fri-med-ljudmi-vidno li:nth-child('+(oldIndex + 7)+')').fadeTo(500, 1).removeClass('black-and-white');
                //$('#slider-fri-med-ljudmi-vidno li:nth-child('+(newIndex + 12)+')').fadeTo(200, 0.2).addClass('black-and-white');
                $('#slider-fri-med-ljudmi-vidno li:nth-child('+(oldIndex + 12)+')').fadeTo(500, 1).removeClass('black-and-white');
            }
        },
        onSlideAfter:function($slideElement, oldIndex, newIndex){
        }
   });   
   $('#slider-fri-med-ljudmi .bx-next').on('click',function(){
   		/* Magic goes here */
   		if(otrok>5){
            var current = bx3.getCurrentSlide();
            var slideCount = bx3.getSlideCount();



            $('#slider-fri-med-ljudmi-vidno li:nth-child('+(current + 12)+')').fadeTo(200, 0.2).addClass('black-and-white');
            $('#slider-fri-med-ljudmi-vidno li:nth-child('+(current + 7)+')').fadeTo(200, 0.2).addClass('black-and-white');

            if(current == slideCount - 1){
                $("#slider-fri-med-ljudmi-vidno li:nth-child("+(current+13)+")").addClass('black-and-white').fadeTo(0,0.2); //DESNI SLIDE
                $el = $("#slider-fri-med-ljudmi-vidno li:nth-child("+(current+8)+")"); //En korak preden pridemo okrog si zapomnimo naslednji element(LEVI SLIDE)
            }

            if(current == 0){ // Slider je prišel okrog, prvi element z desne potemnimo
                $el.addClass('black-and-white').fadeTo(200,0.2); //LEVI SLIDE
            }
        }
   });
   $('#slider-fri-med-ljudmi .bx-prev').on('click',function(){
 		/* More magic */  	
   	
        if(otrok>5){
            var current = bx3.getCurrentSlide();
            var slideCount = bx3.getSlideCount();

            $('#slider-fri-med-ljudmi-vidno li:nth-child('+(current + 7)+')').addClass('black-and-white').fadeTo(200,0.2); //Prvi z leve
            $('#slider-fri-med-ljudmi-vidno li:nth-child('+(current + 12)+')').addClass('black-and-white').fadeTo(200,0.2); //Prvi z leve

            if(current == 0){
                $el2 = $('#slider-fri-med-ljudmi-vidno li:nth-child('+(current + 6)+')'); //Prvi z leve
                $el3 = $('#slider-fri-med-ljudmi-vidno li:nth-child('+(current + 11)+')'); //Prvi z desne
                //console.log('next '+$el2);
            }
            if(current == slideCount -1){ // Slider je prišel okrog
                $el2.addClass('black-and-white').fadeTo(200,0.2);
                $el3.addClass('black-and-white').fadeTo(200,0.2);
            }
        }
   });
   
});
$(window).load(function() { 
	$('.bxslider3-mobile').bxSlider({
   		nextText: '<div style="width: 38px; height: 60px; background-color: rgba(255,255,255,0.5); position: relative"><img style="position: absolute; top: 30%;" src="/sites/all/themes/fri_theme/images/transperentarrow_10.png"/></div>',
        prevText: '<div style="width: 38px; height: 60px; background-color: rgba(255,255,255,0.5); position: relative"><img style="position: absolute; top: 30%; right:0px;" src="/sites/all/themes/fri_theme/images/transL_07.png"/></div>',
        infiniteLoop: true,
        responsive: true,
        preloadImages: 'all',
        randomStart: false,
        slideWidth: 270,
        minSlides: 1,
        maxSlides: 6,
        slideMargin: 26,
        moveSlides: 1,
        pager:false,
   });

});


