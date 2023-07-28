import React, { useContext, useEffect, useState } from "react";
import AuthProvider from "../../context/AuthProvider";
import AuctionCard from "./AuctionCard";
import Pagination from "../Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import Loading from "../Loading/Loading";

const MyAuctions = () => {
	const { auth } = useContext(AuthProvider);
	const [currentPage, setCurrentPage] = useState(1);

	const [myAuctions, setMyAuctions] = useState({
		data: null,
		error: false,
	});

	const [searchParams, setSearchParams] = useSearchParams();
	const [loadingData, setLoadingData] = useState(true);
	const [message, setMessage] = useState();

	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
		setSearchParams({ page: pageNumber });
	};

	useEffect(() => {
		const getMyAuctions = async () => {
			let response = await fetch(
				`https://localhost:8000/my-items-list/?user=${
					auth.tok_username
				}&page=${searchParams.get("page")}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + String(auth.access),
					},
				}
			);

			let data = await response.json();

			if (data.results.length === 0) {
				setMessage("You Do Not Have Any Auctions Submitted");
				setLoadingData(false);
				return null;
			} else {
				setLoadingData(false);
				return data;
			}
		};

		let responseData = getMyAuctions();

		responseData.then((values) => {
			setMyAuctions({
				data: values,
				error: false,
			});
		});

	}, [searchParams]);

	let content = null;

	if (myAuctions.error) {
		content = <p>There was an error while fetching the data.</p>;
	}

	if (myAuctions.data?.results) {
		const currentAuctions = myAuctions.data.results.slice(0, myAuctions.data.results.length);
		content = currentAuctions?.map((myAuction, key) => (
			<AuctionCard
				key={myAuction.id.toString()}
				url={`/my-auctions/${auth.tok_username}/${myAuction.id}`}
				item={myAuction}
			/>
		));
	} else {
		content = loadingData ? <Loading type="spinningBubbles" /> : null;
	}

	return loadingData ? (
		<Loading type="spinningBubbles" />
	) : (
		<div>
			<br />
			<h3>My Auctions</h3>
			<br />
			<br />
			<div className="container">
				<div className="row">{content}</div>
			</div>
			<h4>{message}</h4>

			{myAuctions.data?.total_pages ? (
				<Pagination totalPages={myAuctions.data?.total_pages} paginate={paginate} />
			) : null}
		</div>
	);
};

export default MyAuctions;
