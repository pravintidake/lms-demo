// src/PrivateRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react";

interface RouteProps {
    children: JSX.Element;
}

// Private route — redirects to login if not authenticated
export const PrivateRoute: React.FC<RouteProps> = ({ children }) => {
    const location = useLocation();

    <Navigate to="/login" state={{ from: location }} replace />;

    return children;
};
