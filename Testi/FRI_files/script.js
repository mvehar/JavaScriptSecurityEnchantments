/*var scroling = false;
$(window).scroll(function(){
    scroling = true;
    if($("#side-menu").length>0){
        setTimeout(function(){ 
            scroling = false;
            setTimeout(function(){
                if(scroling)
                   console.log("dfd");
            }, 300);
        }, 1500);
    }
});
*/



var terms = [];
var dateCalendar = "";
var lazy_index = 0;
var lazy_lim = 10;
var lazy_context = 1; // 1 = upcoming, 2 = past

var translated_title = "";

$(document).on("change", "#dogodki-taxonomy .term", function(e) {
    terms = getCheckedTermsDogodki();
    lazy_index = 0;

    if(terms.length > 0) {
        $("#dogodki-taxonomy .show-all").show();
        $("#dogodki-taxonomy").css("padding-bottom", "40px");
    } else {
        $("#dogodki-taxonomy .show-all").hide();
        $("#dogodki-taxonomy").css("padding-bottom", "15px");
    }



    ajaxDogodki();
});

$(document).on("click", "#vsi-dogodki .text-button", function(e) {
    lazy_index += 1;
    ajaxDogodki();
});

$(document).on("click", ".prihajajoci-dogodki-gumb .prihajajoci-dogodki-label", function(e) {
    lazy_context = 1;
    lazy_index = 0;

    ajaxDogodki();
});

$(document).on("click", ".pretekli-dogodki-gumb .pretekli-dogodki-label", function(e) {
    lazy_context = 2;
    lazy_index = 0;

    ajaxDogodki();
});

$(document).on("click", "#dogodki-taxonomy .show-all", function(evt){
    $("#dogodki-taxonomy .term").each(function() {
        $(this).find(".term-check").prop('checked', false);

    });
    $("#dogodki-taxonomy .term").eq(0).trigger("change");
});

function ajaxDogodki() {

    var lang = $('html').attr('xml:lang');

    $.ajax({
        type: 'POST',
        url: "/" + lang + '/ajax/events_dates_upcoming',
        dataType: 'json',
        data: {
            'terms': terms,
            'lazy_index': lazy_index,
            'lazy_context': lazy_context
        },
        success: function(data) {
            if(lazy_index > 0) {
                var clen = $(data).find(".ajax-dogodki").children(".dogodek-item").length;

                if (clen > 0 ) {
                    $(".ajax-dogodki").append($(data).find(".ajax-dogodki").children());
                }

                if(clen < lazy_lim) {
                    hideLazyLoad(true);
                } else {
                    hideLazyLoad(false);
                }

            } else {
                var clen = $(data).find(".ajax-dogodki").children(".dogodek-item").length;

                //if (clen > 0 ) {
                $(".ajax-dogodki").html($(data).find(".ajax-dogodki").children());
                //}

                if(clen < lazy_lim) {
                    hideLazyLoad(true);
                } else {
                    hideLazyLoad(false);
                }
            }
            console.log("sdf")
            setTitleDogodki($(".ajax-dogodki .translated-title").text());

            if(lazy_context == 1) {
                hideUpcomingButton(true);
                hidePastButton(false);
            } else if(lazy_context == 2) {
                hideUpcomingButton(false);
                hidePastButton(true);
            }

            //hideLazyLoad(false);
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function ajaxDogodkiSingle() {

    var lang = $('html').attr('xml:lang');

    $.ajax({
        type: 'POST',
        url: "/" + lang + '/ajax/events_dates_single',
        dataType: 'json',
        data: {
            'date': dateCalendar
        },
        success: function(data) {
            $(".ajax-dogodki").html($(data).find(".ajax-dogodki").children());
            setTitleDogodki($(".ajax-dogodki .translated-title").text());
            hideLazyLoad(true);

            hideUpcomingButton(false);
            hidePastButton(false);
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function getCheckedTermsDogodki() {
    var terms = [];

    $("#dogodki-taxonomy .term").each(function() {
        if($(this).find(".term-check").is(':checked')) {
            var tmp_term = $(this).find(".term-name").attr("data-tid");

            if($.inArray(tmp_term, terms) == -1) {
                terms.push(tmp_term);
            }
        }
    });

    return terms;
}

function setTitleDogodki(title) {
    $("#vsi-dogodki .heading-article ul li").text(title);
}

function hideLazyLoad(hide) {
    if(hide) {
        $("#dogodki-lazy-load").hide();
    } else {
        $("#dogodki-lazy-load").show();
    }
}

function hideUpcomingButton(hide) {
    if(hide) {
        $(".prihajajoci-dogodki-gumb").hide();
    } else {
        $(".prihajajoci-dogodki-gumb").show();
    }
}

function hidePastButton(hide) {
    if(hide) {
        $(".pretekli-dogodki-gumb").hide();
    } else {
        $(".pretekli-dogodki-gumb").show();
    }
}

/* ******************* AJAX KOLEDAR ******************* */

dates = {};
$(document).ready(function(){
    if($("#dogodki-data").length > 0) {
        hideUpcomingButton(true);
        hidePastButton(false);

        var clen = $(".ajax-dogodki").children(".dogodek-item").length;
        if (clen < lazy_lim) {
            hideLazyLoad(true);
        }

        translated_title = $("#vsi-dogodki .heading-article ul li").text();

        /* NOVO - PREVENT CACHING - RELOAD FILTER */

        terms = getCheckedTermsDogodki();
        lazy_index = 0;

        if (terms.length > 0) {
            $("#dogodki-taxonomy .show-all").show();
            $("#dogodki-taxonomy").css("padding-bottom", "40px");
        } else {
            $("#dogodki-taxonomy .show-all").hide();
            $("#dogodki-taxonomy").css("padding-bottom", "15px");
        }

        ajaxDogodki();

        /* /////// PREVENT CACHING ///////////// */

        var lang = $('html').attr('xml:lang');

        //Za pridobivanje datumov kdaj so dogodki, zato da jih lahko kasneje obarvamo
        $.ajax({
            type: 'POST',
            url: "/" + lang + '/ajax/events_dates',
            success: function (data) {
                //tmpString = data[0][0].value;
                $.each(data, function (index, value) {

                    /*Firefox,IE (mogoče tudi Safari) upoštevajo samo YYYY/MM/DD kot format za new Date(), mi pa dobimo YYYY-MM-DD */
                    var datumString = value[0].value.substring(0, 10).replace(/-/g, '/');
                    var datumString2 = value[0].value2.substring(0, 10).replace(/-/g, '/');

                    if (datumString == datumString2) {
                        date = new Date(datumString);
                        date.setHours(0, 0, 0);
                        dates[date] = date;
                    } else {
                        var date_od = new Date(datumString);
                        date_od.setHours(0, 0, 0);
                        var date_do = new Date(datumString2);
                        date_do.setHours(0, 0, 0);

                        while (date_od.getTime() <= date_do.getTime()) {
                            dates[date_od] = date_od;
                            date_od.setDate(date_od.getDate() + 1);
                            //console.log(date_od);
                        }


                    }

                });

                var lang = $('html').attr('xml:lang');
                if (lang == "sl") {
                    $.datepicker.setDefaults($.datepicker.regional['sl']);
                } else {
                    $.datepicker.setDefaults($.datepicker.regional['en-GB']);
                }

                $('#datepicker').datepicker({
                    beforeShow: function (input) {
                        $(input).css('background-color', '#ff9');
                    },
                    beforeShowDay: function (date) {
                        // Datume vrnejene preko ajaxa obarva z sivo
                        var highlight = dates[date];


                        if (highlight) {
                            return [true, 'highlight-date', ''];
                        } else {
                            return [true, '', ''];
                        }
                    },
                    onSelect: function (dateText, inst) {
                        $(this).css('background-color', '');

                        dateCalendar = dateText;
                        ajaxDogodkiSingle();
                    },
                    onClose: function (dateText, inst) {
                        $(this).css('background-color', '');
                    }
                });
            }
        });

        $("#dogodki-taxonomy .term").eq(0).trigger("change");
    }
});
var $OsebjeListMasonry;
var setTimeoutConst = null;

// resetiraj vnosno polje za search
$(".iskanje-stran-form #edit-keys").focus(function() {
	$(this).val("");
});

$(window).resize(function(){
    if($("#mobile-menu-backgroud-dark").is(":visible") && $(window).width() > 1160){
        $("#mobile-menu-backgroud-dark").attr("Closed", "1");
        $("#mobile-menu-backgroud-dark").fadeOut(1);
    }
    if(!$("#mobile-menu-backgroud-dark").is(":visible") && $(window).width() <= 1160){
        if($("#mobile-menu-backgroud-dark").attr("Closed")== "1"){
            $("#mobile-menu-backgroud-dark").attr("Closed", "0");
            $("#mobile-menu-backgroud-dark").fadeIn(1);
        }
    }
    
});

$(document).ready(function() {


    //
    // when returning back check values on osebje
    //
    if ($("#osebjeSelectFilter").length > 0) {
        var url = window.location.href, idx = url.indexOf("#")
        var hash = idx != -1 ? url.substring(idx + 1) : "";

        if (hash == 0) {
            $("#osebjeSelectFilter").val("1");
        } else if (hash == 1) {
            $("#osebjeSelectFilter").val("2");
        } else if (hash == 2) {
            $("#osebjeSelectFilter").val("3");
        }
    }


    //
    //
    //
    //

    $OsebjeListMasonry = $('#staffListContainer');
    $OsebjeListMasonry.masonry({
        // options
        itemSelector: '.staffColumn',
    });

    // MENI ZAKASNITEV -->
    $(document).on("mouseenter", "#main-nav li", function (e) {
        var thisl = this;

        /*setTimeoutConst = setTimeout(function () {
            $(thisl).find(".dropDownMenu").addClass("menu-on-hover");
            $(thisl).find(".dropdown-icon").append("<span class='menu-dropdown-icon'></span>");
        }, 200);*/

    }).on("mouseleave", "#main-nav li", function (e) {
        clearTimeout(setTimeoutConst);

        $(this).find(".dropDownMenu").removeClass("menu-on-hover");
        $(this).find(".menu-dropdown-icon").remove();
    });
    // MENI ZAKASNITEV -->
    $(".news-container-title a").dotdotdot({watch: true});
    $(".event-title a").dotdotdot({watch: true});
    $(".raziskave-heading-text").dotdotdot({watch: true});
    $(".raziskave-info-content .tekst").dotdotdot({watch: true});


    //$(".seminarji_konference_zagovori .heading a").dotdotdot({watch: true});

    //posamezni-programi ---------------------------------------------
    //----------------------------------------------------------------

    $("#courses-one .show-more-data").click(function () {
        //$(".show-more-data").click(function(){
        if ($(this).siblings(".hidden-content").is(":visible")) {
            $(this).siblings(".hidden-content").fadeOut();
            $(this).children(".image").removeClass("image-nh");
            $(this).children(".image").addClass("image-h");
            //console.log($("html").attr("xml:lang"));
            if ($("html").attr("xml:lang") == "en") {
                $(this).children(".text").html("More");
            } else {
                $(this).children(".text").html("Več");
            }
        }
        else {
            $(this).siblings(".hidden-content").fadeIn();
            $(this).children(".image").addClass("image-nh");
            $(this).children(".image").removeClass("image-h");
            //console.log($("html").attr("xml:lang"));
            //console.log( ($("html").attr("xml:lang") == "en") ? true:false )
            if ($("html").attr("xml:lang") == "en") {

                $(this).children(".text").html("Less");
            } else {
                $(this).children(".text").html("Manj");
            }
            d
        }
    });
    $("#alldata-for-collage .item > .heading").click(function () {

        if ($(this).siblings(".content").is(":visible")) {
            $(this).siblings(".content").fadeOut();
            $(this).children(".image").css({
                "-webkit-transform": "rotate(0deg)",
                "-moz-transform": "rotate(0deg)",
                "-ms-transform": "rotate(0deg)",
                "-o-transform": "rotate(0deg)",
                "transform": "rotate(0deg)"

            });
        }
        else {
            $(this).siblings(".content").fadeIn();
            $(this).children(".image").css({
                "-webkit-transform": "rotate(180deg)",
                "-moz-transform": "rotate(180deg)",
                "-ms-transform": "rotate(180deg)",
                "-o-transform": "rotate(180deg)",
                "transform": "rotate(180deg)"
            });
        }
    });


    $("#custom-search-label").click(function () {
        $(this).parent().submit();
    });


    $('.bxslider').bxSlider({
        nextText: '<img id="nextClick" src="/sites/all/modules/custom/osebje/images/arrow_right.png" />',
        prevText: '<img id="prevClick" src="/sites/all/modules/custom/osebje/images/arrow_left.png" />',
        infiniteLoop: true,
        responsive: true,
        preloadImages: 'all',
        randomStart: false,
        slideWidth: 198,
        minSlides: 1,
        maxSlides: 7,
        moveSlides: 1,
        pager: false,
        slideMargin: 0,
        auto: ($(".bxslider li").length > 2) ? true : false,
    });

    $('#bxslider-dogajanja-in-vtisi').bxSlider({
        nextText: '<img id="nextClick" src="/sites/all/modules/custom/osebje/images/arrow_right.png" />',
        prevText: '<img id="prevClick" src="/sites/all/modules/custom/osebje/images/arrow_left.png" />',
        infiniteLoop: true,
        responsive: true,
        preloadImages: 'all',
        randomStart: false,
        slides: 3,
        minSlides: 3,
        maxSlides: 3,
        moveSlides: 1,
        pager: false,
        slideMargin: 0,
        auto: ($("#bxslider-dogajanja-in-vtisi li").length > 2) ? false : false,
        autoReload: true,
        breaks: [{screen: 0, slides: 1, pager: false}, {screen: 540, slides: 2}, {screen: 994, slides: 3}]
    });

    //medium fri med ljudmi
    var slider2_medium = $('.bxslider2-medium').bxSlider({
        pager: false,
        slides: 3,
        slideWidth: 375,
        slideMargin: 17.5,
        breaks: [{screen: 0, slides: 1, pager: false, controls: false, slideWidth: 300},
            {screen: 620, slides: 2, pager: false, controls: false, slideWidth: 375, slideMargin: 15},
            {screen: 890, slides: 3, pager: false, controls: false, slideWidth: 375},
            {screen: 1275, slides: 3, pager: false, controls: false, slideWidth: 375}],
        autoReload: true,
        auto: ($(".bxslider2-medium li").length > 2) ? true : false,
    });

    //on load
    if ($(window).width() < 1279) {
    }
    //on resize
    $(window).resize(function () {
        if ($(window).width() < 1279) {
        }
        else {

        }
    });


    var slider2 = $('.bxslider2').bxSlider({
        nextText: '<div style="width: 38px; height: 60px; background-color: rgba(255,255,255,0.5); position: relative"><img style="position: absolute; top: 30%;" src="sites/all/themes/fri_theme/images/transperentarrow_10.png"/></div>',
        prevText: '<div style="width: 38px; height: 60px; background-color: rgba(255,255,255,0.5); position: relative"><img style="position: absolute; top: 30%; right:0px;" src="sites/all/themes/fri_theme/images/transL_07.png"/></div>',
        infiniteLoop: true,
        // responsive: true,
        preloadImages: 'all',
        randomStart: false,
        // moveSlideQty: 1,
        // useCSS: false,
        slideWidth: 375,
        minSlides: 1,
        maxSlides: 5,
        slideMargin: 17.5,
        moveSlides: 1,
        pager: false,
        auto: false,
        onSliderLoad: function () {
            $(".newsGallery").css("opacity", "1");
            //SPREMENITI V DINAMIČNO! ČE SE SPREMENI ŠTEVILO VNOSOV V BAZI, NE DELUJE PRAVILNO na eni strani
            $(".bxslider2 li:nth-child(6) .news-big-section-cover").addClass("grayed");
            $(".bxslider2 li:nth-child(6) .news-small-section-cover .cover1").addClass("coveringLeft");
            $(".bxslider2 li:nth-child(6) .news-small-section-cover .cover2").addClass("coveringRight");
            $(".bxslider2 li:nth-child(6) img").addClass("black-and-white");


            $(".bxslider2 li:nth-child(10) .news-big-section-cover").addClass("grayed");
            $(".bxslider2 li:nth-child(10) .news-small-section-cover .cover1").addClass("coveringLeft");
            $(".bxslider2 li:nth-child(10) .news-small-section-cover .cover2").addClass("coveringRight");
            $(".bxslider2 li:nth-child(10) img").addClass("black-and-white");


            $(".bxslider2 li:nth-child(7) .news-big-section-cover").css("z-index", "-999");
            $(".bxslider2 li:nth-child(7) .news-small-section-cover").css("z-index", "-999");
            $(".bxslider2 li:nth-child(8) .news-big-section-cover").css("z-index", "-999");
            $(".bxslider2 li:nth-child(8) .news-small-section-cover").css("z-index", "-999");
            $(".bxslider2 li:nth-child(9) .news-big-section-cover").css("z-index", "-999");
            $(".bxslider2 li:nth-child(9) .news-small-section-cover").css("z-index", "-999");
            $(".newsGallery .bx-prev").addClass("button-left-animate");
            $(".newsGallery .bx-next").addClass("button-right-animate");

            //ANIMACIJE
            if (!isScrolledIntoView2($('.newsGallery')) && !alreadyIn) {


                $(".bxslider2 li:nth-child(7) .news-small-section div:nth-child(1)").addClass("margin-top-animation-1");
                $(".bxslider2 li:nth-child(7) .news-small-section div:nth-child(2)").addClass("margin-top-animation-2");
                $(".bxslider2 li:nth-child(7) .news-big-section").addClass("margin-top-animation-big-1");

                $(".bxslider2 li:nth-child(8) .news-small-section div:nth-child(1)").addClass("margin-top-animation-3");
                $(".bxslider2 li:nth-child(8) .news-small-section div:nth-child(2)").addClass("margin-top-animation-4");
                $(".bxslider2 li:nth-child(8) .news-big-section").addClass("margin-top-animation-big-2");

                $(".bxslider2 li:nth-child(9) .news-small-section div:nth-child(1)").addClass("margin-top-animation-5");
                $(".bxslider2 li:nth-child(9) .news-small-section div:nth-child(2)").addClass("margin-top-animation-6");
                $(".bxslider2 li:nth-child(9) .news-big-section").addClass("margin-top-animation-big-3");

                /// -------
                $(".bxslider2 li:nth-child(6) .news-small-section div:nth-child(1)").addClass("margin-top-animation-3");
                $(".bxslider2 li:nth-child(6) .news-small-section div:nth-child(2)").addClass("margin-top-animation-4");
                $(".bxslider2 li:nth-child(6) .news-big-section").addClass("margin-top-animation-big-2");
                /*tu še za overlaye*/
                $(".bxslider2 li:nth-child(6) .news-small-section-cover div:nth-child(1)").addClass("margin-top-animation-33");
                $(".bxslider2 li:nth-child(6) .news-small-section-cover div:nth-child(2)").addClass("margin-top-animation-44");
                $(".bxslider2 li:nth-child(6) .news-big-section-cover").addClass("margin-top-animation-big-2");

                $(".bxslider2 li:nth-child(10) .news-small-section div:nth-child(1)").addClass("margin-top-animation-3");
                $(".bxslider2 li:nth-child(10) .news-small-section div:nth-child(2)").addClass("margin-top-animation-4");
                $(".bxslider2 li:nth-child(10) .news-big-section").addClass("margin-top-animation-big-2");
                /*tu še za overlaye*/
                $(".bxslider2 li:nth-child(10) .news-small-section-cover div:nth-child(1)").addClass("margin-top-animation-33");
                $(".bxslider2 li:nth-child(10) .news-small-section-cover div:nth-child(2)").addClass("margin-top-animation-44");
                $(".bxslider2 li:nth-child(10) .news-big-section-cover").addClass("margin-top-animation-big-2");
            }
        },
        onSlideNext: function ($slideElement, oldIndex, newIndex) {


            $('.newsGallery .bx-next').fadeOut(10);
            $('.newsGallery .bx-prev').fadeOut(10);
            setTimeout(function () {
                $('.newsGallery .bx-next').fadeIn(450);
                $('.newsGallery .bx-prev').fadeIn(450);
            }, 600);


            // console.log("next");

            var current = slider2.getCurrentSlide();
            var leviZatemnjeni = current + 6;
            var desniZatemnjeni = current + 10;

            //nastavi še z-index-e covering elementov, tako da bo prekrival in on mouse over ne bo deloval na sivem
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni) + ") .news-big-section-cover").css("z-index", "9999");
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni) + ") .news-small-section-cover").css("z-index", "0");

            if (current == 0) {


                //takoj odstrani črno beli efekt
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1) + ") img").removeClass("black-and-white"); //PREDZADNJI! (ŠTEVILO VSEH: maxSlides(clones) + število elementov + maxSlides(clones))
                //odstrani še black and white na preostalih 2 zamenjanih
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 2) + ") img").removeClass("black-and-white");
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 3) + ") img").removeClass("black-and-white");

                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1) + ") .news-big-section-cover, .bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1) + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1) + ") .news-small-section-cover .cover2").animate({ //PREDZADNJI
                    opacity: 0,
                    duration: 1200,
                    queue: false
                }, function () {

                });

                //dodaj sive overlaye na leve
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1 - 3) + ") .news-big-section-cover").addClass("grayed");   //PREDZADNJI -3 (to je levi)
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1 - 3) + ") .news-small-section-cover .cover1").addClass("coveringLeft");
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1 - 3) + ") .news-small-section-cover .cover2").addClass("coveringRight");

                //pripelji covere v ospredje
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1 - 3) + ") .news-big-section-cover").css("z-index", "9999");
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1 - 3) + ") .news-small-section-cover").css("z-index", "0");

                //animiraj in po koncu odstrani leve
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1 - 3) + ") .news-big-section-cover, .bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1 - 3) + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1 - 3) + ") .news-small-section-cover .cover2").animate({
                    opacity: 0.9,
                    duration: 1200,
                    queue: false
                }, function () {
                    // alert("fertik");


                    //potem nastavi še z-index-e covering elementov, tako da bo deloval on mouse over
                    $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 2) + ") .news-big-section-cover").css("z-index", "-999");
                    $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 2) + ") .news-small-section-cover").css("z-index", "-999");
                    //potem nastavi še z-index-e covering elementov, tako da bo deloval on mouse over
                    $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 3) + ") .news-big-section-cover").css("z-index", "-999");
                    $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 3) + ") .news-small-section-cover").css("z-index", "-999");


                    //dodaj še črno beli efekt
                    $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount() - 1 - 3) + ") img").addClass("black-and-white");
                });


                //dodaj sive overlaye na desnega ki pride
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount()) + ") .news-big-section-cover").addClass("grayed"); //ČISTO ZADNJI
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount()) + ") .news-small-section-cover .cover1").addClass("coveringLeft");
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount()) + ") .news-small-section-cover .cover2").addClass("coveringRight");


                //pripelji covere v ospredje
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount()) + ") .news-big-section-cover").css("z-index", "9999");
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount()) + ") .news-small-section-cover").css("z-index", "0");

                //animiraj in po koncu odstrani leve
                $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount()) + ") .news-big-section-cover, .bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount()) + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount()) + ") .news-small-section-cover .cover2").animate({
                    opacity: 0.9,
                    duration: 1200,
                    queue: false
                }, function () {
                    // alert("fertik");

                    //dodaj še črno beli efekt
                    $(".bxslider2 li:nth-child(" + (5 * 2 + slider2.getSlideCount()) + ") img").addClass("black-and-white");
                });


            }


            //povrni tistega ki se pripelje iz sive, odstrani mu class po koncu

            //odstrani še črno beli efekt
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") img").removeClass("black-and-white");

            $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-big-section-cover, .bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-small-section-cover .cover2").animate({
                opacity: 0,
                duration: 1200,
                queue: false
            }, function () {
                // alert("fertik");
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-big-section-cover").removeClass("grayed");
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-small-section-cover .cover1").removeClass("coveringLeft");
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-small-section-cover .cover2").removeClass("coveringRight");


                //potem nastavi še z-index-e covering elementov, tako da bo deloval on mouse over
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-big-section-cover").css("z-index", "-999");
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-small-section-cover").css("z-index", "-999");
            });

            if (current == 0) {
                $(".bxslider2 li:nth-child(9) .news-big-section-cover").animate({
                    opacity: 0,
                    duration: 1200,
                    queue: false
                })
            }

            //dodaj sive overlaye na leve
            $(".bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-big-section-cover").addClass("grayed");
            $(".bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-small-section-cover .cover1").addClass("coveringLeft");
            $(".bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-small-section-cover .cover2").addClass("coveringRight");


            //pripelji covere v ospredje
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni) + ") .news-big-section-cover").css("z-index", "9999");
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni) + ") .news-small-section-cover").css("z-index", "0");

            //animiraj in po koncu odstrani leve
            $(".bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-big-section-cover, .bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-small-section-cover .cover2").animate({
                opacity: 0.9,
                duration: 1200,
                queue: false
            }, function () {
                // alert("fertik");
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni - 1) + ") .news-big-section-cover").removeClass("grayed");
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni - 1) + ") .news-small-section-cover .cover1").removeClass("coveringLeft");
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni - 1) + ") .news-small-section-cover .cover2").removeClass("coveringRight");

                //odstrani še črno beli efekt
                // $(".bxslider2 li:nth-child("+(leviZatemnjeni-1)+") img").removeClass("black-and-white");


                //dodaj še črno beli efekt
                $(".bxslider2 li:nth-child(" + leviZatemnjeni + ") img").addClass("black-and-white");

            });


            //nastavi naslednjega pred sivim na čisto sivo
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni + 1) + ") .news-big-section-cover").css("opacity", "1");
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni + 1) + ") .news-small-section-cover .cover1").css("opacity", "1");
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni + 1) + ") .news-small-section-cover .cover2").css("opacity", "1");


            //nastavi naslednjega pred prehod na sivo na opacity 0
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-big-section-cover").css("opacity", "0");
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-small-section-cover .cover1").css("opacity", "0");
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-small-section-cover .cover2").css("opacity", "0");

            //dodaj sive overleye na desnega
            $(".bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-big-section-cover").addClass("grayed");
            $(".bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-small-section-cover .cover1").addClass("coveringLeft");
            $(".bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-small-section-cover .cover2").addClass("coveringRight");


            //animiraj desnega iz 1 v 0.9
            $(".bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-big-section-cover, .bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-small-section-cover .cover2").animate({
                opacity: 0.9,
                duration: 1200,
                queue: false
            }, function () {
                //dodaj še črno beli efekt
                $(".bxslider2 li:nth-child(" + desniZatemnjeni + ") img").addClass("black-and-white");
            });


        },
        onSlidePrev: function ($slideElement, oldIndex, newIndex) {

            $('.newsGallery .bx-next').fadeOut(10);
            $('.newsGallery .bx-prev').fadeOut(10);
            setTimeout(function () {
                $('.newsGallery .bx-next').fadeIn(450);
                $('.newsGallery .bx-prev').fadeIn(450);
            }, 600);


            var current = slider2.getCurrentSlide();
            var leviZatemnjeni = current + 6;
            var desniZatemnjeni = current + 10;


            //nastavi še z-index-e covering elementov, tako da bo prekrival in on mouse over ne bo deloval na sivem
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni) + ") .news-big-section-cover").css("z-index", "9999");
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni) + ") .news-small-section-cover").css("z-index", "0");


            if (current == slider2.getSlideCount() - 1) { //prej je blo hardcodano 5

                //takoj odstrani črno beli efekt
                $(".bxslider2 li:nth-child(" + (5 + 1) + ") img").removeClass("black-and-white"); //PRVI ORIGINAL -> število clonov (max slides) +1
                //odstrani še black and white na preostalih 2 zamenjanih
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 2) + ") img").removeClass("black-and-white");
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 3) + ") img").removeClass("black-and-white");

                $(".bxslider2 li:nth-child(" + (5 + 1) + ") .news-big-section-cover, .bxslider2 li:nth-child(" + (5 + 1) + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + (5 + 1) + ") .news-small-section-cover .cover2").animate({ //PRVI ORIGINAL
                    opacity: 0,
                    duration: 1200,
                    queue: false
                }, function () {

                });


                //dodaj sive overlaye na desne
                $(".bxslider2 li:nth-child(" + (5 + 4) + ") .news-big-section-cover").addClass("grayed"); //število clonov + 4 (ker je zadnji)
                $(".bxslider2 li:nth-child(" + (5 + 4) + ") .news-small-section-cover .cover1").addClass("coveringLeft");
                $(".bxslider2 li:nth-child(" + (5 + 4) + ") .news-small-section-cover .cover2").addClass("coveringRight");


                //pripelji covere v ospredje
                $(".bxslider2 li:nth-child(" + (5 + 4) + ") .news-big-section-cover").css("z-index", "9999");
                $(".bxslider2 li:nth-child(" + (5 + 4) + ") .news-small-section-cover").css("z-index", "0");

                //animiraj in po koncu odstrani desne
                $(".bxslider2 li:nth-child(" + (5 + 4) + ") .news-big-section-cover, .bxslider2 li:nth-child(" + (5 + 4) + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + (5 + 4) + ") .news-small-section-cover .cover2").animate({
                    opacity: 0.9,
                    duration: 1200,
                    queue: false
                }, function () {
                    // alert("fertik");


                    //odpelji v ozadje
                    //potem nastavi še z-index-e covering elementov, tako da bo deloval on mouse over
                    $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 2) + ") .news-big-section-cover").css("z-index", "-999");
                    $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 2) + ") .news-small-section-cover").css("z-index", "-999");
                    $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 3) + ") .news-big-section-cover").css("z-index", "-999");
                    $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 3) + ") .news-small-section-cover").css("z-index", "-999");

                    //dodaj še črno beli efekt
                    $(".bxslider2 li:nth-child(" + (5 + 4) + ") img").addClass("black-and-white");
                });


                //dodaj sive overlaye na levega ki pride
                $(".bxslider2 li:nth-child(" + (5) + ") .news-big-section-cover").addClass("grayed"); //PRVI CLONE Z LEVE, TO JE ZADNJI CLONE
                $(".bxslider2 li:nth-child(" + (5) + ") .news-small-section-cover .cover1").addClass("coveringLeft");
                $(".bxslider2 li:nth-child(" + (5) + ") .news-small-section-cover .cover2").addClass("coveringRight");

                //pripelji covere v ospredje
                $(".bxslider2 li:nth-child(" + (5) + ") .news-big-section-cover").css("z-index", "9999");
                $(".bxslider2 li:nth-child(" + (5) + ") .news-small-section-cover").css("z-index", "0");

                //animiraj in po koncu odstrani leve
                $(".bxslider2 li:nth-child(" + (5) + ") .news-big-section-cover, .bxslider2 li:nth-child(" + (5) + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + (5) + ") .news-small-section-cover .cover2").animate({
                    opacity: 0.9,
                    duration: 1200,
                    queue: false
                }, function () {
                    // alert("fertik");

                    //dodaj črno beli efekt
                    $(".bxslider2 li:nth-child(" + (5) + ") img").addClass("black-and-white");
                });


            }


            //povrni tistega ki se pripelje iz sive, odstrani mu class po koncu

            //prvo takoj odstrani črno beli efekt
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") img").removeClass("black-and-white");

            $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-big-section-cover, .bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-small-section-cover .cover2").animate({
                opacity: 0,
                duration: 1200,
                queue: false
            }, function () {
                // alert("fertik");
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-big-section-cover").removeClass("grayed");
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-small-section-cover .cover1").removeClass("coveringLeft");
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-small-section-cover .cover2").removeClass("coveringRight");

                //potem nastavi še z-index-e covering elementov, tako da bo deloval on mouse over
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-big-section-cover").css("z-index", "-999");
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni + 1) + ") .news-small-section-cover").css("z-index", "-999");
            });

            //dodaj sive overlaye na desne
            $(".bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-big-section-cover").addClass("grayed");
            $(".bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-small-section-cover .cover1").addClass("coveringLeft");
            $(".bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-small-section-cover .cover2").addClass("coveringRight");

            //animiraj in po koncu odstrani desne
            $(".bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-big-section-cover, .bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + desniZatemnjeni + ") .news-small-section-cover .cover2").animate({
                opacity: 0.9,
                duration: 1200,
                queue: false
            }, function () {
                // alert("fertik");
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni + 1) + ") .news-big-section-cover").removeClass("grayed");
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni + 1) + ") .news-small-section-cover .cover1").removeClass("coveringLeft");
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni + 1) + ") .news-small-section-cover .cover2").removeClass("coveringRight");


                //dodaj črno beli efekt
                $(".bxslider2 li:nth-child(" + (desniZatemnjeni + 1) + ") img").removeClass("black-and-white");
            });


            //nastavi naslednjega pred sivim na čisto sivo
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni - 1) + ") .news-big-section-cover").css("opacity", "1");
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni - 1) + ") .news-small-section-cover .cover1").css("opacity", "1");
            $(".bxslider2 li:nth-child(" + (leviZatemnjeni - 1) + ") .news-small-section-cover .cover2").css("opacity", "1");

            //nastavi naslednjega pred prehod na sivo na opacity 0
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-big-section-cover").css("opacity", "0");
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-small-section-cover .cover1").css("opacity", "0");
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni - 1) + ") .news-small-section-cover .cover2").css("opacity", "0");

            //dodaj sive overleye na levega
            $(".bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-big-section-cover").addClass("grayed");
            $(".bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-small-section-cover .cover1").addClass("coveringLeft");
            $(".bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-small-section-cover .cover2").addClass("coveringRight");

            //pripelji covere v ospredje
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni) + ") .news-big-section-cover").css("z-index", "9999");
            $(".bxslider2 li:nth-child(" + (desniZatemnjeni) + ") .news-small-section-cover").css("z-index", "0");

            //odstrani classe
            // $(".bxslider2 li:nth-child("+(desniZatemnjeni+1)+") .news-big-section-cover").removeClass("grayed");
            // $(".bxslider2 li:nth-child("+(desniZatemnjeni+1)+") .news-small-section-cover .cover1").removeClass("coveringLeft");
            // $(".bxslider2 li:nth-child("+(desniZatemnjeni+1)+") .news-small-section-cover .cover2").removeClass("coveringRight");

            //animiraj desnega iz 1 v 0.9
            $(".bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-big-section-cover, .bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-small-section-cover .cover1, .bxslider2 li:nth-child(" + leviZatemnjeni + ") .news-small-section-cover .cover2").animate({
                opacity: 0.9,
                duration: 1200,
                queue: false
            }, function () {
                //dodaj črno beli efekt
                $(".bxslider2 li:nth-child(" + (leviZatemnjeni) + ") img").addClass("black-and-white");
            });

        }
    });


    var alreadyIn = false;
    var alreadyIn2 = false;


    // $( '#datepicker' ).datepicker({
    // beforeShow: function(input) {
    // $( input ).css( 'background-color', '#ff9' );
    // },
    // onSelect: function(dateText, inst) {
    // $( this ).css( 'background-color', '' );
    // console.log( 'Selected: ' + dateText +
    // "\n\nid: " + inst.id +
    // "\nselectedDay: " + inst.selectedDay +
    // "\nselectedMonth: " + inst.selectedMonth +
    // "\nselectedYear: " + inst.selectedYear);
    // },
    // onClose: function(dateText, inst) {
    // $( this ).css( 'background-color', '' );
    // }
    // });

    $(".wrapper-dots").dotdotdot({
        //	configuration goes here
        watch: true,
        wrap: 'word',
    });
    // $("#www").dotdotdot();

    // $('#wrapper-dots').ellipsis();
    function checkIfScrolled() {
        var element = $('#programmes');
        var scroll = isScrolledIntoView(element);
        var element2 = $('.newsGallery');
        var scroll2 = isScrolledIntoView2(element2);

        if (scroll == true && alreadyIn == false) {
            alreadyIn = true;
            // $(".programmes-more-button").fadeIn(3000);
            $(".programmes-more-button").css("bottom", "25px");
            $(".programmes-more-button").css("opacity", "1");
            // $(".programmes-more-button").animate({
            // opacity: 1,
            // }, {duration: 2300, queue: false});
//
            // $(".programmes-more-button").animate({
            // bottom: 25,
            // }, {duration: 800, queue: false});
        }


        if (scroll2 == true && alreadyIn2 == false) {
            alreadyIn2 = true;

            slider2.startAuto();
            setTimeout(function () {
                // konec animacije -> odstrani vse classe

                $(".bxslider2 div").removeClass("margin-top-stop-animation-top");
                $(".bxslider2 div").removeClass("margin-top-stop-animation-bottom");
                $(".bxslider2 div").removeClass("margin-top-stop-animation-bottom2");
                $(".bxslider2 div").removeClass("margin-top-stop-animation-big-top");
                $(".bxslider2 div").removeClass("margin-top-animation-1");
                $(".bxslider2 div").removeClass("margin-top-animation-2");
                $(".bxslider2 div").removeClass("margin-top-animation-3");
                $(".bxslider2 div").removeClass("margin-top-animation-4");
                $(".bxslider2 div").removeClass("margin-top-animation-5");
                $(".bxslider2 div").removeClass("margin-top-animation-6");
                $(".bxslider2 div").removeClass("margin-top-animation-33");
                $(".bxslider2 div").removeClass("margin-top-animation-44");
                $(".bxslider2 div").removeClass("margin-top-animation-big-1");
                $(".bxslider2 div").removeClass("margin-top-animation-big-2");
                $(".bxslider2 div").removeClass("margin-top-animation-big-3");


                //pripeljejo se buttoni L / D
                $(".newsGallery .bx-prev").addClass("button-left");
                $(".newsGallery .bx-next").addClass("button-right");

            }, 2450);

            $(".bxslider2 li:nth-child(7) .news-small-section div:nth-child(1)").addClass("margin-top-stop-animation-top");
            $(".bxslider2 li:nth-child(7) .news-small-section div:nth-child(2)").addClass("margin-top-stop-animation-top");
            $(".bxslider2 li:nth-child(7) .news-big-section").addClass("margin-top-stop-animation-bottom");

            $(".bxslider2 li:nth-child(8) .news-small-section div:nth-child(1)").addClass("margin-top-stop-animation-bottom2");
            $(".bxslider2 li:nth-child(8) .news-small-section div:nth-child(2)").addClass("margin-top-stop-animation-bottom2");
            $(".bxslider2 li:nth-child(8) .news-big-section").addClass("margin-top-stop-animation-top");

            $(".bxslider2 li:nth-child(9) .news-small-section div:nth-child(1)").addClass("margin-top-stop-animation-top");
            $(".bxslider2 li:nth-child(9) .news-small-section div:nth-child(2)").addClass("margin-top-stop-animation-top");
            $(".bxslider2 li:nth-child(9) .news-big-section").addClass("margin-top-stop-animation-bottom");

            $(".bxslider2 li:nth-child(6) .news-small-section div:nth-child(1)").addClass("margin-top-stop-animation-bottom2");
            $(".bxslider2 li:nth-child(6) .news-small-section div:nth-child(2)").addClass("margin-top-stop-animation-bottom2");
            $(".bxslider2 li:nth-child(6) .news-big-section").addClass("margin-top-stop-animation-top");
            /*tu še za overlaye*/
            $(".bxslider2 li:nth-child(6) .news-small-section-cover div:nth-child(1)").addClass("margin-top-stop-animation-top");
            $(".bxslider2 li:nth-child(6) .news-small-section-cover div:nth-child(2)").addClass("margin-top-stop-animation-top");
            $(".bxslider2 li:nth-child(6) .news-big-section-cover").addClass("margin-top-stop-animation-top");
//
            $(".bxslider2 li:nth-child(10) .news-small-section div:nth-child(1)").addClass("margin-top-stop-animation-bottom2");
            $(".bxslider2 li:nth-child(10) .news-small-section div:nth-child(2)").addClass("margin-top-stop-animation-bottom2");
            $(".bxslider2 li:nth-child(10) .news-big-section").addClass("margin-top-stop-animation-top");
            /*tu še za overlaye*/
            $(".bxslider2 li:nth-child(10) .news-small-section-cover div:nth-child(1)").addClass("margin-top-stop-animation-top");
            $(".bxslider2 li:nth-child(10) .news-small-section-cover div:nth-child(2)").addClass("margin-top-stop-animation-top");
            $(".bxslider2 li:nth-child(10) .news-big-section-cover").addClass("margin-top-stop-animation-top");


            $(".bxslider2 li:nth-child(10) .news-big-section-cover").css("opacity", "0.9");
            $(".bxslider2 li:nth-child(10) .news-small-section-cover .cover1").css("opacity", "0.9");
            $(".bxslider2 li:nth-child(10) .news-small-section-cover .cover2").css("opacity", "0.9");
            $(".bxslider2 li:nth-child(10) .news-small-section-cover .cover1").css("z-index", "0");
            $(".bxslider2 li:nth-child(10) .news-small-section-cover .cover2").css("z-index", "0");

            $(".bxslider2 li:nth-child(6) .news-big-section-cover").css("opacity", "0.9");
            $(".bxslider2 li:nth-child(6) .news-small-section-cover .cover1").css("opacity", "0.9");
            $(".bxslider2 li:nth-child(6) .news-small-section-cover .cover2").css("opacity", "0.9");
            $(".bxslider2 li:nth-child(6) .news-small-section-cover .cover1").css("z-index", "0");
            $(".bxslider2 li:nth-child(6) .news-small-section-cover .cover2").css("z-index", "0");
        }


    }

    $(window).scroll(function () {
        checkIfScrolled();
    });

    checkIfScrolled();


    $('.bxslider4').bxSlider({
        nextText: '<img src="sites/all/themes/fri_theme/images/desno.png"  />',
        prevText: '<img src="sites/all/themes/fri_theme/images/levo.png"  />',
        slideWidth: 1160,
        minSlides: 1,
        maxSlides: 1,
        moveSlides: 1,
        pager: false,
        infiniteLoop: true,
        randomStart: false,
        useCSS: false, auto: true
    });

    $('.bxslider4_2').bxSlider({
        nextText: '<img src="sites/all/themes/fri_theme/images/desno.png"  />',
        prevText: '<img src="sites/all/themes/fri_theme/images/levo.png"  />',
        minSlides: 1,
        maxSlides: 1,
        moveSlides: 1,
        pager: false,
        infiniteLoop: true,
        randomStart: false,
        auto: true
    });


    var slider5 = $('.bxslider5').bxSlider({
        nextText: '<div style="width: 38px; height: 60px; background-color: rgba(255,255,255,0.5); position: relative"><img style="position: absolute; top: 30%;" src="sites/all/themes/fri_theme/images/transperentarrow_10.png"/></div>',
        prevText: '<div style="width: 38px; height: 60px; background-color: rgba(255,255,255,0.5); position: relative"><img style="position: absolute; top: 30%; right:0px;" src="sites/all/themes/fri_theme/images/transL_07.png"/></div>',
        slideWidth: 1160,
        minSlides: 1,
        maxSlides: 3,
        margin: 10,
        moveSlides: 1,
        pager: false,
        slideMargin: 20,
        infiniteLoop: true,
        randomStart: false,
        preloadImages: 'all',
        moveSlides: 1,
        auto: true,
        pause: 4000,
        autoStart: true,

        onSliderLoad: function () {
            $("#headerGallery ul li:nth-child(4) .banner-cover-top").addClass("bbxslider2anner-cover");
            $("#headerGallery ul li:nth-child(4) .header-images").addClass("black-and-white");
            $("#headerGallery ul li:nth-child(6) .banner-cover-top").addClass("banner-cover");
            $("#headerGallery ul li:nth-child(6) .header-images").addClass("black-and-white");
            $("#headerGallery ul li:nth-child(5) .banner-cover").css("opacity", 0.0);
        },

        onSlideNext: function ($slideElement, oldIndex, newIndex) {
            $('#headerGallery .bx-next').fadeOut(10);
            $('#headerGallery .bx-prev').fadeOut(10);
            setTimeout(function () {
                $('#headerGallery .bx-next').fadeIn(450);
                $('#headerGallery .bx-prev').fadeIn(450);
            }, 500);

            var current = slider5.getCurrentSlide();
            var desni = current + 5;
            var levi = current + 3;

            $("#headerGallery ul li:nth-child(" + (desni + 1) + ") .banner-cover").css("opacity", 1.0);
            $("#headerGallery ul li:nth-child(" + (desni + 1) + ") .header-images").addClass("black-and-white");

            $("#headerGallery ul li:nth-child(" + desni + ") .header-images").removeClass("black-and-white");
            $("#headerGallery ul li:nth-child(" + desni + ") .banner-cover").animate({
                opacity: 0,
                duration: 400,
                queue: false
            }, function () {

            })

            //animiraj desnega iz sive v 0.9
            $("#headerGallery ul li:nth-child(" + (desni + 1) + ") .header-images").addClass("black-and-white");
            $("#headerGallery ul li:nth-child(" + (desni + 1) + ") .banner-cover").animate({
                opacity: 0.9,
                duration: 400,
                queue: false
            }, function () {

            })

            if (current == 0) {


                //nastavi black-and-white še na zadnjega, drugače pride do grdega efekta ko se galerija obrne
                $("#headerGallery ul li:nth-child(" + (3 * 2 + slider5.getSlideCount()) + ") .header-images").addClass("black-and-white");

                $("#headerGallery ul li:nth-child(" + (3 * 2 + slider5.getSlideCount() - 1) + ") .header-images").removeClass("black-and-white");
                $("#headerGallery ul li:nth-child(" + (3 * 2 + slider5.getSlideCount() - 1) + ") .banner-cover").animate({
                    //PREDZADNJI (število cloneov(maxSlides)*2 + število slideov -1)
                    opacity: 0,
                    duration: 400,
                    queue: false
                }, function () {

                })

                setTimeout(function () {
                    $("#headerGallery ul li:nth-child(" + (3 * 2 + slider5.getSlideCount() - 2) + ") .header-images").addClass('black-and-white');
                }, 500);


                $("#headerGallery ul li:nth-child(" + (3 * 2 + slider5.getSlideCount() - 2) + ") .banner-cover").animate({
                    //PREDPREDZADNJI (število cloneov(maxSlides)*2 + število slideov -1) => ko se obrne postane prvi!!!
                    opacity: 0.9,
                    duration: 400,
                    queue: false
                }, function () {

                })
            }

            //tistega, ki gre v sivo na levi animiraj v sivo 
            $("#headerGallery ul li:nth-child(" + (levi + 1) + ") .banner-cover").animate({
                opacity: 0.9,
                duration: 400,
                queue: false
            }), function () {

            }
            //dodaj še class black-and-white

            setTimeout(function () {
                //dodaj še class black-and-white
                $("#headerGallery ul li:nth-child(" + (levi + 1) + ") .header-images").addClass("black-and-white");
            }, 500);
        },


        onSlidePrev: function ($slideElement, oldIndex, newIndex) {
            $('#headerGallery .bx-next').fadeOut(10);
            $('#headerGallery .bx-prev').fadeOut(10);
            setTimeout(function () {
                $('#headerGallery .bx-next').fadeIn(450);
                $('#headerGallery .bx-prev').fadeIn(450);
            }, 500);

            var current = slider5.getCurrentSlide();
            var desni = current + 7;
            var levi = current + 5;

            //naslednjega iz leve nastavi na overlay 1.0, zaradi lepše animacije
            $("#headerGallery ul li:nth-child(" + (levi - 1) + ") .banner-cover").css("opacity", 1.0);
            //nastavi mu tudi črno belo sliko
            $("#headerGallery ul li:nth-child(" + (levi - 1) + ") .header-images").addClass("black-and-white");


            //POTREBNO DINAMIČNO DOLOČITI ŠTEVILO VSEH ELEMENTOV BREZ CLONE-OV
            if (current == 2) { //zadnji element!

                //nastavi black-and-white še na prvega, drugače pride do grdega efekta ko se galerija obrne
                setTimeout(function () {
                    $("#headerGallery ul li:nth-child(3) .header-images").addClass("black-and-white");
                }, 550);

                $("#headerGallery ul li:nth-child(4) .header-images").removeClass("black-and-white");
                $("#headerGallery ul li:nth-child(4) .banner-cover").animate({ //PRVI ORG
                    opacity: 0,
                    duration: 400,
                    queue: false
                }, function () {

                })
                setTimeout(function () {
                    $("#headerGallery ul li:nth-child(5) .header-images").addClass('black-and-white');
                }, 550);
                $("#headerGallery ul li:nth-child(5) .banner-cover").animate({ //DRUGI ORG
                    opacity: 0.9,
                    duration: 400,
                    queue: false
                }, function () {

                })
            }

            //povrni tistega ki se pripelje iz sive, odstrani mu class po koncu
            $("#headerGallery ul li:nth-child(" + levi + ") .header-images").removeClass("black-and-white");
            $("#headerGallery ul li:nth-child(" + levi + ") .banner-cover").animate({
                opacity: 0,
                duration: 400,
                queue: false
            }, function () {

            })

            //tistega, ki gre v sivo na levi animiraj v sivo 
            setTimeout(function () {
                $("#headerGallery ul li:nth-child(" + (desni - 1) + ") .header-images").addClass("black-and-white");
            }, 500);
            $("#headerGallery ul li:nth-child(" + (desni - 1) + ") .banner-cover").animate({
                opacity: 0.9,
                duration: 400,
                queue: false
            }), function () {

            }
            //animiraj levega iz sive v 0.9
            $("#headerGallery ul li:nth-child(" + (levi - 1) + ") .header-images").addClass("black-and-white");
            $("#headerGallery ul li:nth-child(" + (levi - 1) + ") .banner-cover").animate({
                opacity: 0.9,
                duration: 400,
                queue: false
            }, function () {

            })
        }
    });

    var slider5_mobile = $('.bxslider5-mobile').bxSlider({
        minSlides: 1,
        maxSlides: 1,
        moveSlides: 1,
        infiniteLoop: true,
        pager: false,
        auto: true,
        startSlide: 1,
        auto: true,

        onSliderLoad: function () {
            $("#headerGallery-mobile").css("visibility", "visible");
            $("#headerGallery-mobile2").css("visibility", "visible");
        },
        onSlideBefore: function () {

        }

    })


    $('.footer-menu-title').each(function (index) {

        var html_org = $(this).html();
        var html_calc = '<span>' + html_org + '</span>';
        $(this).html(html_calc);
        var width = $(this).find('span:first').width();
        $(this).html(html_org);

        var textIndex = index;

        $('.footer-menu-item .redDots').each(function (index) {
            if (textIndex != index) return true;

            $(this).width(width);

        })

    });


    //skrivanje in prikaz več tekočih in zaključenih projektov

    var switch_var = 0;


    $("#staffListContainer").on('click', ".image-up-categories img", function () {


        if ($(this).hasClass("image-up") == true) {


            $(this).addClass("image-rotate2");

            $(this).addClass("image-down");
            $(this).removeClass("image-up");


            var objekt = $($(this).parent().parent());

            $(".category-second-level-container", objekt).addClass("height0");

        }
        else {
            $(this).removeClass("image-rotate2");

            $(this).removeClass("image-down");
            $(this).addClass("image-up");


            var objekt = $($(this).parent().parent());

            $(".category-second-level-container", objekt).removeClass("height0");

        }
    })

    if ($("#hiddenCurrentProjects").length > 0) {
        $("#moreText, #moreImage img").on('click', function () {


            if (switch_var == 0) {

                $("#moreText").text("MANJ");
                $("#moreImage img").addClass("rotate-projects-arrow");
            }
            else {
                $("#moreText").text("VEČ");
                $("#moreImage img").removeClass("rotate-projects-arrow");
            }


            $("#hiddenClosedProjects").toggle(500);
            $("#hiddenCurrentProjects").toggle(500, function () {


                if (switch_var == 0) {
                    $("#moreText").addClass("animateMoreDown1");
                    $("#moreImage").addClass("animateMoreDown2");

                    $("#moreText").removeClass("animateMoreUp1");
                    $("#moreImage").removeClass("animateMoreUp2");

                    switch_var = 1;

                }
                else {

                    $("#moreText").addClass("animateMoreUp1");
                    $("#moreImage").addClass("animateMoreUp2");

                    $("#moreText").removeClass("animateMoreDown1");
                    $("#moreImage").removeClass("animateMoreDown2");

                    switch_var = 0;

                }


                $('#moreImage img').trigger('mouseleave');
                $('#moreText').trigger('mouseleave');
                $('#moreImage').trigger('mouseleave');

            });


        });
    } else {
        $(".expand-hidden-data").css({
            "display": "none"
        });
    }

    //mobile search
    $('.search_800px').on('click', function () {

        if ($('.main-mobile-search').hasClass('main-mobile-search-open') == true) {
            //zapri"
            $(".main-mobile-search").stop().animate({
                height: "0px"
            }, 100);
        }
        else {
            $('.main-mobile-search form input').focus();
            $(".main-mobile-search").stop().animate({
                height: "50px"
            }, 100);
        }
        $('.main-mobile-search').toggleClass('main-mobile-search-open');
    })


    if ($(".tablesorter").length > 0) {
        $(".tablesorter").tablesorter();

    }



    $(document).on("click", ".expand-mobile-button .plus-minus", function () {
        if ($(this).parent().parent().parent().find(".tmp-mobile-data").length > 0) {

            if ($(this).attr("odpret") == "true") {
                $(this).parent().parent().parent().find(".tmp-mobile-data").remove();

                $(this).parent().parent().parent().find(".plus-minus").each(function () {
                    $(this).attr("odpret", "false");
                    $(this).css({
                        "background-image": " url(/sites/all/themes/fri_theme/images/table-plus.png)"
                    });
                });
            } else {
                $(this).parent().parent().parent().find(".tmp-mobile-data").remove();

                $(this).parent().parent().parent().find(".plus-minus").each(function () {
                    $(this).attr("odpret", "false");
                    $(this).css({
                        "background-image": " url(/sites/all/themes/fri_theme/images/table-plus.png)"
                    });
                });
                $(this).css({
                    "background-image": " url(/sites/all/themes/fri_theme/images/table-minus.png)"
                });
                $(this).attr("odpret", "true");
                var otrokov = $(this).parent().parent().children("td:visible").length;

                $(this).parent().parent().after(
                    '<tr class="tmp-mobile-data"><td colspan="' + otrokov + '">' +
                    '</td></tr>');

                $(this).parent().parent().parent().find(".tmp-mobile-data td").html($(this).parent().parent().find(".mobile-hidden-data").html());

            }


        }
        else {
            $(this).css({
                "background-image": " url(/sites/all/themes/fri_theme/images/table-minus.png)"
            });
            $(this).attr("odpret", "true");
            var otrokov = $(this).parent().parent().children("td:visible").length;

            $(this).parent().parent().after(
                '<tr class="tmp-mobile-data"><td colspan="' + otrokov + '">' +
                '</td></tr>');

            $(this).parent().parent().parent().find(".tmp-mobile-data td").html($(this).parent().parent().find(".mobile-hidden-data").html());
        }
    });

    if ($(".expand-mobile-button").length > 0) {
        $(".fri-tabela thead th").click(function () {
            $(".fri-tabela tbody .tmp-mobile-data").remove();
            $(".fri-tabela tbody .plus-minus").each(function () {
                $(this).attr("odpret", "false");
                $(this).css({
                    "background-image": " url(/sites/all/themes/fri_theme/images/table-plus.png)"
                });
            });
        });


    }
    var isci_rezultate_search = true;

    $(".search_load_more").click(function (e) {
        if (isci_rezultate_search) {
            isci_rezultate_search = false;
            $(this).find(".text_button").addClass("active");
            var stran = $(this).attr("page");
            var key_name = $(this).attr("key");
            $(this).attr("page", parseInt(stran) + 1);

            $.ajax({
                url: '/iskanje?page=' + stran + '&keys=' + key_name,
                success: function (data) {

                    //console.log(data);
                    var stevilo_nov = 0;
                    $(data).find(".search-result").each(function (e) {
                        $(".search-results").append("<li class='search-result'>" + $(this).context.innerHTML + "</li>");
                        //console.log("<li class='search-result'"+data.innerHTML+"</li>");
                        isci_rezultate_search = true;
                        $(".search_load_more").find(".text_button").removeClass("active");
                        stevilo_nov++;
                    });

                    if (stevilo_nov < 10) {
                        $(".search_load_more").css("display", "none");
                    }
                }
            });
        }


    });


    /*  SCROLL ON PAGE
     *  CLASS NAME : inner-slide-link
     *
     */

    var slide_button = $('.inner-slide-link');
    if(slide_button.length){

        slide_button.click(function() {
            var attr_id = $(this).attr('to-id');
            $('html, body').animate({
                scrollTop: $("#"+attr_id).offset().top
            }, 1000);
        });
    }


});

var previusSize = $(window).innerWidth;
$(window).resize(function(){
    
    if($(".fri-tabela tbody .tmp-mobile-data").length >0){
        
        
        if($(window).outerWidth() < 401){

            $(".fri-tabela tbody .tmp-mobile-data td").attr("colspan", "2");
        }
        else if($(window).outerWidth() < 620){
            $(".fri-tabela tbody .tmp-mobile-data td").attr("colspan", "3");
        }
        else if($(window).outerWidth() < 850){
            $(".fri-tabela tbody .tmp-mobile-data td").attr("colspan", "4");
        }
        else{
            $(".fri-tabela tbody .tmp-mobile-data").remove();
            $(".fri-tabela tbody .plus-minus").each(function(){
                $(this).attr("odpret", "false");
                $(this).css({
                    "background-image": " url(/sites/all/themes/fri_theme/images/table-plus.png)"
                });
            });
        }
           
    }
});

function isScrolledIntoView(elem)
{
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

	if(!$elem.length){ /* ni elementa na strani, drugače spama konzolo */
		return false;
	}

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function isScrolledIntoView2(elem)
{
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

	if(!$elem.length){ /* ni elementa na strani, drugače spama konzolo */
		return false;
	}

    var elemTop = $elem.offset().top - 350;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) );
}
