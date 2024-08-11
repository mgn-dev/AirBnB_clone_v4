$(document).ready(function () {
    // Objects to store selected amenities, states, and cities
    let selectedAmenities = {};
    let selectedStates = {};
    let selectedCities = {};

    // Listen for changes on each input checkbox
    $('input[type="checkbox"]').change(function () {
        const id = $(this).data('id');
        const name = $(this).data('name');

        if ($(this).is(':checked')) {
            // Determine if it's a state, city, or amenity and add to respective list
            if ($(this).closest('.locations').length) {
                if ($(this).closest('li').parent().parent().has('h2').length) {
                    selectedStates[id] = name;
                } else {
                    selectedCities[id] = name;
                }
            } else {
                selectedAmenities[id] = name;
            }
        } else {
            // Remove from the list
            delete selectedAmenities[id];
            delete selectedStates[id];
            delete selectedCities[id];
        }

        // Update the h4 tag with the list of selected states and cities
        const locationList = [...Object.values(selectedStates), ...Object.values(selectedCities)].join(', ');
        $('.locations h4').text(locationList);

        // Update the h4 tag with the list of selected amenities
        const amenityList = Object.values(selectedAmenities).join(', ');
        $('.amenities h4').text(amenityList);
    });

    // Check the status of the API
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
        if (data.status === "OK") {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // Function to load places based on selected amenities, states, and cities
    function loadPlaces(filters) {
        $.ajax({
            type: 'POST',
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            contentType: 'application/json',
            data: JSON.stringify(filters)
        }).done(function (data) {
            $('section.places').empty(); // Clear previous places
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

    // Initial load of all places
    loadPlaces({});

    // Reload places when the search button is clicked
    $('button').click(function () {
        const filters = {
            amenities: Object.keys(selectedAmenities),
            states: Object.keys(selectedStates),
            cities: Object.keys(selectedCities)
        };
        loadPlaces(filters);
    });
});
