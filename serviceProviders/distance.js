const geolib = require('geolib');

exports.distanceFinder = (location1, location2) => {
    var x = geolib.isPointWithinRadius(
        { latitude: location1.lat, longitude: location1.long },
        { latitude: location2.lat, longitude: location2.long },
        5000
    );
    console.log(x);

}