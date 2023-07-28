import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../../context/AuthProvider";
import Button from "react-bootstrap/Button";

const Home = () => {
	const { auth, setAuth } = useContext(AuthProvider);
	const navigate = useNavigate();

	const navigateToMyAuctions = () => {
		navigate(`/my-auctions/${auth.tok_username}/?page=1`);
	};

	const navigateToViewAuctions = () => {
		navigate("/view-auctions/?page=1");
	};

	const logout = () => {
		setAuth({});
		localStorage.clear();
		navigate("/");
	};

	useEffect(() => {
		if (!localStorage.getItem("USER_INFORMATION")) {
			logout();
		}
	}, []);

	return (
		<div>
			<br />
			<h3 className="h3">Home</h3>
			<h2 className="h2">Welcome to Bid Zone</h2>

			<div className="mb-2">
				<Button onClick={navigateToMyAuctions} variant="primary" size="lg">
					My Auctions
				</Button>{" "}
				<Button onClick={navigateToViewAuctions} variant="primary" size="lg">
					View Auctions
				</Button>
			</div>
		</div>
	);
};

export default Home;
