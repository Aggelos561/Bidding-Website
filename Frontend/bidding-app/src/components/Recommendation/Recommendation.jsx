import React, { useEffect, useContext, useState } from "react";
import AuthProvider from "../../context/AuthProvider";
import RecommandtationCard from "./RecommendationCard";

const Recommendation = () => {
	const { auth } = useContext(AuthProvider);
	const [loadingRecommended, setLoadingRecommended] = useState(true);
	const [recommendedAuctions, setRecommendedAuctions] = useState([]);

	const getRecommendedItems = async () => {
		let response = await fetch(
			`https://localhost:8000/visitation-log-matrix/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(auth.access),
				},
			}
		);

		let data = await response.json();

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		} else {
			setRecommendedAuctions(data);
			setLoadingRecommended(false);
		}
	};

	useEffect(() => {
		getRecommendedItems();
	}, []);

	let content = null;

	if (recommendedAuctions) {
		content = recommendedAuctions.map((auction, key) => (
			<RecommandtationCard key={auction.id.toString()} item={auction} />
		));
	}

	return loadingRecommended || !recommendedAuctions?.length ? (
		<div></div>
	) : (
		<div>
			<div className="container">
				<div className="d-flex justify-content-start">
					<h4>You may also like</h4>
				</div>
				<div className="row g-1">{content}</div>
			</div>
		</div>
	);
};

export default Recommendation;
