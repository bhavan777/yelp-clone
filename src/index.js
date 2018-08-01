import './style.scss';
  (function($) {

    var pos, map;
    var markers = [];
    var places=[];
    var infoWindows = [];

    (function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map = new google.maps.Map(
            document.getElementById('map'), 
            {
              zoom: 15,
              center: pos
            }
          );
          var marker = new google.maps.Marker(
            {
              position: pos,
              map: map,
              icon: 'https://cdn3.iconfinder.com/data/icons/human-resources-management/512/pin_male_man_location-32.png',
              animation: google.maps.Animation.DROP            
            });
        }, function() {
        // Geolocation is turned off/ disbled
        alert('Seems like your device is blocking location services, so we are not able to get your current location. you may want to enable location access for this page to experience a good yelp clone.');
        });
      } else {
        // Browser doesn't support Geolocation
        alert('seems like your device is stuck in the 90s. Please use a modern browser or update your browser to a latest versions.');
      }
    })();

    const renderMarkers = (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          (function(place) {
            let infowindow = new google.maps.InfoWindow({
              content: place.name
            });
            let pos = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
            let marker = new google.maps.Marker(
              {
                position: pos,
                map: map,
                icon: 'https://cdn2.iconfinder.com/data/icons/pittogrammi/142/94-24.png',
                animation: google.maps.Animation.DROP            
              });
              markers.push(marker);
              infoWindows.push(infowindow);
          })(results[i]);
        }
      }
      // renderInfoWindows (results);
    }
    const renderList = (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          (function(place) {
            console.log(place);
            let dp_image = place.photos[0].getUrl({maxWidth: 640});
            let temp = _.template("<div class='place'><div class='dp' style='background-image:url(<%=dp_image%>);'></div><div class='details'><h5><%= heading %></h5><p><%= address%></p></div></div>");
            let _node = temp({heading: place.name, address: place.formatted_address, dp_image: dp_image});
            $('#results').append(_node);
          })(results[i]);
        }
      }
    }
    const handleResults = (results, status) => {
      places = results;
      renderMarkers(results, status);
      renderList(results, status);
    }

    $("#search-form").on('submit', function(e) {
      e.preventDefault();
      let str  = $('#search-input').val();
      var loc = new google.maps.LatLng(pos.lat, pos.lng);
      var request = {
        location: loc,
        radius: '500',
        query: str
      };;    
      var service = new google.maps.places.PlacesService(map);
      service.textSearch(request, handleResults);
    })
  })($);
