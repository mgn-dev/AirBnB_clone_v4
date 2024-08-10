$(document).ready(function() {
    // Object to store selected amenities
    let selectedAmenities = {};

    // Listen for changes on each checkbox input tag
    $('input[type="checkbox"]').change(function() {
        const amenityId = $(this).attr('data-id');
        const amenityName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            // If the checkbox is checked, store the Amenity ID and name
            selectedAmenities[amenityId] = amenityName;
        } else {
            // If the checkbox is unchecked, remove the Amenity ID
            delete selectedAmenities[amenityId];
        }

        // Update the h4 tag inside the div Amenities with the list of checked amenities
        const amenityList = Object.values(selectedAmenities).join(', ');
        $('div.amenities h4').text(amenityList);
    });
});
