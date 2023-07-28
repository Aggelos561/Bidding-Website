import React, { useContext } from "react";
import Recommendation from "../Recommendation/Recommendation";
import AuthProvider from "../../context/AuthProvider";
import SearchFilters from "../Filtering/SearchFilters";
import DisplayAuctions from "./DisplayAuctions";


const ViewAuctions = () => {

	const { auth } = useContext(AuthProvider);

	return (
		<div>
			<br />
			<SearchFilters />
			<br />

			<h4>All Auctions</h4>
			<br />
			<DisplayAuctions url={`https://localhost:8000/items-paging/`} authenticated={false}/>

			<br />
			{auth.access && <Recommendation />}
			<br />
			<br />

		</div>
	);
};

export default ViewAuctions;
