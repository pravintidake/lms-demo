import { useState } from "react";
import Input from "../components/core/Input";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    let navigate = useNavigate();
    const { signup } = useAuth();
    let [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        password: ""
    });

    let [errors, setErrors] = useState({
        name: "",
        email: "",
        role: "",
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
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.role) newErrors.role = "Role is required";
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
            await signup(formData); // uses context login function
            navigate("/");
        } catch (err: any) {
            setErrors(prev => ({
                ...prev,
                server: err?.response?.data?.message || "Registration failed"
            }));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-5 px-5">
            <h3 className="text-3xl font-bold">Register to LMS</h3>
            <div className="flex flex-col gap-5 w-full md:w-1/2 lg:w-1/3">
                <div>
                    <Input
                        inpType="text"
                        inpName="name"
                        inpValue={formData.name}
                        onChange={handleChange}
                        classes="text-white border p-3 w-full"
                        inpPlaceholder="Enter Name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
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
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="text-white border p-3 w-full bg-black"
                    >
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
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
                Register
            </button>
            <p className="text-gray-400">Already have an accout? click here to <Link to="/login" className="text-white font-bold">Login!!!</Link></p>
        </div>
    );
};

export default Register;
