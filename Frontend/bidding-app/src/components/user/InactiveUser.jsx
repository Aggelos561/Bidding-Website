import React from "react";
import { useLocation } from "react-router-dom";

import NotFound from "../Error404/NotFound";

const InactiveUser = () => {
	const { state } = useLocation();

	return state?.access ? (
		<div>
			<br />
			<h2>This User Is Pending Activation From The Page Admin</h2>
		</div>
	) : (
		<div>
			<NotFound />
		</div>
	);
};

export default InactiveUser;
