import React from 'react';

export const JobPreview = ({ 
    title,
    company,
    city,
    description,
    requirements,
    isRemote,
    workingHours,
    category,
    experienceLevel,
    employmentType,
    salaryMin,
    salaryMax,
    deadline,
    benefits,
    applicationUrl,
    contactEmail,
    contactPhone,
    skills,
}) => {
    const formatSalary = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="preview-container">
            <div className="preview-section">
                <h3>Basic Information</h3>
                <div className="preview-row">
                    <span className="preview-label">Title:</span>
                    <span className="preview-value">{title}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Company:</span>
                    <span className="preview-value">{company}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Location:</span>
                    <span className="preview-value">{city} {isRemote && '(Remote available)'}</span>
                </div>
            </div>

            <div className="preview-section">
                <h3>Job Details</h3>
                <div className="preview-row">
                    <span className="preview-label">Category:</span>
                    <span className="preview-value">{category}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Experience Level:</span>
                    <span className="preview-value">{experienceLevel}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Employment Type:</span>
                    <span className="preview-value">{employmentType}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Working Hours:</span>
                    <span className="preview-value">{workingHours}</span>
                </div>
                <div className="preview-row">
                    <span className="preview-label">Salary Range:</span>
                    <span className="preview-value">
                        {formatSalary(salaryMin)} - {formatSalary(salaryMax)}
                    </span>
                </div>
            </div>

            <div className="preview-section">
                <h3>Description</h3>
                <div className="preview-content">{description}</div>
            </div>

            <div className="preview-section">
                <h3>Requirements</h3>
                <div className="preview-content">{requirements}</div>
            </div>

            {benefits && (
                <div className="preview-section">
                    <h3>Benefits</h3>
                    <div className="preview-content">{benefits}</div>
                </div>
            )}

            <div className="preview-section">
                <h3>Required Skills</h3>
                <div className="preview-tags">
                    {skills.map((skill, index) => (
                        <span key={index} className="preview-tag">{skill}</span>
                    ))}
                </div>
            </div>

            <div className="preview-section">
                <h3>Application Information</h3>
                {deadline && (
                    <div className="preview-row">
                        <span className="preview-label">Application Deadline:</span>
                        <span className="preview-value">{new Date(deadline).toLocaleDateString()}</span>
                    </div>
                )}
                {applicationUrl && (
                    <div className="preview-row">
                        <span className="preview-label">Apply at:</span>
                        <span className="preview-value">
                            <a href={applicationUrl} target="_blank" rel="noopener noreferrer">
                                {applicationUrl}
                            </a>
                        </span>
                    </div>
                )}
                {contactEmail && (
                    <div className="preview-row">
                        <span className="preview-label">Contact Email:</span>
                        <span className="preview-value">{contactEmail}</span>
                    </div>
                )}
                {contactPhone && (
                    <div className="preview-row">
                        <span className="preview-label">Contact Phone:</span>
                        <span className="preview-value">{contactPhone}</span>
                    </div>
                )}
            </div>
        </div>
    );
};