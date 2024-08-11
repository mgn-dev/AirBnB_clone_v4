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
            delete selectedAmenities[id];
            delete selectedStates[id];
            delete selectedCities[id];
        }

        const locationList = [...Object.values(selectedStates), ...Object.values(selectedCities)].join(', ');
        $('.locations h4').text(locationList);

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
                    <div class="reviews">
                        <h2>Reviews</h2> <span class="toggle-reviews" data-place-id="${place.id}">show</span>
                        <div class="review-list"></div>
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

    // Toggle reviews on clicking the span
    $(document).on('click', '.toggle-reviews', function () {
        const span = $(this);
        const placeId = span.data('place-id');
        const reviewList = span.siblings('.review-list');

        if (span.text() === "show") {
            // Fetch and display reviews
            $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`, function (reviews) {
                reviews.forEach(review => {
                    const reviewTemplate = `
                    <div class="review">
                        <h3>From ${review.user.first_name} ${review.user.last_name} the ${new Date(review.created_at).toLocaleDateString()}</h3>
                        <p>${review.text}</p>
                    </div>`;
                    reviewList.append(reviewTemplate);
                });
                span.text("hide");
            });
        } else {
            // Hide reviews
            reviewList.empty();
            span.text("show");
        }
    });
});
