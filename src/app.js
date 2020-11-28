const path = require('path')
const express = require('express')
const hbs = require('hbs')//- uso handlebar(manubrio) come plugin per i template
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')



// NEW WEB SERVER EXPRESS APP
const app = express()
const port = process.env.PORT || 3000

// PATHS VARIABLES FOR EXPRESS CONFIG

//console.log(__dirname) // directory current script
//console.log(__filename)// directory current js file
//console.log(path.join(__dirname, '../public'))// directory current js file
const publicDirectoryPath = path.join(__dirname, '../public') // Web app root Path
const viewsPath = path.join(__dirname, '../templates/views') // views directory path
const partialsPath = path.join(__dirname, '../templates/partials') // views directory path

// SET/CUSTOMIZE WEB SERVER EXPRESS

// view engine
app.set('view engine', 'hbs') // cerca i file nella cartella delle viste(DEFAULT -> views) invece che in public, l'estensione diventa hbs invece che html 
// views path (template invece che il default(views))
app.set('views', viewsPath) // punta alla cartella templates invece views(DEFAULT) per cercare le viste
// handlebars hbs directory for partials
hbs.registerPartials(partialsPath) //default extension .hbs

// Funziona come la configurazioe della radice di un qualsiasi web-server 
// dove andrà a cercarsi la index.html salvo dicersa configurazione
// Con questo comando la directory di default su ciu cercare la index diventa "publicDirectoryPath"
// Questo non compromette l'utilizzo di routes statici del tipo: 
// app.get('/staticRoutePage', (req, res) => {
//    res.send('<p>content</p>')
// })
// se esiste una pagina con lo stesso nome di un route statico quest'ultimo avrà la precedenza
app.use(express.static(publicDirectoryPath))


// --------------- VIEWS ---------------- .hbs ext.-//
// weather (home)
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        author: 'Commongroup'
    })// Il template può anche essere specificato senza estensione
})
//about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        author: 'Commongroup'
    })
})

//help
app.get('/help', (req, res) => {
    res.render('help.hbs', {
        title: 'Help',
        author: 'Commongroup',
        message: 'I need help, to complete this course...it\'s too long',
    })
})

//weather
app.get('/weather', (req, res) => {

    // controllo nel il querystring il valore "address" passato
    const address = req.query.address

    // se non presente
    if (!address) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    // se presente invoco la funzione geocode  
    geocode(address, (geocodeError,  { latitude, longitude, location: geocodeLocation } = {}) => {// DESTRUCTURED FUNCTION ARGUMENT OBJECT (geocodeData) 
        // se si verifica un errore di comunicazione dati... 
        if (geocodeError) {
            return res.send({
                error: geocodeError //error: error
            })
        }
        // se invece recupero le coordinate..
        forecast(latitude, longitude, (forecastError, { location: forecastLocation, temperature, precipPrevision } = {}) => { // DESTRUCTURED FUNCTION ARGUMENT OBJECT (forecastData)
            if (forecastError) {
                return res.send({
                    error: forecastError //error: error
                })
            }
            res.send({
                forecast: `${forecastLocation} temperature is currently ${temperature.toFixed(1)} degrees out, ${precipPrevision}`,
                location: forecastLocation, // geocodeData.location destrured = property name location
                address: req.query.address,
                //homePage:"http://192.168.1.64:3000"
            })
        })
    })
})

//test api
/*
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })  
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})*/


// help 404 // il carattere * corrisponde a qualsiasi pagina non specificata
app.get('/help/*', (req, res) => {
    res.render('404.hbs', {
        title: 'Error 404',
        author: 'Commongroup',
        message: 'Help article not found!',
    })
})

// 404 
app.get('*', (req, res) => {
    res.render('404.hbs', {
        title: 'Error 404',
        author: 'Commongroup',
        message: 'Page not found!',
    })
})


// SERVER UP
app.listen( port , () => {
    console.log('Server Express is up on port ' + port + '!')
})