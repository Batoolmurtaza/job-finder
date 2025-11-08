import React from 'react'
import '../styles/jobs.css'

export default function JobCard({ job, onApply }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3 className="job-title">{job.title}</h3>
          <div className="job-company">{job.company} • {job.city} {job.is_remote ? '• Remote' : ''}</div>
        </div>
        <div className="job-salary">{job.salary_min ? `$${job.salary_min}` : ''}{job.salary_max ? ` - $${job.salary_max}` : ''}</div>
      </div>

      <p className="job-desc">{job.description?.slice(0, 220)}{job.description && job.description.length > 220 ? '...' : ''}</p>

      <div className="job-meta">
        <span>{job.experience_level || ''}</span>
        <span>{job.working_hours || ''}</span>
        <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
      </div>

      <div className="job-actions">
        <button className="apply-button" onClick={() => onApply(job)}>Apply</button>
      </div>
    </div>
  )
}
