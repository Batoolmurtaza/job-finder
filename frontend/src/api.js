import axios from "axios"
import { ACCESS_TOKEN } from "./constants"
import { data } from "react-router-dom";

export const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `JWT ${token}`
        }
        return config
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Response error:', error.response || error);
        return Promise.reject(error)
    }
)

export const getUserDetail = async ()=>{
    try{
        const res = await api.get("auth/users/me/")
        if (res.status == 200){
            return res.data
        }

        console.log("error fetching user: ", res.detail)
        return null
    }catch(error){
        console.log(error)
        return null
    }
}

export const postBusiness = async (data) =>{
    try{
        const res = await api.post("api/business/", data)
        if (res.status == 201 || res.status == 200){
            return true
        }

        console.log("error create business: ", res.detail)
        return false
    }catch(error){
        console.log(error)
        return false
    }
}

export const getBusinessDetail = async (business_id) => {
    try{
        const res = await api.get(`api/business/${business_id}/`)
        if (res.status == 200){
            return res.data
        }

        return null
    }catch(error){
        console.log("error fetching business: ", error)
        return null
    }
}

export const getJobsList = async (business_id) => {
    try{
        const res = await api.get(`api/business/${business_id}/jobs/`)
        if (res.status == 200){
            return res.data
        }

        return null
    }catch(error){
        console.log("error fetching jobs: ", error)
        return null
    }
}

export const postJob = async (business_id, data) => {
    try{
        const res = await api.post(`api/business/${business_id}/jobs/`, data)
        if (res.status == 201 || res.status == 200){
            return true
        }

        console.log("error creating job: ", res.detail)
        return false
    }catch(error){
        console.log(error)
        return false
    }
}

export const getJobDetail = async (job_id)=>{
    try {
        const res = await api.get(`api/job/${job_id}/`)
        if (res.status == 200){
            return res.data
        }

        console.log("error fetching job")
        return null
    } catch (error) {
        console.log("error fetching job: ", error)
        return null
    }
}

export default api