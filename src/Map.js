class Map{
  constructor() {
    this.markers = [];
    this.infowindows = [];
    this.places = [];
    this.map;
    this.pos;
  }
  init() {
    var pos,marker;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.pos = pos;
        var map = new google.maps.Map(
          document.getElementById('map'), 
          {
            zoom: 15,
            center: pos
          }
        );
        marker = new google.maps.Marker(
          {
            position: pos,
            map: map,
            animation: google.maps.Animation.DROP            
          });
        this.map = map;
        return true;
      }, function() {
      // Geolocation is turned off/ disbled
      alert('Seems like your device is blocking location services, so we are not able to get your current location. you may want to enable location access for this page to experience a good yelp clone.');
      });
    } else {
      // Browser doesn't support Geolocation
      alert('seems like your device is stuck in the 90s. Please use a modern browser or update your browser to a latest versions.');
    }
  }
  renderMarkers () {
    let places = this.places;
    console.log('len',this.places.length);
    console.log('test1');
    const map = this.map;
    for(var i=0; i < places.length; i++) {
      console.log('test2');
      (function(i) {
        console.log('test3');
        markers.push(marker);  
      })(i);
    }
  }
  renderResults () {
    // const places = this.places;

  }
  search (str) {
    var pos = this.pos;
    var loc = new google.maps.LatLng(pos.lat, pos.lng);
    var request = {
      location: loc,
      radius: '500',
      query: str
    };;
  
    var map= this.map;
    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, );
    // this.renderMarkers();
  }
}

export { Map as default};