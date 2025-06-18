//--- Part 1: Create the map and add base map ---
var centerLat = 47.7990583;
var centerLng = 13.0499556;
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

    // Fly to and open popup on click
    marker.on('click', function () {
        var pos = marker.getLatLng();
        map.flyTo([pos.lat - 0.0015, pos.lng], 18, { duration: 1.5 });
        setTimeout(() => marker.openPopup(), 1600);
    });

    // Enlarge icon on hover
    marker.on('mouseover', function () {
        marker.setIcon(L.icon({
            iconUrl: icon.options.iconUrl,
            iconSize: [55, 55],
            iconAnchor: [27, 55],
            popupAnchor: [0, -50]
        }));
    });

    // Restore original size on mouse out
    marker.on('mouseout', function () {
        marker.setIcon(icon);
    });

    return marker;
}

//--- Part 7: Load GeoJSON and distribute features ---
fetch('data/mozart.geojson')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            var tourismType = feature.properties.tourism || "";
            var nameLower = (feature.properties.name || "").toLowerCase();
            var icon;

            // Choose icon based on type
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

        // Add all layers to map
        artLayer.addTo(map);
        residenceLayer.addTo(map);
        touristInfoLayer.addTo(map);

        // Add to layer control
        features["Art"] = artLayer;
        features["Residences"] = residenceLayer;
        features["Tourist Info"] = touristInfoLayer;

        layerControl.addOverlay(artLayer, "Art");
        layerControl.addOverlay(residenceLayer, "Residences");
        layerControl.addOverlay(touristInfoLayer, "Tourist Info");
    })
    .catch(err => console.error('Error loading mozart.geojson:', err));

//--- Part 8: Layer control ---
var features = {};
var layerControl = L.control.layers(baseMaps, features, { position: 'topleft' }).addTo(map);

//--- Part 9: Central marker ---
L.marker([centerLat, centerLng])
    .addTo(map)
    .bindPopup("Mozart Tour Starts Here!")
    .openPopup();
