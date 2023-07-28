import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { formatDate } from "../../Helper/helper";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";

const ReceiverCard = ({ message, deleteMessage }) => {
	const navigate = useNavigate();

	const navToMessageDetails = () => {
		navigate(`/message-details/${message.id}`, {
			state: {
				user: "receiver",
			},
		});
	};

	return (
		<Container>
			<Card style={{ margin: 10 }}>
				<Card.Header
					className={
						!message.read
							? "card text-white bg-danger mb-3"
							: "card text-white bg-primary mb-3"
					}
				>
					From {message.sender_user}
				</Card.Header>
				<Card.Body>
					<Card.Title>{message.subject}</Card.Title>
					<Button variant="primary" onClick={navToMessageDetails}>
						View Message
					</Button>{" "}
					<Button variant="danger" onClick={() => deleteMessage(message)}>
						Delete Message
					</Button>
				</Card.Body>
				<Card.Footer>
					<small className="text-muted">Time: {formatDate(message.time)}</small>
				</Card.Footer>
			</Card>
		</Container>
	);
};

export default ReceiverCard;
