console.log('Client side javascript is loaded')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const paragraphSuccess = document.querySelector('#success')
const paragraphError = document.querySelector('#error')


weatherForm.addEventListener('submit', (e) => {

    e.preventDefault()


    const location = search.value
    const weatherApiUrl = 'http://192.168.1.64:3000/weather?address=' + location;

    paragraphError.textContent = ''
    paragraphSuccess.innerHTML = 'Loading...'

    fetch(weatherApiUrl).then((response) => {

        response.json().then((data) => {
            if (data.error) {
                return paragraphError.textContent = data.error
            }

            paragraphSuccess.innerHTML = data.address.toUpperCase() + ':<br>' + data.forecast
        })
    })
    //const data = getWeather(location);
    //console.log(data);
})