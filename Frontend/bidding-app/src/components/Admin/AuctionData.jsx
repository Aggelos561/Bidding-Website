import React, { useContext, useEffect, useState } from "react";
import AuthProvider from "../../context/AuthProvider";
import Button from "react-bootstrap/Button";
import Loading from "../Loading/Loading";

const AuctionData = () => {
	const [jsonUrl, setJsonUrl] = useState("");
	const [XMLUrl, setXMLUrl] = useState("");
	const [loadingFiles, setLoadingFiles] = useState(true);
	const [filesCreated, setFilesCreated] = useState();
	const { auth } = useContext(AuthProvider);

	const createAuctionFiles = async () => {
		let response = await fetch(`https://localhost:8000/create-auction-files/`, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + String(auth.access),
			},
		});

		if (!response.ok) {
			console.log(`Error status: ${response.status}`);
		}

		setFilesCreated(true);
	};

	const getJson = async () => {
		let response = await fetch(`https://localhost:8000/auctions-json/`, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + String(auth.access),
			},
		});

		if (!response.ok) {
			throw new Error("Error fetching Json " + response.status);
		}

		setJsonUrl(response.url);
	};

	const getXML = async () => {
		let response = await fetch(`https://localhost:8000/auctions-xml/`, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + String(auth.access),
			},
		});

		if (!response.ok) {
			throw new Error("Error fetching XML");
		}

		setXMLUrl(response.url);

		setLoadingFiles(false);
	};

	useEffect(() => {
		createAuctionFiles();
	}, []);

	useEffect(() => {
		if (filesCreated) {
			getJson();
			getXML();
		}
	}, [filesCreated]);

	return loadingFiles ? (
		<Loading type="cylon" />
	) : (
		<div>
			<br />
			<a href={jsonUrl} target="_blank" rel="noreferrer" download>
				<Button>Get Json</Button>
			</a>{" "}
			<a href={XMLUrl} target="_blank" rel="noreferrer" download>
				<Button>Get XML</Button>
			</a>
			<br />
			<br />
		</div>
	);
};

export default AuctionData;
