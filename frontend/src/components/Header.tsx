import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
    const [user, setUser] = useState<{ name?: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await axios.get("http://localhost:5000/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    };

    return (
        <div className="h-12 bg-white flex justify-between items-center px-10 md:px-20 lg:px-40 shadow">
            <Link to="/" className="text-xl font-bold">
                LMS
            </Link>
            <div className="flex items-center gap-4">
                {user?.name && <span className="font-medium">Hello, {user.name}</span>}
                <button
                    onClick={handleLogout}
                    className="border border-blue-500 shadow text-white px-3 py-1 bg-blue-500 rounded hover:bg-blue-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Header;
