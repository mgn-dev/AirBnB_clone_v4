// script to listen for changes on each input checkbox tag
// and check the status of the API
$(document).ready(function () {
    // object to store selected amenities
    let selectedAmenities = {};

    // listen for changes on each input checkbox
    $('input[type="checkbox"]').change(function () {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        if ($(this).is(':checked')) {
            // add amenity to the list
            selectedAmenities[amenityId] = amenityName;
        } else {
            // remove amenity from the list
            delete selectedAmenities[amenityId];
        }

        // update the h4 tag with the list of selected amenities
        const amenityList = Object.values(selectedAmenities).join(', ');
        $('.amenities h4').text(amenityList);
    });

    // check the status of the API
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
        if (data.status === "OK") {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });
});
