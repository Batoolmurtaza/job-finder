import React, { useState } from 'react'
import { Modal } from './Modal'
import api from '../api'
import '../styles/form.css'

export default function ApplyModal({ isOpen, onClose, job }) {
  if (!job) return null

  const [resume, setResume] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.append('job', job.id)
    formData.append('resume', resume)
    if (coverLetter) {
      formData.append('cover_letter', coverLetter)
    }

    try {
      await api.post('/api/applications/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setResume(null)
        setCoverLetter('')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const handleExternal = () => {
    if (job.application_url) {
      window.open(job.application_url, '_blank', 'noopener')
    }
  }

  const mailto = () => {
    if (job.contact_email) {
      const subject = encodeURIComponent(`Application for ${job.title}`)
      const body = encodeURIComponent(`Hello,\n\nI would like to apply for the position of ${job.title} at ${job.company}.\n\nRegards,\n`)
      window.location.href = `mailto:${job.contact_email}?subject=${subject}&body=${body}`
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply: ${job.title}`}>
      <div className="preview-section">
        <h3>{job.title} — {job.company}</h3>
        <p><strong>Location:</strong> {job.city} {job.is_remote ? '(Remote available)' : ''}</p>
        <p><strong>Experience:</strong> {job.experience_level}</p>
        <p><strong>Working hours:</strong> {job.working_hours}</p>
        <p><strong>Salary:</strong> {job.salary_min ? `$${job.salary_min}` : ''}{job.salary_max ? ` - $${job.salary_max}` : ''}</p>
        <hr />
        <div className="preview-content">{job.description}</div>
      </div>

      <div style={{marginTop:16}}>
        {job.application_url ? (
          <>
            <p>Apply on external site:</p>
            <button className="form-button" onClick={handleExternal}>Open Application Link</button>
          </>
        ) : job.contact_email ? (
          <>
            <p>Apply by email:</p>
            <button className="form-button" onClick={mailto}>Send Email to {job.contact_email}</button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label>Resume (PDF/DOC)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Cover Letter (Optional)</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="form-input"
                rows={4}
                placeholder="Tell us why you're interested in this position..."
              />
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Application submitted successfully!</p>}

            <button 
              type="submit" 
              className="form-button"
              disabled={loading || !resume}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  )
}
