import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";  // 👈 import axios properly

interface Props {
  component: React.FC;
}

const ProtectedRoute: React.FC<Props> = ({ component: Component }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
  axios
    .get("http://localhost:5000/secure/admin/check-session", { withCredentials: true })
    .then((res: AxiosResponse<{ user: any }>) => {
      setUser(res.data.user);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
      navigate("/admin/login");
    });
}, [navigate]);


  if (loading) return <p>Loading...</p>;

  return user && user.role === "admin" ? <Component /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
