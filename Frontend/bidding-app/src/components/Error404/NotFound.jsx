import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthProvider from "../../context/AuthProvider";

const NotFound = () => {
	const { auth } = useContext(AuthProvider);

	return (
		<div>
			<br />
			<h1>404 - Not Found!</h1>
			<h5>
				<Link to={auth.is_superuser ? "/admin" : "/"}>Go Home</Link>
			</h5>
		</div>
	);
};

export default NotFound;
