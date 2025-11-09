import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/form.css"

function SignUp({ route }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [re_password, setRePassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {

            const res= await api.post(route, {email, password, re_password})
            
            if(res.status == 201){
                navigate("/login");
            } else {
                console.log("There was an error signing up, please try again!")
                navigate("/register")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>Sign Up</h1>
        <input
            className="form-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        />
        <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />
        <input
            className="form-input"
            type="password"
            value={re_password}
            onChange={(e) => setRePassword(e.target.value)}
            placeholder="Retype password"
        />
        <button className="form-button" type="submit">
            Sign Up
        </button>
    </form>
}

export default SignUp