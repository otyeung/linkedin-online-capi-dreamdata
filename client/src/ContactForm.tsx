// src/ContactForm.tsx
import React, { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import Modal from './Modal' // Assuming you have a Modal component
//import dotenv from 'dotenv'

//dotenv.config()
//const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5001'

const initialFormData = {
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
  const [formData, setFormData] = useState(initialFormData)

  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const li_fat_id =
      (typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('li_fat_id')) ||
      (typeof document !== 'undefined' && getCookie('li_fat_id')) ||
      ''

    setFormData({ ...formData, li_fat_id })
  }, [formData])

  // Begin Cookie routine
  // getcookie function
  function getCookie(name) {
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
  // End Cookie routine

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      //      await axios.post('http://localhost:5001/submit-form', formData)
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/submit-form`,
        formData
      )
      console.log('Form submitted successfully')
      setSubmissionStatus('success')
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmissionStatus('error')
      setIsModalOpen(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className='App'>
        <form className='centered-form' onSubmit={handleSubmit}>
          <h1 className='form-title'>LinkedIn Online CAPI with Dreamdata</h1>

          {/*           <label>
            li_fat_id:
            <input
              type='text'
              name='li_fat_id'
              value={formData.li_fat_id}
              onChange={handleChange}
            />
          </label> */}

          <label>
            li_fat_id:
            <span>{formData.li_fat_id}</span>
          </label>

          <label>
            Last Name:
            <input
              type='text'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
            />
          </label>

          <label>
            First Name:
            <input
              type='text'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input
              type='text'
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Title:
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Company:
            <input
              type='text'
              name='company'
              value={formData.company}
              onChange={handleChange}
            />
          </label>

          <label>
            Country Code:
            <input
              type='text'
              name='countryCode'
              value={formData.countryCode}
              onChange={handleChange}
            />
          </label>

          <label>
            Currency:
            <input
              type='text'
              name='currency'
              value={formData.currency}
              onChange={handleChange}
            />
          </label>

          <label>
            Value:
            <input
              type='text'
              name='value'
              value={formData.value}
              onChange={handleChange}
            />
          </label>

          <label>
            Acxiom ID:
            <input
              type='text'
              name='acxiomId'
              value={formData.acxiomId}
              onChange={handleChange}
            />
          </label>

          <label>
            Oracle Moat ID:
            <input
              type='text'
              name='oracleMoatId'
              value={formData.oracleMoatId}
              onChange={handleChange}
            />
          </label>

          <button type='submit'>Submit</button>
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

export default ContactForm
