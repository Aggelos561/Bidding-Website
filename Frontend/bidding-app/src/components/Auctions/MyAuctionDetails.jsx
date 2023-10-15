import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import AuthProvider from "../../context/AuthProvider";
import { getTimeFormat } from "../../helper/helpers";
import ProductNameForm from "../Forms/ProductNameForm";
import ImagesUpload from "../Forms/ImagesUpload";
import PriceForm from "../Forms/PriceForm";
import DateForm from "../Forms/DateForm";
import DescriptionForm from "../Forms/DescriptionForm";
import CategoriesSelect from "../Forms/CategoriesSelect";
import LocationForm from "../Forms/LocationForm";
import Button from "react-bootstrap/Button";
import "react-image-gallery/styles/css/image-gallery.css";
import ShowMap from "../Maps/ShowMap";
import AuctionBidsList from "../BidsList/AuctionBidsList";
import Loading from "../Loading/Loading";
import ChooseInMap from "../Maps/ChooseInMap";

const MyAuctionDetails = () => {
	const { id } = useParams();
	const [item, setItem] = useState();
	const [loadingData, setLoadingData] = useState(true);
	const { auth } = useContext(AuthProvider);
	const navigate = useNavigate();
	const [inputError, setInputError] = useState({
		nameError: false,
		currentlyError: false,
		buypriceError: false,
		firstbidError: false,
		startsError: false,
		endsError: false,
		descriptionError: false,
		categorynameError: false,
		locationError: false,
		countryError: false,
		imagesError: false,
	});

	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	const [country, setCountry] = useState("");
	const [currently, setCurrently] = useState("");
	const [buyPrice, setBuyPrice] = useState("");
	const [firstBid, setFirstBid] = useState("");
	const [numberOfBids, setNumberOfBids] = useState("");
	const [longitude, setLongtitude] = useState();
	const [latitude, setLatitude] = useState();
	const [starts, setStarts] = useState("");
	const [ends, setEnds] = useState();
	const [description, setDescription] = useState("");
	const [active, setActive] = useState(false);
	const [categoryName, setCategoryName] = useState([]);
	const [chosenCategory, setChosenCategory] = useState([]);
	const [coordinates, setCoordinates] = useState(null);
	const [bidsList, setBidsList] = useState();
	const [galleryImages, setGalleryImages] = useState([]);
	const [putImages, setPutImages] = useState([]);

	const [isDisabled, setIsDisabled] = useState(false);
	const [checked, setChecked] = useState(false);
	const [disableField, setDisableField] = useState(false);

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
			throw new Error("Fetching Items Failed");
		} else {
			setItem(data);
			setName(data.name);
			setLocation(data.location);
			setCountry(data.country);
			setCurrently(data.currently);
			setBuyPrice(data.buyprice);
			setFirstBid(data.firstbid);
			setNumberOfBids(data.numberofbids);
			setLongtitude(data.longitude);
			setLatitude(data.latitude);
			if (loadingData) {
				setStarts(new Date(data.started));
				setEnds(new Date(data.ends));
			}

			setDescription(data.description);
			setActive(data.active);
			setChosenCategory(data.category);
			if (data.longitude === null && data.latitude === null) {
				setCoordinates(null);
			} else {
				setCoordinates([data.latitude, data.longitude]);
			}

			setLoadingData(false);
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
			setGalleryImages(imagesArray);
		}
	};

	const getCategories = async () => {
		await fetch("https://localhost:8000/category/", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})
			.then((data) => data.json())
			.then((data) => {
				for (var category in data) {
					categoryName.push(data[category].name);
				}
			});
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

	useEffect(() => {
		getCategories();
		getItemPictures();
		getItemData();
		getAuctionBidsList();
	}, []);

	useEffect(() => {
		let interval = setInterval(() => {
			getAuctionBidsList();
		}, 30000);

		return () => clearInterval(interval);
	}, [auth]);

	useEffect(() => {
		if (ends < new Date() || numberOfBids > 0) {
			setDisableField(true);
		}
	}, [ends, numberOfBids]);

	useEffect(() => {
		let interval;
		if (checked) {
			interval = setInterval(() => {
				setStarts(new Date());
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [checked]);

	const submit = async () => {
		let isValid = Object.values(inputError).every((value) => value === false);

		if (isValid) {
			updateForm();
			navigate("/");
		}
	};

	const updateForm = async () => {
		let response = await fetch(`https://localhost:8000/item-checker/${id}/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		let data = await response.json();

		if (!response.ok) {
			throw new Error("Bidding Checker Error");
		} else {
			if (!data.active) {
				navigate("/forbidden-action", {
					state: {
						message: "This Auction Is Not Active",
						access: true,
					},
				});
				return;
			} else if (data.numberofbids > 0) {
				navigate("/forbidden-action", {
					state: {
						message: "Number OF bids Exceeds 0",
						access: true,
					},
				});
				return;
			}
		}

		let currentTime = getTimeFormat(starts);

		let expirationDate = getTimeFormat(ends);

		let json_structure = {
			name: name,
			location: location,
			country: country,
			latitude: latitude,
			longitude: longitude,
			currently: currently,
			buyprice: buyPrice,
			firstbid: firstBid,
			numberofbids: numberOfBids,
			started: currentTime,
			ends: expirationDate,
			description: description,
			active: active,
			seller_user: auth.profile_id,
			category: chosenCategory,
		};

		response = await fetch(`https://localhost:8000/update-item/${item.id}/`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(auth.access),
			},
			body: JSON.stringify(json_structure),
		});

		data = await response.json();

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		} else {
			updateImages();
		}
	};

	const updateImages = async () => {
		if (Number(putImages.length) > 0) {
			let response = await fetch(`https://localhost:8000/update-pictures/${item.id}/`, {
				method: "DELETE",
				headers: {
					Authorization: "Bearer " + String(auth.access),
				},
			});

			for (let i = 0; i < Number(putImages.length); i++) {
				let formData = new FormData();
				formData.append("url", putImages[i], putImages[i].name);
				formData.append("item", item.id);

				let response = await fetch(`https://localhost:8000/update-pictures/${item.id}/`, {
					method: "PUT",
					headers: {
						Authorization: "Bearer " + String(auth.access),
					},
					body: formData,
				});

				if (!response.ok) {
					return false;
				}
			}
		}

		return true;
	};

	const deleteAuction = async () => {
		let response = await fetch(`https://localhost:8000/update-item/${item.id}/`, {
			method: "DELETE",
			headers: {
				Authorization: "Bearer " + String(auth.access),
			},
		});

		if (!response.ok) {
			throw new Error("Auction Delete Failed");
		} else {
			navigate("/");
		}
	};

	return loadingData ? (
		<Loading type="spinningBubbles" />
	) : (
		<div className="container">
			<div className="row">
				<div className="col-sm-4 mx-auto">
					<br />
					{disableField ? (
						numberOfBids > 0 && ends < new Date() ? (
							<h4 style={{ color: "red" }}>
								Number Of Bids Exceeds 0 And The Auction Has Expired
							</h4>
						) : (
							<div>
								{numberOfBids > 0 ? (
									<h4 style={{ color: "red" }}>Number Of Bids Exceeds 0</h4>
								) : (
									<div>
										{ends < new Date() ? (
											<h4 style={{ color: "red" }}>
												The Auction Has Expired
											</h4>
										) : (
											<div></div>
										)}
									</div>
								)}
							</div>
						)
					) : (
						<div></div>
					)}

					<label>Product(s) Name: </label>

					<ProductNameForm
						isDisabled={disableField}
						name={name}
						setName={setName}
						inputError={inputError}
						setInputError={setInputError}
						InputName="nameError"
					/>

					<br />

					<div className="grid-container">
						<ImageGallery
							items={galleryImages}
							showPlayButton={false}
							showNav={false}
						/>
					</div>

					<br />

					<ImagesUpload
						isDisabled={disableField}
						images={putImages}
						setImages={setPutImages}
						inputError={inputError}
						setInputError={setInputError}
						InputName="imagesError"
					/>

					<br />

					<PriceForm
						isDisabled={disableField}
						price={currently}
						setPrice={setCurrently}
						inputError={inputError}
						setInputError={setInputError}
						InputName="currentlyError"
						firstbid={firstBid}
						label="Starting Price"
					/>

					<br />

					<PriceForm
						isDisabled={disableField}
						price={buyPrice}
						setPrice={setBuyPrice}
						inputError={inputError}
						setInputError={setInputError}
						InputName="buypriceError"
						currently={currently}
						label="Buy Price"
					/>

					<br />

					<PriceForm
						isDisabled={disableField}
						price={firstBid}
						setPrice={setFirstBid}
						inputError={inputError}
						setInputError={setInputError}
						InputName="firstbidError"
						currently={currently}
						label="First Bid Offer"
					/>

					<br />
					<AuctionBidsList bidsList={bidsList} />
					<br />
					<DateForm
						starts={starts}
						setStarts={setStarts}
						ends={ends}
						setEnds={setEnds}
						isDisabled={disableField}
						setIsDisabled={setIsDisabled}
						checked={checked}
						setChecked={setChecked}
						setActive={setActive}
						inputError={inputError}
						setInputError={setInputError}
						InputName1="startsError"
						InputName2="endsError"
					/>

					<br />

					<DescriptionForm
						isDisabled={disableField}
						description={description}
						setDescription={setDescription}
						inputError={inputError}
						setInputError={setInputError}
						InputName="descriptionError"
					/>

					<br />

					<CategoriesSelect
						isDisabled={disableField}
						chosenCategory={chosenCategory}
						setChosenCategory={setChosenCategory}
						inputError={inputError}
						setInputError={setInputError}
						InputName="chosenCategoryError"
					/>

					<br />

					<LocationForm
						isDisabled={disableField}
						location={location}
						setLocation={setLocation}
						inputError={inputError}
						setInputError={setInputError}
						InputName="locationError"
						label="Location"
					/>

					<br />

					<LocationForm
						isDisabled={disableField}
						location={country}
						setLocation={setCountry}
						inputError={inputError}
						setInputError={setInputError}
						InputName="countryError"
						label="Country"
					/>

					<br />
					<br />
				</div>
			</div>
			{disableField ? (
				<ShowMap latitude={latitude} longitude={longitude} />
			) : (
				<ChooseInMap
					disabled={disableField}
					setLongtitude={setLongtitude}
					setLatitude={setLatitude}
					coordinates={coordinates}
					setCoordinates={setCoordinates}
					latitude={latitude}
					longitude={longitude}
				/>
			)}
			<br />
			<Button disabled={disableField} onClick={submit}>
				Update Auction
			</Button>{" "}
			<Button disabled={disableField} onClick={deleteAuction}>
				Delete Auction
			</Button>
			<br />
			<br />
			<br />
			<br />
		</div>
	);
};

export default MyAuctionDetails;
