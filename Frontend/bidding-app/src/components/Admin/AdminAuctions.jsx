import React, { useEffect, useState } from "react";
import AuctionData from "./AuctionData";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import Loading from "../Loading/Loading";
import AuctionCard from "../Auctions/AuctionCard";

const AdminAuctions = () => {
	const [items, setItems] = useState({
		data: null,
		error: false,
	});

	const [searchParams, setSearchParams] = useSearchParams();
	const [loadingAuctions, setLoadingAuctions] = useState(true);
	const [message, setMessage] = useState();
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setLoadingAuctions(true);
		let responseData = getAuctions();

		if (responseData) {
			responseData.then((values) => {
				setItems({
					data: values,
					error: false,
				});
			});
		}

		setLoadingAuctions(false);
	}, [searchParams]);

	const getAuctions = async () => {
		let response = await fetch(`https://localhost:8000/admin-list-items/?${searchParams}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		let data = await response.json();

		if (!response.ok) {
			throw new Error("Fetching Auctions Failed");
		} else {
			if (data.length === 0) {
				setMessage("No Auctions Submitted Yet");
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

	if (items.error) {
		content = <p>There was an error while fetching the data.</p>;
	}

	if (items.data?.results) {
		const currentAuctions = items.data.results.slice(0, items.data.results.length);
		content = currentAuctions.map((item, key) => (
			<AuctionCard url={`/admin/auction/${item.id}`} item={item} key={key} />
		));
	} else {
		content = loadingAuctions ? <Loading type="spinningBubbles" /> : null;
	}

	return (
		<div>
			<AuctionData />
			<h4>Auctions List</h4>
			<div className="container">
				<div className="row">{content}</div>
			</div>
			<Pagination totalPages={items.data?.total_pages} paginate={paginate} />
			<h5>{message}</h5>
			<br />
		</div>
	);
};

export default AdminAuctions;
