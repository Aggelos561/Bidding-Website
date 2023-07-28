import { useContext } from "react";
import { Outlet } from "react-router-dom";
import NotFound from "../components/Error404/NotFound";
import AuthProvider from "../context/AuthProvider";

const VisitorRoute = () => {
	const { auth } = useContext(AuthProvider);

	return auth.is_superuser ? <NotFound /> : <Outlet />;
};

export default VisitorRoute;
