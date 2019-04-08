const express = require('express');
const path = require('path')
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express()

// Defined paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to server
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Aran O',
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: 'Aran O',
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is some helpful text',
    title: 'Help',
    name: 'Aran'
  })
})

app.get('/help/*', (req, res) => {
  res.send('Help article not found')
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    res.send({
      error: 'Error! No address',
    })
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({error})
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({error})
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })

  /*res.send([{
    forecast: 'It`s snowing',
    location: 'Philadelphia',
    address: req.query.address
  }])*/
})

app.get('/product', (req, res) => {
  if (!req.query.search) {
    res.send({
      error: 'You must provide a search term'
    })
  }

  console.log(res.query.search);
  res.send({
    products: [],

  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Aran',
    errorMessage: 'Help article not found.',
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Aran',
    errorMessage: 'Page not found.',
  })
})

app.listen('3000', () => {
  console.log('Server is up on port 3000');
})