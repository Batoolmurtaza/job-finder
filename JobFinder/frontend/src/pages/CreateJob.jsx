import React from 'react'
import BusinessForm from "../components/JobsForm";
import JobsForm from '../components/JobsForm';

const CreateJob = () => {
    return <JobsForm route="/api/job/" method="POST" />
}

export default CreateJob;
