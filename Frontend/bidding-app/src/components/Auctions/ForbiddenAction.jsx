import React from "react";
import { useLocation } from "react-router-dom";

import NotFound from "../Error404/NotFound";

const ForbiddenAction = () => {
	const { state } = useLocation();

	return state?.access ? (
		<div>
			<br />
			<h2>{state.message}</h2>
		</div>
	) : (
		<div>
			<NotFound />
		</div>
	);
};

export default ForbiddenAction;
