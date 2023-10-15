import React, { useState, useContext }  from "react";
import { formatDate } from "../../helper/helpers";
import "./AuctionBidsList.css";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import AuthProvider from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const AuctionBidsList = ({ bidsList }) => {
	const [open, setOpen] = useState(false);
	const { auth } = useContext(AuthProvider);
	const navigate = useNavigate();

	return (
		<div>
			<Button
				onClick={() => {
					auth.access ? setOpen(!open) : navigate("/login");
				}}
				aria-controls="example-collapse-text"
				aria-expanded={open}
			>
				Show Bids
			</Button>

			{bidsList?.length ? (
				<div className="overflow-auto d-flex justify-content-center">
					<Collapse in={open}>
						<div id="example-collapse-text">
							<ul className="list-group">
								{bidsList?.map((bid, key) => (
									<li key={key} className="list-group-item">
										{bid.username} made a bid of ${bid.amount} on{" "}
										{formatDate(bid.time)}
									</li>
								))}
							</ul>
						</div>
					</Collapse>
				</div>
			) : (
				<div className="overflow-auto d-flex justify-content-center">
					<Collapse in={open}>
						<div id="example-collapse-text">
							<ul className="list-group">
								<li className="list-group-item">No bids yet</li>
							</ul>
						</div>
					</Collapse>
				</div>
			)}
		</div>
	);
};

export default AuctionBidsList;
