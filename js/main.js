//--- Part 1: Create the map and add base map ---
var centerLat = 47.7990583;
var centerLng = 13.0499556;
var offsetLat = centerLat - 0.0015;

var map = L.map('map', {
  center: [offsetLat, centerLng],
  zoom: 15
});

var osmap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CARTO</a> © OpenStreetMap contributors',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);


var baseMaps = {
  "Open Street Map": osmap
};

//--- Part 2: Add scale bar ---
L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);

//--- Part 3: Double click alert ---
map.addEventListener('dblclick', function (e) {
  alert(e.latlng);
});

//--- Part 4: Define custom icons ---
var iconBuilding = L.icon({
  iconUrl: 'css/images/building-icon.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

var iconStatue = L.icon({
  iconUrl: 'css/images/statue-icon.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

var iconInfo = L.icon({
  iconUrl: 'css/images/info-icon.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

//--- Part 5: Prepare layers containers ---
var artLayer = L.layerGroup();
var residenceLayer = L.layerGroup();
var touristInfoLayer = L.layerGroup();

//--- Part 6: Marker creation with hover effect ---
function createMarker(feature, icon) {
  var latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
  var name = feature.properties.name || "Mozart Location";
  var description = feature.properties.description || "";
  var url = feature.properties.website || "#";
  var imageUrl = feature.properties.image || null;

  var marker = L.marker(latlng, {
    icon: icon,
    title: name
  });

  var popupContent = `<b>${name}</b><br>`;
  if (description) popupContent += `${description}<br>`;
  popupContent += `<a href="${url}" target="_blank" rel="noopener noreferrer">Read more</a>`;
  if (imageUrl) {
    popupContent += `<br><img src="${imageUrl}" alt="${name}" style="max-width:200px; margin-top:5px;">`;
  }
  marker.bindPopup(popupContent);

  marker.on('click', function () {
    var pos = marker.getLatLng();
    map.flyTo([pos.lat - 0.0015, pos.lng], 18, { duration: 1.5 });
    setTimeout(() => marker.openPopup(), 1600);
  });

  marker.on('mouseover', function () {
    marker.setIcon(L.icon({
      iconUrl: icon.options.iconUrl,
      iconSize: [55, 55],
      iconAnchor: [27, 55],
      popupAnchor: [0, -50]
    }));
  });

  marker.on('mouseout', function () {
    marker.setIcon(icon);
  });

  return marker;
}

//--- Part 7 and 8: Load GeoJSON and distribute features + layer control ---
var features = {};
var layerControl = L.control.layers(baseMaps, features, { position: 'topleft' }).addTo(map);

fetch('data/mozart.geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      var tourismType = feature.properties.tourism || "";
      var nameLower = (feature.properties.name || "").toLowerCase();
      var icon;

      if (tourismType === "information") {
        icon = iconInfo;
      } else if (
        tourismType === "museum" &&
        (nameLower.includes("residence") || nameLower.includes("birthplace"))
      ) {
        icon = iconBuilding;
      } else {
        icon = iconStatue;
      }

      var marker = createMarker(feature, icon);

      if (tourismType === "artwork") {
        artLayer.addLayer(marker);
      } else if (tourismType === "museum") {
        residenceLayer.addLayer(marker);
      } else if (tourismType === "information") {
        touristInfoLayer.addLayer(marker);
      }
    });

    artLayer.addTo(map);
    residenceLayer.addTo(map);
    touristInfoLayer.addTo(map);

    layerControl.addOverlay(artLayer, "Art");
    layerControl.addOverlay(residenceLayer, "Residences");
    layerControl.addOverlay(touristInfoLayer, "Tourist Info");

    //--- Part 9: Central marker ---
    L.marker([centerLat, centerLng])
      .addTo(map)
      .bindPopup("Mozart Tour Starts Here!")
      .openPopup();

    //--- Part 10: Custom Legend ---
    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += '<h4>Legend</h4>';
      div.innerHTML += '<div><img src="css/images/statue-icon.png" height="24" style="vertical-align:middle; margin-right:6px;">Art</div>';
      div.innerHTML += '<div><img src="css/images/building-icon.png" height="24" style="vertical-align:middle; margin-right:6px;">Residences</div>';
      div.innerHTML += '<div><img src="css/images/info-icon.png" height="24" style="vertical-align:middle; margin-right:6px;">Tourist Info</div>';
      return div;
    };

    legend.addTo(map);






    // --- Part 11 (after feedback): Tour route with numbered markers ---

    // Step 1: Filter valid point features
    const validFeatures = data.features.filter(f =>
      f.geometry && f.geometry.type === "Point" && Array.isArray(f.geometry.coordinates)
    );

    // Step 2: Sort features by distance to start point (centerLat, centerLng)
    const startPoint = L.latLng(centerLat, centerLng);
    const sortedFeatures = validFeatures.slice().sort((a, b) => {
      const aDist = L.latLng(a.geometry.coordinates[1], a.geometry.coordinates[0]).distanceTo(startPoint);
      const bDist = L.latLng(b.geometry.coordinates[1], b.geometry.coordinates[0]).distanceTo(startPoint);
      return aDist - bDist;
    });

    // Step 3: Convert to Leaflet-friendly [lat, lng]
    const tourCoordinates = sortedFeatures.map(f => {
      const [lng, lat] = f.geometry.coordinates;
      return [lat, lng];
    });

    // Step 4: Prepend start coordinate if missing
    const tourStartCoord = [centerLat, centerLng];
    const alreadyIncluded = tourCoordinates.some(coord =>
      coord[0] === tourStartCoord[0] && coord[1] === tourStartCoord[1]
    );
    if (!alreadyIncluded) {
      tourCoordinates.unshift(tourStartCoord);
    }

    console.log("Tour coordinates (ordered):", tourCoordinates);

    // Draw the polyline for the route
    if (tourCoordinates.length >= 2) {
      const tourRoute = L.polyline(tourCoordinates, {
        color: 'orange',
        weight: 4,
        opacity: 0.9,
        dashArray: '8,6'
      }).addTo(map);

      // Add numbered markers along the route indicating order
      for (let i = 0; i < tourCoordinates.length; i++) {
        L.marker(tourCoordinates[i], {
          icon: L.divIcon({
            className: 'numbered-marker',
            html: `<div style="background:orange; border-radius:20%; width:18px; height:18px; line-height:18px; color:#fff; text-align:center; font-weight:bold;">${i + 1}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          }),
          interactive: false
        }).addTo(map);
      }

      // Fit map bounds to the route
      map.fitBounds(tourRoute.getBounds());

    } else {
      console.warn("Not enough valid points to draw the tour route.");
    }
  });
