//--- Part 1: Create the map and add base map ---
// Central marker coordinates
var centerLat = 47.7990583;
var centerLng = 13.0499556;
// Offset latitude slightly south for better visual center
var offsetLat = centerLat - 0.0015;

var map = L.map('map', {
	center: [offsetLat, centerLng],
	zoom: 15
});

var osmap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
}).addTo(map);

var baseMaps = {
	"Open Street Map": osmap
};

//--- Part 2: Add scale bar ---
L.control.scale({position:'bottomright', imperial:false}).addTo(map);

//--- Part 3: Double click alert ---
map.addEventListener('dblclick', function(e) {
    alert(e.latlng);
});

//--- Part 4: Define icons ---
var iconInfo = L.icon({
	iconUrl: 'css/images/marker-icon.2x.png',
	iconSize: [25, 25]
});

var iconHouse = L.icon({
	iconUrl: 'css/images/house.png',
	iconSize: [25, 25]
});

//--- Part 5: Prepare layers containers ---
var artLayer = L.layerGroup();
var residenceLayer = L.layerGroup();
var touristInfoLayer = L.layerGroup();

//--- Part 6: Load GeoJSON and separate features into layers ---
fetch('data/mozart.geojson')
  .then(response => response.json())
  .then(data => {
    // Separate GeoJSON features by tourism type
    data.features.forEach(feature => {
      var tourismType = feature.properties.tourism || "";
      var latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

      // Decide icon based on name or tourism type
      var nameLower = (feature.properties.name || "").toLowerCase();
      var isInfoPoint = nameLower.includes("info");
      var icon = isInfoPoint ? iconInfo : iconHouse;

      // Create marker with popup
      var marker = L.marker(latlng, { icon: icon, title: feature.properties.name || "Mozart Attraction" });

      // Build popup content
      var name = feature.properties.name || "Unknown Location";
      var description = feature.properties.description || "";
      var url = feature.properties.website || "#";
      var imageUrl = feature.properties.image || null;

      var popupContent = `<b>${name}</b><br>`;
      if (description) popupContent += `${description}<br>`;
      popupContent += `<a href="${url}" target="_blank" rel="noopener noreferrer">Read more</a>`;
      if (imageUrl) {
        popupContent += `<br><img src="${imageUrl}" alt="${name}" style="max-width:200px; margin-top:5px;">`;
      }

      marker.bindPopup(popupContent);

      // On click, fly to location with offset and open popup
      marker.on('click', function() {
        var pos = marker.getLatLng();
        // Offset the lat slightly south
        map.flyTo([pos.lat - 0.0015, pos.lng], 18, { duration: 1.5 });
        setTimeout(() => {
          marker.openPopup();
        }, 1600);
      });

      // Add marker to the correct layer based on tourism type
      if (tourismType === "artwork") {
        artLayer.addLayer(marker);
      } else if (tourismType === "museum") {
        residenceLayer.addLayer(marker);
      } else if (tourismType === "information") {
        touristInfoLayer.addLayer(marker);
      }
    });

    // Add all layers to map initially (or you can choose to add only some)
    artLayer.addTo(map);
    residenceLayer.addTo(map);
    touristInfoLayer.addTo(map);

    // Add overlays for layer control
    features["Art"] = artLayer;
    features["Residences"] = residenceLayer;
    features["Tourist Info"] = touristInfoLayer;

    layerControl.addOverlay(artLayer, "Art");
    layerControl.addOverlay(residenceLayer, "Residences");
    layerControl.addOverlay(touristInfoLayer, "Tourist Info");
  })
  .catch(err => console.error('Error loading mozart.geojson:', err));

//--- Part 7: Layer control ---
var features = {};
var layerControl = L.control.layers(baseMaps, features, {position: 'topleft'}).addTo(map);

//--- Part 8: Central marker ---
L.marker([centerLat, centerLng])
  .addTo(map)
  .bindPopup("Mozart Tour Starts Here!")
  .openPopup();
