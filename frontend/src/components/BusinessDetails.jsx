import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard"
import "../styles/business-details.css";
import { getBusinessDetail, getJobsList } from "../api";

const BusinessDetails = () => {
  const [business, setBusiness] = useState(null);
  const [jobs, setJobs] = useState(null);
  const business_id = localStorage.getItem("business_id") || null;
  const navigate = useNavigate();

  const handleAddNewClick = ()=>{
    navigate("/create-job")
  }

  // fetches business details and jobs posted
  // when page is loaded/reloaded.
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const businessData = await getBusinessDetail(business_id);
        if (businessData) {
          setBusiness(businessData);
        } else {
          console.log("error fetching business: ", error);
          navigate("/");
          return;
        }

        const jobData = await getJobsList(business_id);
        if (jobData) {
          setJobs(jobData);
        } else {
          console.log("error fetching jobs: ", error);
        }
      } catch (error) {
        console.log("error fetching business: ", error);
        navigate("/");
      }
    };

    fetchBusinessDetails();
  }, [business_id]);

  return (
    <div>
      <div className="business-container">
        <div className="business-details-container">
          <div>
            <h2>{business && business.name}</h2>
            <p>under {business && business.category.name}</p>
          </div>

          <div>
            {business && business.email} | {business && business.phone_number} |{" "}
            {business && business.address}, {business && business.city.name}
          </div>

          <div>{business && business.desc}</div>
        </div>

        <div className="posted-jobs-container">
          <div className='posted-jobs-title'>
            <h3>Jobs Posted</h3>
            <button onClick={handleAddNewClick} className="auth-button">Create New Job</button>
          </div>


          <div className="job-list-container">
            {jobs &&
              jobs.map((job, key) => (
                <JobCard job={job} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
