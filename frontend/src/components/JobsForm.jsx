import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";
import { postJob, api } from "../api";
import { Modal } from "./Modal";
import { JobPreview } from "./JobPreview";
import {
  sanitizeHtml,
  validateEmail,
  validateUrl,
  validatePhone,
} from "../utils/sanitize";

const JOB_CATEGORIES = [
  "Software Development",
  "Design",
  "Marketing",
  "Sales",
  "Customer Service",
  "Finance",
  "Human Resources",
  "Management",
  "Other",
];

const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Executive",
];

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Freelance",
];

const DRAFT_KEY = "jobform_draft";

function JobsForm({ route, method }) {
  const business_id = localStorage.getItem("business_id") || null;

  // Form states
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isRemote, setIsRemote] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [category, setCategory] = useState("");
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  // Load draft on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const categoriesRes = await api.get("/api/categories/");
        if (categoriesRes.status == 200){
            setCategoriesOptions(categoriesRes.data);
        }else{
            console.error("Could not fetch categories", err);
        }
      } catch (err) {
          // If endpoints are not present or fail, fall back to free-text inputs
          console.error("Could not fetch categories", err);
      }
    }
    fetchOptions();
  }, []);

  // Format salary as currency
  const formatSalary = (value) => {
    if (!value) return "";
    const number = value.replace(/[^0-9]/g, "");
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Handle salary input changes
  const handleSalaryChange = (value, setSalaryFn) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setSalaryFn(cleanValue);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!company.trim()) newErrors.company = "Company is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!requirements.trim())
      newErrors.requirements = "Requirements are required";
    if (!workingHours.trim())
      newErrors.workingHours = "Working hours are required";
    if (!category) newErrors.category = "Category is required";
    if (!experienceLevel)
      newErrors.experienceLevel = "Experience level is required";
    if (!salaryMin || !salaryMax) newErrors.salary = "Salary range is required";
    if (Number(salaryMin) > Number(salaryMax))
      newErrors.salary = "Minimum salary cannot be greater than maximum salary";
    if (deadline && new Date(deadline) < new Date())
      newErrors.deadline = "Deadline cannot be in the past";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        experience_level: experienceLevel,
        salary_min: salaryMin,
        salary_max: salaryMax,
        deadline: deadline || null,
      };

      if (category) {
        const matchedCat = categoriesOptions.find((c) => c.name === category);
        data.category = matchedCat ? matchedCat.id : category;
      }

      console.log(data);

      const is_created = await postJob(business_id, data);
      if (is_created) {
        navigate("/view-business");
      } else {
        console.log("Error creating job. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while creating the job posting";
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>Create Job</h3>
      <div className="form-group">
        <input
          className={`form-input ${errors.title ? "error" : ""}`}
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
          className={`form-input ${errors.company ? "error" : ""}`}
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          required
        />
        {errors.company && (
          <span className="error-message">{errors.company}</span>
        )}
      </div>

      <div className="form-group">
        <input
          className={`form-input ${errors.city ? "error" : ""}`}
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
          className={`form-input ${errors.description ? "error" : ""}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows="4"
          required
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
      </div>

      <div className="form-group">
        <textarea
          className={`form-input ${errors.requirements ? "error" : ""}`}
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Requirements"
          rows="4"
          required
        />
        {errors.requirements && (
          <span className="error-message">{errors.requirements}</span>
        )}
      </div>

      <div className="form-group">
        <input
          className={`form-input ${errors.workingHours ? "error" : ""}`}
          type="text"
          value={workingHours}
          onChange={(e) => setWorkingHours(e.target.value)}
          placeholder="Working hours (e.g., Full-time, Part-time)"
          required
        />
        {errors.workingHours && (
          <span className="error-message">{errors.workingHours}</span>
        )}
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
        {categoriesOptions && categoriesOptions.length > 0 ? (
            <select
              className="form-input"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
            >
              <option value="">Select category</option>
              {categoriesOptions.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
        ): <div></div>}

        {errors.category && (
          <span className="error-message">{errors.category}</span>
        )}
      </div>

      <div className="form-group">
        <select
          className={`form-input ${errors.experienceLevel ? "error" : ""}`}
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          required
        >
          <option value="">Select Experience Level</option>
          {EXPERIENCE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        {errors.experienceLevel && (
          <span className="error-message">{errors.experienceLevel}</span>
        )}
      </div>

      <div className="form-group salary-range">
        <div className="salary-input">
          <input
            className={`form-input ${errors.salary ? "error" : ""}`}
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
            className={`form-input ${errors.salary ? "error" : ""}`}
            type="text"
            value={formatSalary(salaryMax)}
            onChange={(e) => handleSalaryChange(e.target.value, setSalaryMax)}
            placeholder="Maximum Salary"
            required
          />
        </div>
        {errors.salary && (
          <span className="error-message">{errors.salary}</span>
        )}
      </div>

      <div className="form-group">
        <input
          className={`form-input ${errors.deadline ? "error" : ""}`}
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          placeholder="Application Deadline"
        />
        {errors.deadline && (
          <span className="error-message">{errors.deadline}</span>
        )}
      </div>

      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Job"}
      </button>
    </form>
  );
}

export default JobsForm;
