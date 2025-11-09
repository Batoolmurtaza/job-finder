import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { getJobDetail } from '../api';

export const JobPreview = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const job_id = location.state?.job_id || null
    const [job, setJob] = useState(null)

    useEffect(()=>{
        const fetchJob = async ()=>{
            try {
                
                const job = await getJobDetail(job_id)
                if (job){
                    setJob(job)
                    return
                }
    
                console.log("There was an error fetching the job.")
                navigate("/")
            } catch (error) {
                console.log("There was an error fetching the job: ", error)
                navigate("/")
            }
        }   

        fetchJob()
    }, [job_id])

    const formatSalary = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PKR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="preview-container">
            <div className="preview-section">
                <h3>Basic Information</h3>
                <div className="preview-row">
                    <span className="preview-label">Title:</span>
                    <span className="preview-value">{job && job.title}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Company:</span>
                    <span className="preview-value">{job && job.company}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Location:</span>
                    <span className="preview-value">{job && job.city} {job && job.is_remote? '(Remote)': '(On-Site)'}</span>
                </div>
            </div>

            <div className="preview-section">
                <h3>Job Details</h3>
                <div className="preview-row">
                    <span className="preview-label">Category:</span>
                    <span className="preview-value">{job && job.category.name}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Experience Level:</span>
                    <span className="preview-value">{job && job.experience_level}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Working Hours:</span>
                    <span className="preview-value">{job && job.working_hours}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Salary Range:</span>
                    <span className="preview-value">
                        {formatSalary(job && job.salary_min)} - {formatSalary(job && job.salary_max)}
                    </span>
                </div>
            </div>

            <div className="preview-section">
                <h3>Description</h3>
                <div className="preview-content">{job && job.description}</div>
            </div>

            <div className="preview-section">
                <h3>Requirements</h3>
                <div className="preview-content">{job &&  job.requirements}</div>
            </div>


            <div className="preview-section">
                <h3>Application Information</h3>
                {job&& job.deadline && (
                    <div className="preview-row">
                        <span className="preview-label">Application Deadline:</span>
                        <span className="preview-value">{new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                )}

                {job && job.application_url && (
                    <div className="preview-row">
                        <span className="preview-label">Apply at:</span>
                        <span className="preview-value">
                            <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                                {job.application_url}
                            </a>
                        </span>
                    </div>
                )}

                {job && job.contact_email && (
                    <div className="preview-row">
                        <span className="preview-label">Contact Email:</span>
                        <span className="preview-value">{job.contact_email}</span>
                    </div>
                )}
                {job && job.contact_phone && (
                    <div className="preview-row">
                        <span className="preview-label">Contact Phone:</span>
                        <span className="preview-value">{job.contact_phone}</span>
                    </div>
                )}
            </div>
        </div>
    );
};