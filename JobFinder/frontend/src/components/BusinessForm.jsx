import { useState, useEffect } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN } from "../constants"
import "../styles/form.css"
import CreateBusiness from "../pages/CreateBusiness"

function BusinessForm({ route = "/api/business/", method = "POST" }) {
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [desc, setDesc] = useState("")
    const [service, setService] = useState("")
    const [city, setCity] = useState("")
    const [category, setCategory] = useState("")
    const [citiesOptions, setCitiesOptions] = useState([])
    const [categoriesOptions, setCategoriesOptions] = useState([])
    const [formErrors, setFormErrors] = useState(null)
    const [addingNewCity, setAddingNewCity] = useState(false)
    const [newCityName, setNewCityName] = useState("")
    const [addingNewCategory, setAddingNewCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            // ensure we have a valid route (fallback to /api/business/)
            const postRoute = route || "/api/business/"
            const payload = {
                name,
                email,
                phone_number: phoneNumber,
                address,
                desc: desc,
                service
            }

            // If user is adding a new city/category, include the name fields
            if (addingNewCity && newCityName.trim()) {
                payload.city_name = newCityName.trim()
            } else if (city) {
                // try to send existing city id if we have one in options, otherwise send name
                const matched = citiesOptions.find(c => c.name === city)
                payload.city = matched ? matched.id : city
            }

            if (addingNewCategory && newCategoryName.trim()) {
                payload.category_name = newCategoryName.trim()
            } else if (category) {
                const matchedCat = categoriesOptions.find(c => c.name === category)
                payload.category = matchedCat ? matchedCat.id : category
            }

            const res = await api.post(postRoute, payload);
            navigate("/");
        } catch (error) {
            // show more helpful message
            const message = error.response?.data || error.message || String(error)
            // if axios error, include status code
            const status = error.response?.status
            // store field errors for inline display
            if (error.response?.data && typeof error.response.data === 'object') {
                setFormErrors(error.response.data)
            }
            alert(`Error${status ? ' (' + status + ')' : ''}: ${JSON.stringify(message)}`)
        } finally {
            setLoading(false)
        }
    }

    // Fetch cities and categories to populate selects (if available)
    useEffect(() => {
        let mounted = true
        const fetchOptions = async () => {
            try {
                const [citiesRes, categoriesRes] = await Promise.all([
                    api.get('/api/cities/'),
                    api.get('/api/categories/')
                ])
                if (!mounted) return
                setCitiesOptions(citiesRes.data)
                setCategoriesOptions(categoriesRes.data)
            } catch (err) {
                // If endpoints are not present or fail, fall back to free-text inputs
                console.error('Could not fetch cities/categories', err)
            }
        }
        fetchOptions()
        return () => { mounted = false }
    }, [])

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>Create Business</h1>
        <input
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
        />
        <input
            className="form-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        />
        <input
            className="form-input"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
        />
        <input
            className="form-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
        />
        {citiesOptions.length > 0 ? (
            <>
                <select
                    className="form-input"
                    value={addingNewCity ? "__add_new__" : city}
                    onChange={(e) => {
                        const v = e.target.value
                        if (v === "__add_new__") {
                            setAddingNewCity(true)
                            setCity("")
                        } else {
                            setAddingNewCity(false)
                            setCity(v)
                        }
                    }}
                >
                    <option value="">Select city</option>
                    {citiesOptions.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="__add_new__">Add new city...</option>
                </select>
                {addingNewCity && (
                    <input
                        className="form-input"
                        type="text"
                        value={newCityName}
                        onChange={(e) => setNewCityName(e.target.value)}
                        placeholder="Enter new city name"
                    />
                )}
            </>
        ) : (
            <input
                className="form-input"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
            />
        )}
        {formErrors?.city && <span className="error-message">{JSON.stringify(formErrors.city)}</span>}
        {categoriesOptions.length > 0 ? (
            <>
                <select
                    className="form-input"
                    value={addingNewCategory ? "__add_new__" : category}
                    onChange={(e) => {
                        const v = e.target.value
                        if (v === "__add_new__") {
                            setAddingNewCategory(true)
                            setCategory("")
                        } else {
                            setAddingNewCategory(false)
                            setCategory(v)
                        }
                    }}
                >
                    <option value="">Select category</option>
                    {categoriesOptions.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    <option value="__add_new__">Add new category...</option>
                </select>
                {addingNewCategory && (
                    <input
                        className="form-input"
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter new category name"
                    />
                )}
            </>
        ) : (
            <input
                className="form-input"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
            />
        )}
        {formErrors?.category && <span className="error-message">{JSON.stringify(formErrors.category)}</span>}
        <input
            className="form-input"
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
        />
        <input
            className="form-input"
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Service"
        />
        <button className="form-button" type="submit">
            Create Business
        </button>
    </form>
}

export default BusinessForm;
