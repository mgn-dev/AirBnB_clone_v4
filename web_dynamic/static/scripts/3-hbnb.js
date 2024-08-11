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

    // request to get places
    $.ajax({
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        contentType: 'application/json',
        data: JSON.stringify({})
    }).done(function (data) {
        for (const place of data) {
            const template = `
            <article>
                <div class="title_box">
                    <h2>${place.name}</h2>
                    <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                    <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                    <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                    <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div class="description">
                    ${place.description}
                </div>
            </article>`;
            $('section.places').append(template);
        }
    });
});
