import React, { useEffect, useState, useCallback, useContext } from "react";
import AuthProvider from "../../context/AuthProvider";
import AuctionCard from "./AuctionCard";
import Pagination from "../Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import Loading from "../Loading/Loading";

const DisplayAuctions = ({ url, authenticated}) => {
	const [items, setItems] = useState({
		data: null,
		error: false,
	});

	var content = null;

	const { auth } = useContext(AuthProvider);
	const [message, setMessage] = useState();
	const [loadingAuctions, setLoadingAuctions] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);

	const [searchParams, setSearchParams] = useSearchParams();

	const getAuctions = useCallback(async () => {
		let response = authenticated ? await fetch(url + `?${searchParams}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(auth.access),
			},
		})

		:
		
		await fetch(url + `?${searchParams}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		let data = await response.json();

		if (!response.ok) {
			setMessage("Didn't Find Any Auctions");
			throw new Error(`Error: ${response.status}`);
		} else {
			if (data.results.length === 0) {
				setMessage("Didn't Find Any Auctions");
				setLoadingAuctions(false);
				return null;
			} else {
				setMessage("");
				return data;
			}
		}
	}, [searchParams]);

	useEffect(() => {
		setLoadingAuctions(true);
		content = null;

		let responseData = getAuctions();

		responseData.then((values) => {
			setItems({
				data: values,
				error: false,
			});
		});
		setLoadingAuctions(false);
	}, [getAuctions]);

	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
		let updatedSearchParams = new URLSearchParams(searchParams.toString());
		updatedSearchParams.set("page", `${pageNumber}`);
		setSearchParams(updatedSearchParams.toString());
	};

	if (items.error) {
		content = <p>There was an error while fetching the data.</p>;
	}

	if (items.data?.results) {
		let currentItems = items.data.results.slice(0, items.data.results.length);
		content = currentItems?.map((item, key) => (
			<AuctionCard url={`/view-auctions/auction/${item.id}`} item={item} key={key} />
		));
	} else {
		content = loadingAuctions ? <Loading type="spinningBubbles" /> : null;
	}

	return (
		<div>
			<div className="container">
				<div className="row">{content}</div>
			</div>

			<h5>{message}</h5>

			{items.data?.total_pages ? (
				<Pagination totalPages={items.data?.total_pages} paginate={paginate} />
			) : null}
		</div>
	);
};

export default DisplayAuctions;
