import { useContext } from "react";
import { Outlet } from "react-router-dom";
import NotFound from "../components/Error404/NotFound";
import AuthProvider from "../context/AuthProvider";

const PublicRoute = () => {
	const { auth } = useContext(AuthProvider);
	let Authanticated = JSON.stringify(auth) === "{}";

	return Authanticated ? <Outlet /> : <NotFound />;
};

export default PublicRoute;
