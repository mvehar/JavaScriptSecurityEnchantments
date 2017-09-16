 //ob spremembi v selectu

var timeout = false;
//ob tipkanju imena
$('#osebjeSearchInput').keyup(function () { 
	
	var besedilo = $('#osebjeSearchInput').val(); 
	
	var indexSelected = $('#osebjeSelectFilter').prop("selectedIndex");
    console.log(indexSelected);
	var lang = $('html').attr('xml:lang');

	$.ajax({
  		type: 'POST',
      	url: '/' + lang + '/ajax/search',
      	dataType: 'json', 
		data: {"text":besedilo,"selected":indexSelected},
      	success: function(dataa) {
          	console.log(dataa)
          	$('#staffListContainer').html(dataa);
          	$("#activity-indicator-container").html('');
          	$("#activity-indicator-container").css('height', '0px');
          	
          	if(!timeout) {
				timeout = true;

				window.setTimeout(function() {
					timeout = false;
					
					$OsebjeListMasonry.masonry('reloadItems');   
	           		$OsebjeListMasonry.masonry('layout');
				}, 300);
			}

          	
     	}
	});
	
});
$(document).ready(function () {

	$('#osebjeSelectFilter').on('change', function (e) {

		var indexSelected = $('#osebjeSelectFilter').prop("selectedIndex");

		$("#activity-indicator-container").html('<div class="loader"><div class="loader-inner ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>');
		$("#activity-indicator-container").css('height', '60px');
		console.log(indexSelected);
		var lang = $('html').attr('xml:lang');
		window.location.hash = indexSelected;
		$.ajax({
			type: 'POST',
			url: '/' + lang + '/ajax/selected',
			dataType: 'json',
			data: {"selected":indexSelected},
			success: function(dataa) {
				console.log(dataa);

				$('#staffListContainer').html(dataa);

				$("#activity-indicator-container").html('');
				$("#activity-indicator-container").css('height', '0px');

				$('#osebjeSearchInput').val('');

				$OsebjeListMasonry.masonry('reloadItems');
				$OsebjeListMasonry.masonry('layout');

			}
		});
	});



    if(window.location.href.indexOf("#1") > -1) // This doesn't work, any suggestions?
    {
            $("#activity-indicator-container").html('<div class="loader"><div class="loader-inner ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>');
        $("#activity-indicator-container").css('height', '60px');
		var lang = $('html').attr('xml:lang');

        $.ajax({
            type: 'POST',
            url: '/' + lang + '/ajax/selected',
            dataType: 'json', 
            data: {"selected":1},
            success: function(dataa) {


                $('#staffListContainer').html(dataa);

                $("#activity-indicator-container").html('');
                $("#activity-indicator-container").css('height', '0px');

                $('#osebjeSearchInput').val('');

                $OsebjeListMasonry.masonry('reloadItems');   
                $OsebjeListMasonry.masonry('layout');

            }
        });
    } if(window.location.href.indexOf("#2") > -1)  // This doesn't work, any suggestions?
    {
            $("#activity-indicator-container").html('<div class="loader"><div class="loader-inner ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>');
        $("#activity-indicator-container").css('height', '60px');
		var lang = $('html').attr('xml:lang');

        $.ajax({
            type: 'POST',
            url: '/' + lang + '/ajax/selected',
            dataType: 'json', 
            data: {"selected":2},
            success: function(dataa) {


                $('#staffListContainer').html(dataa);

                $("#activity-indicator-container").html('');
                $("#activity-indicator-container").css('height', '0px');

                $('#osebjeSearchInput').val('');
                $OsebjeListMasonry.masonry('reloadItems');   
                $OsebjeListMasonry.masonry('layout');

            }
        });
    }
});