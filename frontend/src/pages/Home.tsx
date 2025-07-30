import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [ownCourses, setOwnCourses] = useState([]);
    const [user, setUser] = useState<{ _id?: string; id?: string; role: string } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");

    useEffect(() => {
        const fetchUserAndCourses = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const userRes = await axios.get("http://localhost:5000/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fullUser = { ...userRes.data, id: userRes.data.id || userRes.data._id };
                setUser(fullUser);

                const coursesRes = await axios.get("http://localhost:5000/courses/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCourses(coursesRes.data);

                if (fullUser.role === "student") {
                    const enrolledRes = await axios.get("http://localhost:5000/courses/enrolled", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setEnrolledCourses(enrolledRes.data);
                } else if (fullUser.role === "teacher") {
                    const ownRes = await axios.get("http://localhost:5000/courses/own", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setOwnCourses(ownRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch user or courses:", error);
            }
        };

        fetchUserAndCourses();
    }, []);

    const handleCreateCourse = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "http://localhost:5000/courses/",
                { title, description, tags },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowModal(false);
            setTitle("");
            setDescription("");
            setTags("");
            const res = await axios.get("http://localhost:5000/courses/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourses(res.data);

            // Refresh own courses too if teacher
            if (user?.role === "teacher") {
                const ownRes = await axios.get("http://localhost:5000/courses/own", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOwnCourses(ownRes.data);
            }
        } catch (err) {
            console.error("Failed to create course:", err);
        }
    };

    const handleEnroll = async (courseId: string) => {
        const token = localStorage.getItem("token");
        if (!token || !(user?.id || user?._id)) return;

        const userId = user?.id || user?._id;

        try {
            await axios.post(
                `http://localhost:5000/courses/enroll/${courseId}`,
                { id: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // After enrolling, refetch enrolled courses
            const enrolledRes = await axios.get("http://localhost:5000/courses/enrolled", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setEnrolledCourses(enrolledRes.data);
        } catch (error) {
            console.error("Failed to enroll:", error);
        }
    };

    const enrolledIds = new Set(enrolledCourses.map((c: any) => c.id || c._id));

    return (
        <div className="min-h-[90vh] px-10 md:px-40 bg-black text-white w-full p-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Courses</h1>
                {user?.role === "teacher" && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + Create Course
                    </button>
                )}
            </div>

            {courses.length === 0 ? (
                <p>No courses found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {courses.map((course: any) => (
                        <div
                            key={course.id || course._id}
                            className="bg-slate-800 p-4 rounded-md shadow hover:shadow-lg transition"
                        >
                            <h2 className="text-lg font-semibold">{course.title}</h2>
                            <p className="text-sm mt-2">{course.description}</p>
                            <p className="mt-2 text-xs text-gray-400">Tags: {course.tags}</p>

                            {user?.role === "student" && !enrolledIds.has(course.id || course._id) && (
                                <button
                                    onClick={() => handleEnroll(course.id || course._id)}
                                    className="mt-4 bg-green-600 px-3 py-1 rounded text-white hover:bg-green-700"
                                >
                                    Enroll Course
                                </button>
                            )}

                            {user?.role === "student" && enrolledIds.has(course.id || course._id) && (
                                <p className="mt-4 text-green-400 font-medium">Already Enrolled</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Enrolled Courses Section */}
            {user?.role === "student" && (
                <>
                    <h2 className="text-2xl font-bold mt-10 mb-4">Enrolled Courses</h2>
                    {enrolledCourses.length === 0 ? (
                        <p>You have not enrolled in any courses.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {enrolledCourses.map((course: any) => (
                                <div
                                    key={course.id || course._id}
                                    className="bg-slate-700 p-4 rounded-md shadow hover:shadow-lg transition"
                                >
                                    <h2 className="text-lg font-semibold">{course.title}</h2>
                                    <p className="text-sm mt-2">{course.description}</p>
                                    <p className="mt-2 text-xs text-gray-300">
                                        Tags: {course.tags}
                                    </p>
                                    <p className="mt-4 text-green-400 font-medium">Enrolled</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Teacher's Own Courses */}
            {user?.role === "teacher" && (
                <>
                    <h2 className="text-2xl font-bold mt-10 mb-4">My Created Courses</h2>
                    {ownCourses.length === 0 ? (
                        <p>You haven't created any courses yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {ownCourses.map((course: any) => (
                                <div
                                    key={course.id || course._id}
                                    className="bg-slate-700 p-4 rounded-md shadow hover:shadow-lg transition"
                                >
                                    <h2 className="text-lg font-semibold">{course.title}</h2>
                                    <p className="text-sm mt-2">{course.description}</p>
                                    <p className="mt-2 text-xs text-gray-300">Tags: {course.tags}</p>
                                    <p className="mt-4 text-yellow-400 font-medium">Created by You</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-white text-black p-6 rounded w-[90%] max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Course</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border mb-2 rounded"
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border mb-2 rounded"
                        ></textarea>
                        <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full p-2 border mb-4 rounded"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-400 px-4 py-2 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={handleCreateCourse}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
