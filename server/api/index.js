const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const app = express()

const googleFormFields = {
  li_fat_id: '844537053',
  lastName: '234622488',
  firstName: '310606533',
  email: '472229466',
  title: '1177780878',
  company: '1313009456',
  countryCode: '1430380922',
  currency: '1675564272',
  value: '1276096038',
  acxiomId: '703955549',
  oracleMoatId: '48487709',
}

const whitelist = ['https://linkedin-online-capi-dreamdata.vercel.11app']

const corsOptions = {
  origin: function (origin, callback) {
    const isWhitelisted = whitelist.includes('*') || whitelist.includes(origin)
    callback(null, isWhitelisted)
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204, // Some legacy browsers choke on a 204 response.
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Headers',
    'X-Requested-With',
  ], // Add headers you want to allow here.
  exposedHeaders: ['Content-Type'], // Add headers that you want to expose to the frontend.
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// GET route for the root endpoint
app.get('/', (req, res) => {
  res.send(`Server is running on port 4000.`) // Assuming your server is running on port 4000
})

// POST route for form submission
app.post('/submit-google-form', async (req, res) => {
  try {
    const formData = req.body
    const formDataEntries = Object.entries(formData)

    // Prepare data in the required format for Google Forms
    const postData = formDataEntries
      .map(([key, value]) => {
        const fieldName = googleFormFields[key]
        return `entry.${fieldName}=${encodeURIComponent(value)}`
      })
      .join('&')

    // Send a POST request to Google Forms
    await axios.post(
      'https://docs.google.com/forms/d/e/1FAIpQLSe-8d-XpykGeLDdGzroOw8hXgE0L_HqUnEw1VH6qBIlnFSeKg/formResponse?usp=pp_url',
      postData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    console.log('Form submitted successfully')
    res
      .status(200)
      .json({ success: true, message: 'Form submitted successfully' })
  } catch (error) {
    console.error('Error submitting form:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

app.listen(4000, () => console.log('Server ready on port 4000.'))

module.exports = app
