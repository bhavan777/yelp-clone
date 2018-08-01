import './style.scss';
  (function($) {

    var pos, map;
    var markers = [];
    var places=[];
    var infoWindows = {};

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
              zoom: 14,
              center: pos
            }
          );
          var marker = new google.maps.Marker(
            {
              position: pos,
              map: map,
              icon: 'https://image.flaticon.com/icons/png/32/727/727636.png',
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

    const toggleInfoWindow = (infowindow, marker) => {
      for(var i = 0; i < markers.length ; i++) {
        infoWindows[markers[i].place_id].close();
        markers[i].setIcon({url: 'https://image.flaticon.com/icons/png/32/684/684908.png'});
      }
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ marker.setAnimation(null); }, 500);

      marker.setIcon({url: 'https://image.flaticon.com/icons/png/32/149/149060.png'});
      map.panTo(marker.position);
      infowindow.open(map, marker);
      let elem = $('#results .place[data-id='+marker.place_id+']');
      $("#results .place.active").removeClass('active');
      elem.addClass('active');
      $('#results').animate({ scrollTop: $('#results').scrollTop() + $(elem).offset().top - $('#results').offset().top -100 }, { duration: 'slow', easing: 'swing'});
    }

    const setActive = (id) => {
      for(var i=0; i< markers.length;i++) {
        (function (place){
          if(place.place_id === id) {
            map.panTo(place.position);
            place.setIcon({url: 'https://image.flaticon.com/icons/png/32/149/149060.png'});
            place.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ place.setAnimation(null); }, 500);
            infoWindows[place.place_id].open(map, place);
          } else {
            place.setIcon({url: 'https://image.flaticon.com/icons/png/32/684/684908.png'});
            infoWindows[place.place_id].close();
          }
        })(markers[i]);
      }
    }
    const renderMarkers = (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        // reset old results
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        // reset map to center
        map.panTo(pos);
        for (var i = 0; i < results.length; i++) {
          (function(place) {
            console.log(place);
            let temp = _.template("<div class='info-wrap'><div class='info-details <%=dp_class%>'><h3><%=title%></h3><p><%=address%></p></div><div class='info-dp <%=dp_class%>' style='background-image:url(<%=dp%>);'></div></div>");
            let dp = place.photos ? place.photos[0].getUrl({maxWidth: 640}) : 'https://www.arizonafindhomes.com/assets/images/image-not-available.jpg';
            let dp_class = place.photos ? '' : 'no-image';
            let content = temp({title: place.name, address: place.formatted_address, dp, dp_class});
            let infowindow = new google.maps.InfoWindow({
              content: content
            });
            infowindow.setOptions({maxWidth:400});
            let pos = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
            let marker = new google.maps.Marker(
              {
                position: pos,
                map: map,
                icon: 'https://image.flaticon.com/icons/png/32/684/684908.png',
                animation: google.maps.Animation.DROP,
                place_id: place.id    
              });
              marker.addListener('click', function() {
                toggleInfoWindow(infowindow, marker);
              });
              markers.push(marker);
              infoWindows[place.id]= infowindow;
          })(results[i]);
        }
      }
    }
    const renderList = (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        $('#results').html(''); //reset old results
        for (var i = 0; i < results.length; i++) {
          (function(place) {
            let dp_image = place.photos ? place.photos[0].getUrl({maxWidth: 640}) : 'https://www.arizonafindhomes.com/assets/images/image-not-available.jpg';
            let temp = _.template("<div data-id=<%=id%> class='place'><div class='dp' style='background-image:url(<%=dp_image%>);'></div><div class='details'><h5><%= heading %></h5><p><%= address%></p></div></div>");
            let _node = temp({heading: place.name, address: place.formatted_address, dp_image: dp_image, id: place.id});
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

    $("button.reset").on('click', function(){
      $("#search-input").val('');
      $("#search-form").submit();
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      map.panTo(pos);
      $("#map, #results").removeClass('active');
      
    })

    $("#search-form").on('submit', function(e) {
      e.preventDefault();
      let str  = $('#search-input').val().trim();
      // $('#search-input').val('');
      if(str != '') {
        $("#map, #results").addClass('active');
        var loc = new google.maps.LatLng(pos.lat, pos.lng);
        var request = {
          location: loc,
          radius: '500',
          query: str
        };;    
        var service = new google.maps.places.PlacesService(map);
        service.textSearch(request, handleResults);
      }
    });

    $("#results").on('click', '.place', function(){
      let _id= $(this).attr('data-id');
      $("#results .active").removeClass('active');
      $(this).addClass('active');
      setActive(_id);
    });
  })($);
