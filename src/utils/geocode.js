const request = require('request')

/**
 * 
 * @param {string} address 
 * @param {function} callback 
 */
const geocode = (address, callback) => {
    //encodeURIComponent es. "?" = "%3F"
    const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?` +
        'access_token=pk.eyJ1IjoibWFwYm94c3ZpbHVwcG8iLCJhIjoiY2toaGdzMXUwMTFwejJ6bHU0a2M0eGx4NiJ9.Vlr1-tzbnh2C9GdJ1p2Uug&limit=1';

    request({ url: geocodeURL, json: true }, (error, { body: bodyResponse }) => {// DESTRUCTURED FUNCTION ARGUMENT OBJECT (response)
        //const {body} = response // DESTRUCTURED response.body
        const { features } = bodyResponse // DESTRUCTURED body.features
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (!features || features.length === 0) {
            callback('Unable to find location!', undefined)
        } else {
            const { place_name: location, center } = features[0]; // DESTRUCTURED features[0]
            const [longitude, latitude] = center; // DESTRUCTURED ARRAY features[0].center
            const data = {
                latitude, // : features[0].center[1],
                longitude, // : features[0].center[0],
                location, // : features[0].place_name // oppure text
            }
            callback(undefined, data)
        }
    })
}

module.exports = geocode