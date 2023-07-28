import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminUserCard from "./AdminUserCard";
import AuthProvider from "../../context/AuthProvider";
import Pagination from "../Pagination/Pagination";
import Loading from "../Loading/Loading";

const AdminUsers = () => {
	const [users, setUsers] = useState({
		data: null,
		error: false,
	});

	const [searchParams, setSearchParams] = useSearchParams();
	const [loadingData, setLoadingData] = useState(true);
	const [message, setMessage] = useState();
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();
	const { auth } = useContext(AuthProvider);

	useEffect(() => {
		setLoadingData(true);
		let responseData = getUserList();

		if (responseData) {
			responseData.then((values) => {
				setUsers({
					data: values,
					error: false,
				});
			});
		}

		setLoadingData(false);
	}, [searchParams]);

	const getUserList = async () => {
		let response = await fetch(`https://localhost:8000/userprofiles/?${searchParams}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(auth.access),
			},
		});

		let data = await response.json();

		if (!response.ok) {
			navigate("/admin/");
			throw new Error("Fetching Users Failed");
		} else {
			if (data.length === 0) {
				setMessage("No Users Found");
				navigate("/admin/users");
				return null;
			} else {
				return data;
			}
		}
	};

	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
		setSearchParams({ page: pageNumber });
	};

	let content = null;

	if (users.error) {
		content = <p>There was an error while fetching the data.</p>;
	}

	if (users.data?.results) {
		const allUsers = users.data.results.slice(0, users.data.results.length);

		content = allUsers.map((user, key) => (
			<div key={user.id}>
				<AdminUserCard user={user} />
			</div>
		));
	} else {
		content = loadingData ? <Loading type="spinningBubbles" /> : null;
	}

	return (
		<div>
			<br />
			<h2>This Is The Users Page</h2>
			<br />
			<div className="container">
				<div className="row">
					<div className="col-sm-4 mx-auto">
						<div className="list-group">{content}</div>
					</div>
				</div>
			</div>
			<br />
			<Pagination totalPages={users.data?.total_pages} paginate={paginate} />
			<h5>{message}</h5>
		</div>
	);
};

export default AdminUsers;
