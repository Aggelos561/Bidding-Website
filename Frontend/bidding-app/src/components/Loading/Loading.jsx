import React from "react";
import ReactLoading from "react-loading";
import "./Loading.css";

// Type = spinningBubbles or blank or cylon
const Loading = ({ type }) => {
	return (
		<div className="loading-comp">
			<ReactLoading type={type} color="black" height={35} width={45} />
		</div>
	);
};

export default Loading;
