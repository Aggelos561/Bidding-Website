import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import NotFound from "../components/Error404/NotFound";
import AuthProvider from "../context/AuthProvider";

const PrivateRoute = () => {
	const { auth } = useContext(AuthProvider);
	let Authanticated = JSON.stringify(auth) === "{}";

	if (auth.is_superuser) {
		return <NotFound />;
	} else if (!Authanticated) {
		return <Outlet />;
	} else {
		return <Navigate to="/login" />;
	}
};

export default PrivateRoute;
