import React, { useEffect, useState, useContext } from "react";
import Card from "react-bootstrap/Card";
import Loading from "../Loading/Loading";

const AuctionCard = (props) => {
	const [img, setImg] = useState();
	const [loadingCard, setLoadingCard] = useState(true);
	const [textColor, setTextColor] = useState("black");

	const getPrimaryPicture = async () => {
		setLoadingCard(true);
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
	}, [props.item]);

	return loadingCard ? (
		<Loading type="cylon" />
	) : (
		<div className="col-sm-12 col-md-6 col-lg-3 d-flex align-self-stretch">
			<br />
			<Card className="card shadow-sm mb-4" style={{ width: "19rem" }}>
				<a href={props.url}>
					<Card.Img style={{ height: "12rem" }} variant="top" src={img} />
				</a>
				<Card.Body className="d-flex flex-column bottom">
					<a
						onMouseEnter={handleOnMouseEnter}
						onMouseLeave={handleOnMouseLeave}
						style={{
							color: textColor,
							textDecoration: "none",
						}}
						href={props.url}
					>
						<Card.Title>{props.item.name}</Card.Title>
					</a>
				</Card.Body>
				<Card.Text>
					Current Price: ${props.item.currently} <br />
					{props.item.buyprice && `Buy Price: $${props.item.buyprice}`}
				</Card.Text>
			</Card>
		</div>
	);
};

export default AuctionCard;
