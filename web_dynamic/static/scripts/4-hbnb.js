// script to listen for changes on each input checkbox tag
// check the status of the API
// and send a POST request with selected amenities when the search button is clicked
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

    // function to load places based on selected amenities
    function loadPlaces(amenities) {
        $.ajax({
            type: 'POST',
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            contentType: 'application/json',
            data: JSON.stringify(amenities)
        }).done(function (data) {
            $('section.places').empty(); // clear previous places
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
    }

    // initial load of all places
    loadPlaces({});

    // reload places when the search button is clicked
    $('button').click(function () {
        loadPlaces({ amenities: Object.keys(selectedAmenities) });
    });
});
