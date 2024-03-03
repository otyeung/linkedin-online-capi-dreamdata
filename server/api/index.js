const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
const HOST = process.env.HOST || 'localhost'

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

const whitelist = ['*']

app.use((req, res, next) => {
  const origin = req.get('referer')
  const isWhitelisted = whitelist.find((w) => origin && origin.includes(w))
  if (isWhitelisted) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    )
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With,Content-Type,Authorization'
    )
    res.setHeader('Access-Control-Allow-Credentials', true)
  }
  // Pass to next layer of middleware
  if (req.method === 'OPTIONS') res.sendStatus(200)
  else next()
})

//app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// GET route for the root endpoint
app.get('/', (req, res) => {
  res.send(`Server is running on http://${HOST}:${PORT}`)
})

// POST route for form submission
app.post('/submit-form', async (req, res) => {
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

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`)
})
