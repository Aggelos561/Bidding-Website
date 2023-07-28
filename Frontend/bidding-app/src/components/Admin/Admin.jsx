import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const Admin = () => {
	const navigate = useNavigate();

	const navigateToUsers = () => {
		navigate("/admin/users");
	};

	const navigateToAuctions = () => {
		navigate("/admin/auctions");
	};

	return (
		<div>
			<br />
			<h2>Admin Page</h2>
			<br />
			<Button onClick={navigateToUsers}>View Users</Button>
			{"   "}
			<Button onClick={navigateToAuctions}>View Auctions</Button>
		</div>
	);
};

export default Admin;
