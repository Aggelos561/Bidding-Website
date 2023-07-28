import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Loading from "../Loading/Loading";

const RecommandtationCard = (props) => {
	const [img, setImg] = useState();

	const [loadingCard, setLoadingCard] = useState(true);
	const [textColor, setTextColor] = useState("black");

	const getPrimaryPicture = async () => {
		let response = await fetch(`https://localhost:8000/item-pictures/${props.item.id}/`);

		let data = await response.json();

		setImg(`https://localhost:8000${data[0].url}`);

		setLoadingCard(false);
	};

	const handleOnMouseEnter = () => {
		setTextColor("#1E90FF");
	};

	const handleOnMouseLeave = () => {
		setTextColor("black");
	};

	useEffect(() => {
		getPrimaryPicture();
	}, []);

	return loadingCard ? (
		<Loading type="blank" />
	) : (
		<div className="col-2 d-flex align-self-stretch">
			<Card className="shadow-sm mb-4">
				<a href={`/view-auctions/auction/${props.item.id}`}>
					<Card.Img style={{ height: "9rem" }} variant="top" src={img} />
					<br />
				</a>
				<Card.Body>
					<a
						onMouseEnter={handleOnMouseEnter}
						onMouseLeave={handleOnMouseLeave}
						style={{ color: textColor, textDecoration: "none" }}
						href={`/view-auctions/auction/${props.item.id}`}
					>
						<Card.Title>{props.item.name}</Card.Title>
					</a>
				</Card.Body>
			</Card>
		</div>
	);
};

export default RecommandtationCard;
