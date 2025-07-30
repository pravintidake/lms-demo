import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";

const Layout = () => {
    return (
        <main>
            <Header />
            <div className="flex items-center">
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                </Routes>
            </div>
            <Footer />
        </main>
    );
};

export default Layout;