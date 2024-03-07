// src/ContactForm.tsx

// Import necessary dependencies and components
import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios'
import Modal from './Modal' // Assuming you have a Modal component

// Declare analytics function in window object to avoid TypeScript error
declare global {
  interface Window {
    analytics: any
  }
}

// Define type/interface for form data
interface FormData {
  li_fat_id: string
  lastName: string
  firstName: string
  email: string
  title: string
  company: string
  countryCode: string
  currency: string
  value: string
  acxiomId: string
  oracleMoatId: string
}

// Initial form data
const initialFormData: FormData = {
  li_fat_id: '123456',
  lastName: 'John',
  firstName: 'Doe',
  email: 'john.doe@example.com',
  title: 'Engineer',
  company: 'Acme Inc',
  countryCode: 'US',
  currency: 'USD',
  value: '50.0',
  acxiomId: '12345678',
  oracleMoatId: '12345678',
}

const ContactForm: React.FC = () => {
  // State hooks for form data, submission status, and modal visibility
  const [formData, setFormData] = useState(initialFormData)
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isAnalyticsExecuted = useRef(false)

  // Effect hook to fetch data and execute analytics
  useEffect(() => {
    const fetchData = async () => {
      // Retrieve li_fat_id from query params or cookie
      const li_fat_id =
        (typeof window !== 'undefined' &&
          new URLSearchParams(window.location.search).get('li_fat_id')) ||
        (typeof document !== 'undefined' && getCookie('li_fat_id')) ||
        ''

      // Update form data with li_fat_id
      if (li_fat_id && !isAnalyticsExecuted.current) {
        setFormData((prevData) => ({ ...prevData, li_fat_id }))

        // Identify user and track page view
        window.analytics.identify(li_fat_id, {
          li_fat_id: li_fat_id,
        })
        window.analytics.track('Page View')

        isAnalyticsExecuted.current = true
      }
    }

    fetchData()
  }, []) // Empty dependency array ensures it runs only once

  // Cookie routine: getCookie function
  function getCookie(name: string): string | undefined {
    if (typeof document !== 'undefined') {
      let matches = document.cookie.match(
        new RegExp(
          '(?:^|; )' +
            name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') +
            '=([^;]*)'
        )
      )
      return matches ? decodeURIComponent(matches[1]) : undefined
    }
    return undefined
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Send a POST request to the server with form data
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/submit-google-form`,
        formData
      )

      // Extract form data for analytics
      const userEmail = formData.email
      const li_fat_id = formData.li_fat_id
      const firstName = formData.firstName
      const lastName = formData.lastName
      const title = formData.title
      const company = formData.company
      const countryCode = formData.countryCode

      // Identify user and track form submission event
      window.analytics.identify(li_fat_id, {
        email: userEmail,
        first_name: firstName,
        last_name: lastName,
        title: title,
        company: company,
        country: countryCode,
        li_fat_id: li_fat_id,
      })
      window.analytics.track('Form Submit')

      // Update state and open success modal
      console.log('Form submitted successfully')
      setSubmissionStatus('success')
      setIsModalOpen(true)
    } catch (error) {
      // Handle form submission error
      console.error('Error submitting form:', error)
      setSubmissionStatus('error')
      setIsModalOpen(true)
    }
  }

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update form data based on input changes
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  // Modal close handler
  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Reset form handler
  const handleResetForm = () => {
    setFormData(initialFormData)
  }

  // Render the contact form component
  return (
    <>
      <div className='App'>
        <form className='centered-form' onSubmit={handleSubmit}>
          {/* Form fields */}
          {/* ... (omitted for brevity) ... */}

          {/* Form submission and reset buttons */}
          <button type='submit'>Submit</button>
          <button type='button' onClick={handleResetForm}>
            Reset Form
          </button>

          {/* Form submission info */}
          <p>
            All leads are submitted in this{' '}
            <a
              href='https://docs.google.com/spreadsheets/d/1gi1EyeuoF9YxLkhAhNi3qb3x05Rm6i6GVIv0q030vso/edit?usp=sharing'
              target='_blank'
              rel='noopener noreferrer'
            >
              Sheet
            </a>
          </p>
        </form>

        {/* Modal component for displaying submission status */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          message={
            submissionStatus === 'success'
              ? 'Form submitted successfully.'
              : submissionStatus === 'error'
              ? 'Error submitting form.'
              : null
          }
        />
      </div>
    </>
  )
}

// Export the ContactForm component as the default export
export default ContactForm
