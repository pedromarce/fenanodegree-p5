(function () {
  'use strict';

  function AppViewModel() {

    var self = this; // jshint ignore:line

    // Private Variables
    var markers = {};
    var map, servicePlaces, markerInfo;
    var listResults = ko.observableArray([]);

    // DOM variables
    self.searchText = ko.observable('');
    self.filterText = ko.observable('');
    self.selectedMarker = ko.observable('');
    self.instagramPics = ko.observableArray([]);
    self.places = ko.computed(function () {
      var result;
      var returnArray = [];
      // Delete current markers from map
      for (var marker in markers) {
        if (markers.hasOwnProperty(marker)) {
          markers[marker].setMap(null);
        }
      }
      // Add results markers into map
      for (var i = 0; i < listResults().length; i++) {
        result = listResults()[i];
        // filter results not matching filtersearch
        if (self.filterText() === '' || result.name.indexOf(self.filterText()) > -1) {
          returnArray.push(result);
          if (!markers[result.place_id]) {
            markers[result.place_id] = new google.maps.Marker({
              position: result.geometry.location,
              map: map,
              title: result.name,
              animation: google.maps.Animation.DROP
            });
            markers[result.place_id].info = '<div class="infowindow"><h4 class="text-center">' + result.name + '</h4>' +
              '<h5 class="text-center">' + result.vicinity + '</h5>' +
              '<div class="text-center" data-bind="if: instagramPics.length > 0"><button type="button" class="btn btn-primary" data-toggle="modal" data-target=".more-info-modal">Pictures</button></div>' +
              '</div>';
            // Define click function for marker
            // jsint 
            markers[result.place_id].select = function () { 
              var marker = this;
              var css;
              self.selectedMarker(result.name);
              markerInfo.setContent(marker.info);
              markerInfo.open(map, marker);
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function () {
                marker.setAnimation(null);
              }, 1450);
              // retrieve Instagram pictures for the marker selected
              $.when($.getJSON('https://api.instagram.com/v1/media/search?lat=' + marker.position.H.toString() + '&lng=' + marker.position.L + '&distance=15&client_id=3118900e545540e1942dea40b20433ad&callback=?'))
                .done(function (response) {
                  self.instagramPics([]);
                  for (var i = 0; i < response.data.length; i++) {
                    if (i === 0) {
                      css = "item active";
                    } else {
                      css = "item";
                    }
                    self.instagramPics.push({
                      link: response.data[i].images.standard_resolution.url,
                      alt: 'Instagram Image',
                      css: css
                    });
                  }
                })
                .fail(function () {
                  self.instagramPics([]);
                  console.log("Instagram service not available");
                });
            };
            // bind event to defined function
            markers[result.place_id].addListener('click', function () {
              this.select();
            });
            result.marker = markers[result.place_id];
          } else {
            markers[result.place_id].setMap(map);
          }
        }
      }
      return returnArray;
    });

    self.focusMarker = function (result) {
      markers[result.place_id].select();
    };

    self.search = function () {
      var request = {};
      request.location = map.center;
      request.radius = '5000';
      request.name = self.searchText() || 'museu';
      servicePlaces.nearbySearch(request, searchResults);
    };

    function searchResults(results) {
      listResults.removeAll();
      for (var i = 0; i < results.length; i++) {
        listResults.push(results[i]);
      }
    }

    GoogleMapsLoader.LIBRARIES = ["places"];
    GoogleMapsLoader.API = "AIzaSyDV93itKLeicZYEy-9Z1s7JG2aodUGACdw";
    GoogleMapsLoader.load(function (google) {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: 41.3833,
          lng: 2.1833
        },
        zoom: 14
      });
      servicePlaces = new google.maps.places.PlacesService(map);
      var request = {};
      request.location = {
        lat: 41.3833,
        lng: 2.1833
      };
      request.radius = '5000';
      request.name = 'museu';
      servicePlaces.nearbySearch(request, searchResults);
      markerInfo = new google.maps.InfoWindow({
        maxWidth: 300
      });
    });
  }


  $(function () {
    ko.applyBindings(new AppViewModel());
  });

}());


//# sourceMappingURL=app.js.map