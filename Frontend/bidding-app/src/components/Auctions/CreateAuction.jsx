import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../../context/AuthProvider";
import { getTimeFormat } from "../../Helper/helper";
import ProductNameForm from "../Forms/ProductNameForm";
import PriceForm from "../Forms/PriceForm";
import DateForm from "../Forms/DateForm";
import DescriptionForm from "../Forms/DescriptionForm";
import CategoriesSelect from "../Forms/CategoriesSelect";
import LocationForm from "../Forms/LocationForm";
import ImagesUpload from "../Forms/ImagesUpload";
import Button from "react-bootstrap/Button";
import "leaflet/dist/leaflet.css";
import ChooseInMap from "../Maps/ChooseInMap";

const CreateAuction = () => {
	const { auth } = useContext(AuthProvider);
	const navigate = useNavigate();

	const [inputError, setInputError] = useState({
		nameError: true,
		currentlyError: true,
		buypriceError: false,
		firstbidError: true,
		startsError: true,
		endsError: true,
		descriptionError: true,
		chosenCategoryError: true,
		locationError: true,
		countryError: true,
		imagesError: false,
	});

	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	const [country, setCountry] = useState("");
	const [currently, setCurrently] = useState("");
	const [buyPrice, setBuyPrice] = useState("");
	const [firstBid, setFirstBid] = useState("");
	const [longitude, setLongtitude] = useState();
	const [latitude, setLatitude] = useState();
	const [starts, setStarts] = useState("");
	const [ends, setEnds] = useState(new Date());
	const [description, setDescription] = useState("");
	const [active, setActive] = useState(false);
	const [chosenCategory, setChosenCategory] = useState([]);
	const [coordinates, setCoordinates] = useState(null);

	const [images, setImages] = useState([]);

	const [isDisabled, setIsDisabled] = useState(false);
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		let interval;

		if (checked) {
			interval = setInterval(() => {
				setStarts(new Date());
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [checked]);

	const postForm = async () => {
		let startDate = checked ? getTimeFormat(new Date()) : getTimeFormat(starts);

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
			numberofbids: 0,
			started: startDate,
			ends: expirationDate,
			description: description,
			active: active,
			seller_user: auth.profile_id,
			category: chosenCategory,
		};

		let response = await fetch("https://localhost:8000/create-items/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(auth.access),
			},
			body: JSON.stringify(json_structure),
		});

		let data = await response.json();

		if (!response.ok) {
			throw new Error("Creating New Auction Failed");
		} else {
			postImages(data.item_id);
		}
	};

	const postImages = async (item_id) => {
		if (Number(images.length) === 0) {
			let default_image = {
				url: false,
				item: item_id,
			};

			let response = await fetch("https://localhost:8000/create-pictures/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(auth.access),
				},
				body: JSON.stringify(default_image),
			});

			if (!response.ok) {
				throw new Error("Default Image Post Failed");
			}
		}

		for (let i = 0; i < Number(images.length); i++) {
			let formData = new FormData();

			formData.append("url", images[i], images[i].name);
			formData.append("item", item_id);

			let response = await fetch("https://localhost:8000/create-pictures/", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + String(auth.access),
				},
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Images Post Failed");
			}
		}

		return true;
	};

	const submit = async () => {
		let isValid = Object.values(inputError).every((value) => value === false);

		if (isValid) {
			postForm();
			navigate("/");
		}
	};

	return (
		<div>
			<br />
			<h2>List Your Items</h2>
			<br />
			<br />

			<div className="container">
				<div className="row">
					<div className="col-sm-4 mx-auto">
						<ProductNameForm
							name={name}
							setName={setName}
							inputError={inputError}
							setInputError={setInputError}
							InputName="nameError"
						/>

						<br />
						<PriceForm
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
							price={firstBid}
							setPrice={setFirstBid}
							inputError={inputError}
							setInputError={setInputError}
							InputName="firstbidError"
							currently={currently}
							label="First Bid Offer"
						/>

						<br />
						<br />
						<DateForm
							starts={starts}
							setStarts={setStarts}
							ends={ends}
							setEnds={setEnds}
							isDisabled={isDisabled}
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
							description={description}
							setDescription={setDescription}
							inputError={inputError}
							setInputError={setInputError}
							InputName="descriptionError"
						/>

						<br />
						<CategoriesSelect
							chosenCategory={chosenCategory}
							setChosenCategory={setChosenCategory}
							inputError={inputError}
							setInputError={setInputError}
							InputName="chosenCategoryError"
						/>

						<br />

						<br />
						<ImagesUpload
							images={images}
							setImages={setImages}
							inputError={inputError}
							setInputError={setInputError}
							InputName="imagesError"
						/>

						<br />

						<LocationForm
							location={location}
							setLocation={setLocation}
							inputError={inputError}
							setInputError={setInputError}
							InputName="locationError"
							label="Location"
						/>
						<br />

						<LocationForm
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
			</div>

			<ChooseInMap
				setLongtitude={setLongtitude}
				setLatitude={setLatitude}
				coordinates={coordinates}
				setCoordinates={setCoordinates}
				latitude={latitude}
				longitude={longitude}
			/>

			<br />
			<Button onClick={submit}>Create Auction</Button>

			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
		</div>
	);
};

export default CreateAuction;
