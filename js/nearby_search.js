
// implement below after loading the whole html document
// if it does not load the whole document, it may not have 'map' and introduce error
// this type of function is provided by jquery
$(function() {
    var DEFAULT_ZOOM = 15;
    var GOOGLE_API_KEY = 'AIzaSyAUskRwMCXWvs6l5EIJu48d7YSsMJjvtws';

    var current_infowindow;
    var markers_shown;

    function initMap() {
        var position = {lat: 37.773972, lng: -122.43129};
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: DEFAULT_ZOOM,
            center: position
        });

      //  $.ajax({
      //      url: '/places-info',
      //      data: {
      //          'type': 'restaurant',
      //          'lat': position.lat,
      //          'lng': position.lng,
      //          'radius': 500
      //      },
      //      success: function(data) {
      //          debugger;
      //      }
      //  });
      // var marker = new google.maps.Marker({
      //     position: position,
       //     map: map
       // });

        var params = {
            'location': new google.maps.LatLng(position.lat, position.lng),
            'radius': 500,
            'type': 'restaurant'
        };
        getNearByPlaces(map, params);

        $('.place-info-visibility-toggle').on('click', function() {
            $('#place-info-wrapper').toggleClass('visible');
            $('#place-info-wrapper .triangle-icon').toggleClass('left');
        });

        var search_bar = new SearchBar(function(type) {
            var params = {
                 'location': new google.maps.LatLng(position.lat, position.lng),
                 'radius': 500,
                 'type': type
            };
            getNearByPlaces(map, params);
        });
        search_bar.addTo($('body'));
    };
    
    function showDetailedInfo(place) {
        var params = {
            placeId: place['place_id']
        };
        service.getDetails(params, function(place) {
            $('#hero-header-wrapper img').removeAttr('src');

            if (place.photos) {
                $('#hero-header-wrapper img').attr('src', place.photos[0].getUrl({'maxWidth': 408, 'maxheight': 407}));
            }
            $('.place-name').text(place['name']);
            $('.place-review-score').text(place['rating']);
            $('.place-type').text(place['types'][0]);
            $('#place-info-wrapper').addClass('visible');
            $('#place-info-wrapper').addClass('is-active');
        });
    };

    function getNearByPlaces(map, params) {
        if (markers_shown) {
            _.each(markers_shown, function(marker) {
                marker.setMap(null);
            });
        }
        markers_shown = [];
        //generate a google map api and use the PlacesService
        service = new google.maps.places.PlacesService(map);
        // use the API of nearbySearch
        // pass the parameters and the callback function
        // When we realize nearby search, we need to visit server of google. Therefore, there may be delay. However, we do not want users to wait. If you pass the callback function into the API, when the request is returned, the callback function will be implemented to realize relevant function
        service.nearbySearch(params, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // here we use API of underscore
                _.each(results, function(place) {
                    var marker = new google.maps.Marker({
                        position: {
                            'lat': place.geometry.location.lat(),
                            'lng': place.geometry.location.lng()
                        },
                        map: map,
                        title: place.name
                    });
                    var infowindow_content = '<div id="content">' +
                                            '<h1 id="firstHeading" class="firstHeading">' + place.name + '</h1>'+
                                             '</div>';
                    var infowindow = new google.maps.InfoWindow({
                        content: infowindow_content
                    });

                    marker.addListener('click', function() {
                        if (current_infowindow) {
                            current_infowindow.close();
                        }
                        infowindow.open(map, marker);
                        current_infowindow = infowindow;

                        showDetailedInfo(place);
                        map.setOptions({'mapTypeControl': false});
                    });

                    markers_shown.push(marker);
                });
            }
        });
    }

    function dismissDetailedInfo() {
        $('#place-info-wrapper').removeClass('is-active');
    }

    initMap();
});
