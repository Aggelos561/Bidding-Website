import React, { useContext } from "react";
import AuthProvider from "../../context/AuthProvider";
import DisplayAuctions from "./DisplayAuctions";
import Recommendation from "../Recommendation/Recommendation";

const MyBids = () => {
	const { auth } = useContext(AuthProvider);

	return (
		<div>
			<br />
			<h3>My Bids</h3>
			<br />
			<DisplayAuctions url={`https://localhost:8000/list-mybids/`} authenticated={true} />

			<br />
			<br />
			{auth.access && <Recommendation />}
			<br />
			<br />
		</div>
	);
};

export default MyBids;
