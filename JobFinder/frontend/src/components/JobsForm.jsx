import { useState, useEffect } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN } from "../constants"
import "../styles/form.css"
import CreateJob from "../pages/CreateJob"
import { Modal } from './Modal'
import { JobPreview } from './JobPreview'
import { sanitizeHtml, validateEmail, validateUrl, validatePhone } from '../utils/sanitize'

const JOB_CATEGORIES = [
    "Software Development",
    "Design",
    "Marketing",
    "Sales",
    "Customer Service",
    "Finance",
    "Human Resources",
    "Management",
    "Other"
]

const EXPERIENCE_LEVELS = [
    "Entry Level",
    "Junior",
    "Mid-Level",
    "Senior",
    "Lead",
    "Executive"
]

const EMPLOYMENT_TYPES = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Freelance"
]

const DRAFT_KEY = 'jobform_draft'

function JobsForm({ route, method }) {
    // Form states
    const [title, setTitle] = useState("")
    const [company, setCompany] = useState("")
    const [city, setCity] = useState("")
    const [description, setDescription] = useState("")
    const [requirements, setRequirements] = useState("")
    const [isRemote, setIsRemote] = useState("")
    const [workingHours, setWorkingHours] = useState("")
    const [category, setCategory] = useState("")
    const [experienceLevel, setExperienceLevel] = useState("")
    const [employmentType, setEmploymentType] = useState("")
    const [salaryMin, setSalaryMin] = useState("")
    const [salaryMax, setSalaryMax] = useState("")
    const [deadline, setDeadline] = useState("")
    const [jobDoc, setJobDoc] = useState(null)
    const [benefits, setBenefits] = useState("")
    const [applicationUrl, setApplicationUrl] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [contactPhone, setContactPhone] = useState("")
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [showPreview, setShowPreview] = useState(false)
    const navigate = useNavigate()

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem(DRAFT_KEY)
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft)
                setTitle(draft.title || "")
                setCompany(draft.company || "")
                setCity(draft.city || "")
                setDescription(draft.description || "")
                setRequirements(draft.requirements || "")
                setIsRemote(draft.is_remote || false)
                setWorkingHours(draft.working_hours || "")
                setCategory(draft.category || "")
                setExperienceLevel(draft.experience_level || "")
                setEmploymentType(draft.employment_type || "")
                setSalaryMin(draft.salary_min || "")
                setSalaryMax(draft.salary_max || "")
                setDeadline(draft.deadline || "")
                setBenefits(draft.benefits || "")
                setApplicationUrl(draft.application_url || "")
                setContactEmail(draft.contact_email || "")
                setContactPhone(draft.contact_phone || "")
                setSkills(draft.skills || [])
            } catch (error) {
                console.error('Error loading draft:', error)
            }
        }
    }, [])

    // Format salary as currency
    const formatSalary = (value) => {
        if (!value) return "";
        const number = value.replace(/[^0-9]/g, "");
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(number);
    };

    // Handle salary input changes
    const handleSalaryChange = (value, setSalaryFn) => {
        const cleanValue = value.replace(/[^0-9]/g, "");
        setSalaryFn(cleanValue);
    };

    const validateForm = () => {
        const newErrors = {}
        if (!title.trim()) newErrors.title = "Title is required"
        if (!company.trim()) newErrors.company = "Company is required"
        if (!city.trim()) newErrors.city = "City is required"
        if (!description.trim()) newErrors.description = "Description is required"
        if (!requirements.trim()) newErrors.requirements = "Requirements are required"
        if (!workingHours.trim()) newErrors.workingHours = "Working hours are required"
        if (!category) newErrors.category = "Category is required"
        if (!experienceLevel) newErrors.experienceLevel = "Experience level is required"
        if (!salaryMin || !salaryMax) newErrors.salary = "Salary range is required"
        if (Number(salaryMin) > Number(salaryMax)) newErrors.salary = "Minimum salary cannot be greater than maximum salary"
        if (deadline && new Date(deadline) < new Date()) newErrors.deadline = "Deadline cannot be in the past"
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Create form data if there's a file
            let data = {
                title: title.trim(),
                company: company.trim(),
                city: city.trim(),
                description: description.trim(),
                requirements: requirements.trim(),
                is_remote: isRemote,
                working_hours: workingHours.trim(),
                category: category,
                experience_level: experienceLevel,
                salary_min: salaryMin,
                salary_max: salaryMax,
                deadline: deadline || null
            };

            if (jobDoc) {
                const formData = new FormData();
                formData.append('job_document', jobDoc);
                
                // Append other form data
                Object.keys(data).forEach(key => {
                    formData.append(key, data[key]);
                });
                
                data = formData;
            }

            const res = await api.post(route, data, {
                headers: jobDoc ? {
                    'Content-Type': 'multipart/form-data'
                } : undefined
            });
            
            alert("Job posted successfully!")
            navigate("/");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred while creating the job posting"
            alert(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Create Job</h1>
            <div className="form-group">
                <input
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
                <input
                    className={`form-input ${errors.company ? 'error' : ''}`}
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company"
                    required
                />
                {errors.company && <span className="error-message">{errors.company}</span>}
            </div>

            <div className="form-group">
                <input
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    required
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="form-group">
                <textarea
                    className={`form-input ${errors.description ? 'error' : ''}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    rows="4"
                    required
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
                <textarea
                    className={`form-input ${errors.requirements ? 'error' : ''}`}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Requirements"
                    rows="4"
                    required
                />
                {errors.requirements && <span className="error-message">{errors.requirements}</span>}
            </div>

            <div className="form-group">
                <input
                    className={`form-input ${errors.workingHours ? 'error' : ''}`}
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="Working hours (e.g., Full-time, Part-time)"
                    required
                />
                {errors.workingHours && <span className="error-message">{errors.workingHours}</span>}
            </div>

            <div className="form-group checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        checked={isRemote}
                        onChange={(e) => setIsRemote(e.target.checked)}
                    />
                    Remote Work Available
                </label>
            </div>

            <div className="form-group">
                <select
                    className={`form-input ${errors.category ? 'error' : ''}`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Select Job Category</option>
                    {JOB_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
                <select
                    className={`form-input ${errors.experienceLevel ? 'error' : ''}`}
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    required
                >
                    <option value="">Select Experience Level</option>
                    {EXPERIENCE_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
                {errors.experienceLevel && <span className="error-message">{errors.experienceLevel}</span>}
            </div>

            <div className="form-group salary-range">
                <div className="salary-input">
                    <input
                        className={`form-input ${errors.salary ? 'error' : ''}`}
                        type="text"
                        value={formatSalary(salaryMin)}
                        onChange={(e) => handleSalaryChange(e.target.value, setSalaryMin)}
                        placeholder="Minimum Salary"
                        required
                    />
                </div>
                <span className="salary-separator">-</span>
                <div className="salary-input">
                    <input
                        className={`form-input ${errors.salary ? 'error' : ''}`}
                        type="text"
                        value={formatSalary(salaryMax)}
                        onChange={(e) => handleSalaryChange(e.target.value, setSalaryMax)}
                        placeholder="Maximum Salary"
                        required
                    />
                </div>
                {errors.salary && <span className="error-message">{errors.salary}</span>}
            </div>

            <div className="form-group">
                <input
                    className={`form-input ${errors.deadline ? 'error' : ''}`}
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    placeholder="Application Deadline"
                />
                {errors.deadline && <span className="error-message">{errors.deadline}</span>}
            </div>

            <div className="form-group">
                <label className="file-upload">
                    <input
                        type="file"
                        onChange={(e) => setJobDoc(e.target.files[0])}
                        accept=".pdf,.doc,.docx"
                    />
                    <span>Upload Job Description Document (Optional)</span>
                </label>
                {jobDoc && <span className="file-name">{jobDoc.name}</span>}
            </div>

            <button className="form-button" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Job"}
            </button>
        </form>
    )
}

export default JobsForm;