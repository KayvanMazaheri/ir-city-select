// `data` should be filled with provinces and their cities in json format

$(document).ready(function() {
	$('.province').each(loadProvinces);
	$('.province').change(loadCities);
});

var loadProvinces = function() {
	var element = $(this);
	element.empty();
	element.append($('<option></option>').attr('value', 'empty'));
	$.each(data, function(province, list) {
		var option = $('<option></option>').attr('value', province).text(province);
		element.append(option);
	});
};

var loadCities = function() {
	var citySelector = $(this).closest('div').find('.city');
	var selectedProvince = $(this).val();
	var cityList = data[selectedProvince];

	citySelector.empty();

	$.each(cityList, function(index, city) {
		var option = $('<option></option>').attr('value', city).text(city);
		citySelector.append(option);
	});
};