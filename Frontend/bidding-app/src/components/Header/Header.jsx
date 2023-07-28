import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../../context/AuthProvider";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useEffect } from "react";
import { useState } from "react";

const Header = () => {
	const { auth, setAuth } = useContext(AuthProvider);
	const [counter, setCounter] = useState();
	let Authenticated = JSON.stringify(auth);
	let normalUser = Authenticated !== "{}" && !auth.is_superuser;
	let isAuthenticated = Authenticated !== "{}";
	let isSuperUser = auth.is_superuser;
	const navigate = useNavigate();

	const getMessagesCounter = async () => {
		let response = await fetch(`https://localhost:8000/unread-messages/`, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + String(auth.access),
			},
		});
		let data = await response.json();

		setCounter(data.count);
	};

	useEffect(() => {
		if (!localStorage.getItem("USER_INFORMATION")) {
			logout();
		}
		if (normalUser) {
			getMessagesCounter();
			let oneMinute = 1000 * 60 * 1;
			let interval = setInterval(getMessagesCounter, oneMinute);
			return () => clearInterval(interval);
		}
	}, [auth]);

	const navigateToHome = (e) => {
		e.preventDefault();
		navigate("/");
	};

	const navigateToAdminHome = (e) => {
		e.preventDefault();
		navigate("/admin");
	};

	const navigateToCreateAuctions = (e) => {
		e.preventDefault();
		navigate("/auction-creation");
	};

	const navigateToMyAuctions = (e) => {
		e.preventDefault();
		navigate(`/my-auctions/${auth.tok_username}/?page=1`);
	};

	const navigateToMyBids = (e) => {
		e.preventDefault();
		navigate(`/my-bids/${auth.tok_username}/?page=1`);
	};

	const navigateToMyMessagesHome = (e) => {
		e.preventDefault();
		navigate("/my-messages");
	};

	const navigateToViewAuctions = (e) => {
		e.preventDefault();
		navigate("/view-auctions/?page=1");
	};

	const navigateToLogin = (e) => {
		e.preventDefault();
		navigate("/login");
	};
	const navigateToRegister = (e) => {
		e.preventDefault();
		navigate("/Register");
	};

	const logout = () => {
		localStorage.clear();
		navigate("/");
	};

	return (
		<div>
			<Navbar bg="dark" variant="dark">
				<Container fluid>
					{!auth.is_superuser ? (
						<Navbar.Brand>
							<Nav.Link
								href="/"
								onClick={(e) => {
									navigateToHome(e);
								}}
							>
								Bid Zone
							</Nav.Link>
						</Navbar.Brand>
					) : (
						<Navbar.Brand>
							<Nav.Link
								href="/admin"
								onClick={(e) => {
									navigateToAdminHome(e);
								}}
							>
								Bid Zone
							</Nav.Link>
						</Navbar.Brand>
					)}

					<Nav className="me-auto">
						{!isSuperUser && (
							<Nav.Link
								href="/view-auctions/?page=1"
								onClick={(e) => {
									navigateToViewAuctions(e);
								}}
							>
								View Auctions
							</Nav.Link>
						)}

						{normalUser && (
							<Nav.Link
								href="/auction-creation"
								onClick={(e) => {
									navigateToCreateAuctions(e);
								}}
							>
								Create Auction
							</Nav.Link>
						)}
						{normalUser && (
							<Nav.Link
								href={`/my-auctions/${auth.tok_username}/?page=1`}
								onClick={(e) => {
									navigateToMyAuctions(e);
								}}
							>
								My Auctions
							</Nav.Link>
						)}

						{normalUser && (
							<Nav.Link
								href={`/my-bids/${auth.tok_username}/?page=1`}
								onClick={(e) => {
									navigateToMyBids(e);
								}}
							>
								My Bids
							</Nav.Link>
						)}

						{normalUser && (
							<Nav.Link
								href="/my-messages"
								onClick={(e) => {
									navigateToMyMessagesHome(e);
								}}
								className="position-relative"
							>
								My Messages{" "}
								{counter > 0 ? (
									<span className="badge text-bg-danger">
										{counter > 99 ? "99+" : counter}
									</span>
								) : (
									<></>
								)}
							</Nav.Link>
						)}
					</Nav>

					<Nav>
						<div className="d-flex justify-content-end">
							{!isAuthenticated && (
								<Nav.Link
									href="/login"
									onClick={(e) => {
										navigateToLogin(e);
									}}
								>
									Login
								</Nav.Link>
							)}
							{isAuthenticated && <Nav.Link>{auth.tok_username} </Nav.Link>}
							{!isAuthenticated && (
								<Nav.Link
									href="/Register"
									onClick={(e) => {
										navigateToRegister(e);
									}}
								>
									Register
								</Nav.Link>
							)}
							{isAuthenticated && (
								<div className="d-flex justify-content-end">
									<Nav.Link href="/login" onClick={logout}>
										Logout
									</Nav.Link>
								</div>
							)}
						</div>
					</Nav>
				</Container>
			</Navbar>
		</div>
	);
};

export default Header;
