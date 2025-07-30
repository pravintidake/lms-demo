import { useState } from "react";
import Input from "../components/core/Input";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
    const { login } = useAuth();
    let [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    let [errors, setErrors] = useState({
        email: "",
        password: "",
        server: ""
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors: any = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await login(formData); // uses context login function
        } catch (err: any) {
            setErrors(prev => ({
                ...prev,
                server: err?.response?.data?.message || "Registration failed"
            }));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-5 px-5">
            <h3 className="text-3xl font-bold">Welcome to LMS</h3>
            <div className="flex flex-col gap-5 w-full md:w-1/2 lg:w-1/3">
                <div>
                    <Input
                        inpType="email"
                        inpName="email"
                        inpValue={formData.email}
                        onChange={handleChange}
                        classes="text-white border p-3 w-full"
                        inpPlaceholder="Enter Email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                    <Input
                        inpType="password"
                        inpName="password"
                        inpValue={formData.password}
                        onChange={handleChange}
                        classes="text-white border p-3 w-full"
                        inpPlaceholder="Enter Password"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
            </div>
            <button
                className="p-3 px-10 bg-white text-black cursor-pointer"
                onClick={handleSubmit}
            >
                Login
            </button>

            <p className="text-gray-400">New User want to create a accout <Link to="/register" className="text-white font-bold">Register Now!!!</Link></p>
        </div>
    );
};

export default Login;
