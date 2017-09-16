/* Slovenian initialisation for the jQuery UI date picker plugin. */
/* Written by Jaka Jancar (jaka@kubje.org). */
/* c = č, s = š z = ž C = Č S = Š Z = Ž */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}(function( datepicker ) {

datepicker.regional['sl'] = {
	closeText: 'Zapri',
	prevText: '&#x3C;Prejšnji',
	nextText: 'Naslednji&#x3E;',
	currentText: 'Trenutni',
	monthNames: ['Januar','Februar','Marec','April','Maj','Junij',
	'Julij','Avgust','September','Oktober','November','December'],
	monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun',
	'Jul','Avg','Sep','Okt','Nov','Dec'],
	dayNames: ['Nedelja','Ponedeljek','Torek','Sreda','Četrtek','Petek','Sobota'],
	dayNamesShort: ['Ned','Pon','Tor','Sre','Čet','Pet','Sob'],
	/*dayNamesMin: ['Ne','Po','To','Sr','Če','Pe','So'],*/
	dayNamesMin: ['N','P','T','S','Č','P','S'],
	weekHeader: 'Teden',
	dateFormat: 'dd.mm.yy',
	firstDay: 1,
	isRTL: false,
	showOtherMonths:true,
	showMonthAfterYear: false,
	selectOtherMonths: true,
	yearSuffix: ''};
	
datepicker.regional['en-GB'] = {
	closeText: 'Done',
	prevText: 'Prev',
	nextText: 'Next',
	currentText: 'Today',
	monthNames: ['January','February','March','April','May','June',
	'July','August','September','October','November','December'],
	monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	//dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
	dayNamesMin: ['S','M','T','W','T','F','S'],
	weekHeader: 'Wk',
	dateFormat: 'dd.mm.yy',
	firstDay: 1,
	isRTL: false,
	showOtherMonths:true,
	showMonthAfterYear: false,
	selectOtherMonths: true,
	yearSuffix: ''};

//datepicker.setDefaults(datepicker.regional['sl']);

return datepicker.regional['sl'];

}));