import { useContext } from "react";
import { Outlet } from "react-router-dom";
import NotFound from "../components/Error404/NotFound";
import AuthProvider from "../context/AuthProvider";

const PrivateRoute = () => {
	const { auth } = useContext(AuthProvider);

	return auth.is_superuser ? <Outlet /> : <NotFound />;
};

export default PrivateRoute;
