const request = require('request')

const forecast = (latitude, longitude, callback) => {

    const weatherstackURL = `http://api.weatherstack.com/current?access_key=6b8c51e2a358aa1f02db82dafcd82d02&query=${latitude.toFixed(2)},${longitude.toFixed(2)}`
    const openWeatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude.toFixed(2)}&lon=${longitude.toFixed(2)}&units=metric&appid=e961e8897dead2674435d9d1823e2837`

    request({ url: weatherstackURL, json: true }, (error, { body: bodyResponse }) => {// DESTRUCTURED FUNCTION ARGUMENT OBJECT (response)

        //const {body} = response // DESTRUCTURED response

        if (error) {

            callback('Unable to connect to weather services!', undefined)

        } else if (!bodyResponse.cod === 200 || bodyResponse.success === false) {// oppure response.success === false

            callback('Unable to find location.', undefined)

        } else {

            let data = {}

            if (bodyResponse.current) {//weatherstackURL
                
                const { name: locationName, localtime } = bodyResponse.location // DESTRUCTURED body.location
                const { temperature, humidity, precip, wind_speed: windSpeed, weather_icons } = bodyResponse.current // DESTRUCTURED body.current
                

                data = {
                    location: locationName,
                    localtime, // DESTRUCTURED shorthand
                    temperature, // DESTRUCTURED shorthand
                    humidity, // DESTRUCTURED shorthand
                    windSpeed, // DESTRUCTURED shorthand
                    icon : (weather_icons) ? weather_icons[0] : '',
                    precipPrevision : `probability of precip : ${precip}%`
                    //full_data : response.body
                }
            } else {//openWeatherURL

                const { name: location } = bodyResponse // DESTRUCTURED body
                const { temp: temperature, humidity } = bodyResponse.main // DESTRUCTURED body.main
                const { speed: windSpeed } = bodyResponse.wind // DESTRUCTURED body.wind
                data = {
                    location, // DESTRUCTURED shorthand
                    temperature,//DESTRUCTURED shorthand
                    humidity,//DESTRUCTURED shorthand
                    windSpeed,
                    icon : '',
                    precipPrevision :  `probability of precip : "data not provided" `
                    //full_data : response.body
                }
            }
            callback(undefined, data)
        }

    })
}


module.exports = forecast