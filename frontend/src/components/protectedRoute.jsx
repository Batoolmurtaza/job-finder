import { Navigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
    const [ isAuthorized, setISAuthorized ] = useState(null)

    useEffect(() => {
        auth().catch(()=> setISAuthorized(false))
    }, [])

    const refreshToken = async () => {

        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            // Djoser JWT refresh endpoint
            const res = await api.post("/auth/jwt/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setISAuthorized(true)
            } else {
                setISAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setISAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setISAuthorized(false);
            return;
        }
        // lightweight JWT payload decoder (avoids external jwt-decode package)
        const decodePayload = (t) => {
            try {
                const payload = t.split('.')[1];
                const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
                // handle UTF-8 decoding
                const decoded = decodeURIComponent(Array.prototype.map.call(json, c => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                return JSON.parse(decoded);
            } catch (e) {
                return {};
            }
        }

        const decoded = decodePayload(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setISAuthorized(true);
        }
    };

    if (isAuthorized == null) {
        return <div>loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />

}

export default ProtectedRoute;