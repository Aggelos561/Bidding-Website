import React, { useEffect, useState, useContext } from "react";
import AuthProvider from "../../context/AuthProvider";
import Loading from "../Loading/Loading";
import SenderCard from "./SenderCard";

const Send = () => {
	const [loadingData, setLoadingData] = useState(true);
	const { auth } = useContext(AuthProvider);
	const [senderMessages, setSenderMessages] = useState();
	const [noSendMessages, setNoSendMessages] = useState("");

	useEffect(() => {
		getSenderMessages();
	}, []);

	const getSenderMessages = async () => {
		let response = await fetch(
			`https://localhost:8000/sender-messages-card/`,
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
			throw new Error("Fetching Receiver Messages Failed");
		} else {
			if (data.length) {
				setSenderMessages(data);
			} else {
				setSenderMessages("");
				setNoSendMessages("You don't have any messages");
			}

			setLoadingData(false);
		}
	};

	const deleteSenderMessage = async (message) => {
		let response = await fetch(
			`https://localhost:8000/delete-message/${message.id}/`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(auth.access),
				},
			}
		);

		if (!response.ok) {
			throw new Error("Auction Delete Failed");
		} else {
			setLoadingData(true);
			getSenderMessages();
		}
	};

	useEffect(() => {
		getSenderMessages();
	}, []);

	let content = null;

	if (senderMessages) {
		content = senderMessages?.map((message) => (
			<div key={message.id.toString()}>
				<SenderCard message={message} deleteMessage={deleteSenderMessage} />
			</div>
		));
	} else {
		content = loadingData ? <Loading type="spinningBubbles" /> : null;
	}

	return (
		<div>
			<div className="scrollable-content">{content}</div>
			<h4>{noSendMessages}</h4>
		</div>
	);
};

export default Send;
