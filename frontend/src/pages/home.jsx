import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import JobCard from '../components/JobCard'
import ApplyModal from '../components/ApplyModal'
import '../styles/jobs.css'
import { ACCESS_TOKEN } from '../constants'

const Home = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN)

  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching jobs...');
      const res = await api.get('/api/job/')
      console.log('Jobs response:', res);
      if (res.data) {
        setJobs(res.data)
      } else {
        setError('No data received from server')
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.detail || err.message || 'Could not fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const openApply = (job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const closeApply = () => {
    setSelectedJob(null)
    setIsModalOpen(false)
  }

  const filtered = jobs.filter(j => {
    if (!query) return true
    return (
      j.title?.toLowerCase().includes(query.toLowerCase()) ||
      j.company?.toLowerCase().includes(query.toLowerCase()) ||
      j.city?.toLowerCase().includes(query.toLowerCase())
    )
  })

  return (
    <div className="jobs-page">
      {isAuthenticated ? (
        <>
          <div className="jobs-header">
            <h2>Job Listings</h2>
            <input 
              className="search-input" 
              placeholder="Search by title, company or city" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
            />
          </div>

          {loading && <p>Loading jobs…</p>}
          {error && <p style={{color:'red'}}>{error}</p>}

          <div className="jobs-list">
            {filtered.map(job => (
              <JobCard key={job.id} job={job} onApply={openApply} />
            ))}
          </div>

          <ApplyModal isOpen={isModalOpen} onClose={closeApply} job={selectedJob} />
        </>
      ) : (
        <div className="welcome-container">
          <h1>Welcome to JobFinder</h1>
          <p>Find your dream job with us! Connect with top employers and discover exciting opportunities.</p>
          <div className="welcome-actions">
            <Link to="/login" className="welcome-button login">Login</Link>
            <Link to="/register" className="welcome-button register">Sign Up</Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home;
