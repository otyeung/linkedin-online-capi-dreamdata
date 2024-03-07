// Modal.tsx
import React from 'react'

// Define interface for ModalProps
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  message: string | null
}

// Define the Modal component as a functional component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
  // Render nothing if modal is not open or message is null
  if (!isOpen || message === null) {
    return null
  }

  // Render the modal overlay and content
  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

// Export the Modal component as the default export
export default Modal
