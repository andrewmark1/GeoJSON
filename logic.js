// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

var myMap = L.map("map", {
  center: [39.7392, -104.99],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(earthquakeData) {

    // Loop through the cities array and create one marker for each city object
for (var i = 0; i < earthquakeData.length; i++) {

    var color = "";

    if (earthquakeData[i].properties.mag > 5) {
    color = '#FF0000';
    }
    else if (earthquakeData[i].properties.mag > 4) {
    color = '#FF3300';
    }
    
    else if (earthquakeData[i].properties.mag > 3) {
    color = '#FF6600';
    }
    
    else if (earthquakeData[i].properties.mag > 2) {
    color = '#FF9900';
    }
    
    else {
    color = '#FFFF00';
    }
    
    var latlong = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]]
    
 //Add circles to map
    L.circle(latlong, {
        fillOpacity: 0.75,
        color: 'black',
        weight: 1,
        fillColor: color,
        // Adjust radius
        radius: earthquakeData[i].properties.mag * 10000
    }).bindPopup("<h1>" + earthquakeData[i].properties.place + "</h1> <hr> <h3>Magnitude: " + earthquakeData[i].properties.mag + "</h3>").addTo(myMap);
    
//    console.log(earthquakeData[i].properties.mag)
}
    
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [">5",">4",">3",">2",">1"];
    var colors = ['#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFFF00'];
    var labels = [];

    // Add min & max
    var legendInfo = "<h2>Magnitude</h2>"

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push( "<strong>"+limits[index]+"</strong>" + "<li style=\"background-color: " + colors[index] + "\"></li>");
    })

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

}


