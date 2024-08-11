// Script to listen for changes on each input checkbox tag
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
});
