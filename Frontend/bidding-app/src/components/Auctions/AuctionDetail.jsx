import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import AuthProvider from "../../context/AuthProvider";
import BiddingForm from "../Forms/BiddingForm";
import ShowMap from "../Maps/ShowMap";
import Form from "react-bootstrap/Form";
import "react-image-gallery/styles/css/image-gallery.css";
import { formatDate } from "../../helper/helpers";
import AuctionBidsList from "../BidsList/AuctionBidsList";
import Loading from "../Loading/Loading";

const AuctionDetail = () => {
	const { id } = useParams();
	const [item, setItem] = useState();
	const [images, setImages] = useState([]);
	const [user, setUser] = useState();
	const [bidsList, setBidsList] = useState();
	const [loadingData, setLoadingData] = useState(true);
	const [message, setMessage] = useState("");
	const [isDisabled, setIsDisabled] = useState(false);
	const { auth } = useContext(AuthProvider);
	const navigate = useNavigate();

	const getItemData = async () => {
		let response = await fetch(`https://localhost:8000/item/${id}/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		let data = await response.json();

		if (!response.ok) {
			navigate("/");
			throw new Error(`Error: ${response.status}`);
		} else {
			if (!data.active) {
				setIsDisabled(true);
				setMessage("This Auction Is No Longer Available");
			}
			setItem(data);
		}
	};

	const getItemPictures = async () => {
		let response = await fetch(`https://localhost:8000/item-pictures/${id}/`);

		let data = await response.json();

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		} else {
			let imagesArray = [];

			for (let image in data) {
				imagesArray.push({
					original: `https://localhost:8000${data[image].url}`,
					thumbnail: `https://localhost:8000${data[image].url}`,
				});
			}

			setImages(imagesArray);
		}
	};

	const getAuctionBidsList = async () => {
		let response = await fetch(`https://localhost:8000/list-bids/${id}/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(auth.access),
			},
		});

		let data = await response.json();

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		} else {
			setBidsList(data);
		}
	};

	const addRecommendation = async () => {
		if (!auth.access) return;

		let json_structure = {
			user_id: auth.profile_id,
			item_id: id,
		};

		let response = await fetch(`https://localhost:8000/visitation-log/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(auth.access),
			},
			body: JSON.stringify(json_structure),
		});

		if (!response.ok) {
			console.log(`Error status: ${response.status}`);
		}
	};

	const getData = () => {
		getItemData();
		getItemPictures();
		if (auth.access) getAuctionBidsList();
	};

	useEffect(() => {
		addRecommendation();
		getData();
	}, []);

	useEffect(() => {
		let interval = setInterval(() => {
			getData();
		}, 30000);

		return () => clearInterval(interval);
	}, [auth]);

	useEffect(() => {
		const getAuctionUserData = async () => {
			let response = item?.seller_user
				? await fetch(`https://localhost:8000/profile-id-details/${item?.seller_user}/`)
				: undefined;

			if (response) {
				let data = await response.json();

				if (!response.ok) {
					throw new Error(`Error: ${response.status}`);
				} else {
					setUser(data);
					setLoadingData(false);
				}
			}
		};

		getAuctionUserData();
	}, [item]);

	return loadingData ? (
		<Loading type="cylon" />
	  ) : (
		<div>
			
		  <br />
		  <h5 style={{ color: "red" }}>{message}</h5>
		  <div className="container">

			<div className="row">

			  <div className="col-7">
				<ImageGallery items={images} showPlayButton={false} showNav={false} />
				<div className="overlay"></div>
			  </div>
			  <div className="col-5 h6">

				<h4>{item.name}</h4>
				<h5>Seller: {user.user_id.username}</h5>
				<h5>Rating: {user.rating}</h5>
				<br />
				<br />
				<p>Auction Started On {formatDate(item.started)}</p>
				<p>Auction Ends On {formatDate(item.ends)}</p>
	  
				{item.buyprice && <p>Buy Price: ${item.buyprice}</p>}
				<p>Current Price: ${item.currently}</p>
				<p>Total Bids: {item.numberofbids}</p>
	  
				{Number(item.seller_user) !== Number(auth.profile_id) &&
				!auth.is_superuser ? (
				  <BiddingForm
					item={item}
					getItemData={getItemData}
					isDisabled={isDisabled}
				  />
				) : (
				  <div></div>
				)}
				<br />
				<p>Bid ${item.firstbid} or more</p>
	  
				<AuctionBidsList bidsList={bidsList} />
				<br />
	  
				<p>Categories:</p>
				<ul className="list-unstyled">
				  {item.category.map((category) => (
					<li key={category}>
					  <span className="badge badge-pill bg-success m-1">
						{category}
					  </span>
					</li>
				  ))}
				</ul>
			  </div>
			</div>
		  </div>

		  <br />
		  <br />
		  <br />

		  <div className="container">
			<Form.Group readOnly>
			  <Form.Label>
				<h5>Description: </h5>
			  </Form.Label>
			  <Form.Control as="textarea" rows={12} value={item.description} readOnly />
			</Form.Group>

			<br />

			<h4>Country: {item.country}</h4>
			<h4>Location: {item.location}</h4>

			<br />
			{item.longitude && <ShowMap longitude={item.longitude} latitude={item.latitude} />}
		  </div>

		  <br />
		  <br />

		</div>
	  );
	  
};

export default AuctionDetail;
