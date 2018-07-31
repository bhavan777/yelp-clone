class Map{
  constructor() {
    this.markers = [];
    this.infowindows = [];
    this.places = [];
    this.map;
  }
  test(str = 'test') {
    alert(str);
  }
  init() {
    var pos;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }, function() {
      // Geolocation is turned off/ disbled
      alert('seems like your device supports location services, but something went wrong and we are not able to get your current location. you may want to enable location access for this page to experience a goog yelp clone.');
      });
    } else {
      // Browser doesn't support Geolocation
      alert('seems like your device is stuck in the 90s. Please use a modern browser or update your browser to a latest versions.');
    }
    var position = new google.maps.LatLng(pos);
    this.map = new google.maps.Map(document.getElementById('map'), {
        center: position,
        zoom: 14
      });
    // this.test();
    var marker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: 'you are here'
    });  
  }
  search(str) {
    var request = {
      query: 'Museum of Contemporary Art Australia',
      fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry']
    };  
    var service = new google.maps.places.PlacesService(this.map);
    service.findPlaceFromQuery(request, this.test(data));
  }
}

export { Map as default};