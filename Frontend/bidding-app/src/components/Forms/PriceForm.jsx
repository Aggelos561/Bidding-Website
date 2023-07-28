import React, { useRef, useEffect, useState } from "react";

const PriceForm = (props) => {
	const [priceErr, setPriceErr] = useState({});
	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else formValidation();
	}, [props.price, props?.firstbid, props?.currently]);

	const formValidation = () => {

		let priceErr = {};
	  
		let inputValid = true;
	  
		if (props.label === "Starting Price") {
		  if (props.price && Number(props.price) < Number(props.firstbid)) {
			priceErr.invalidValue = "Must be bigger or equal to First Bid";
			inputValid = false;
			props.setInputError((prevState) => ({
			  ...prevState,
			  [props.InputName]: true,
			}));
		  }
		  
		} else if (props.label === "Buy Price") {
		  if (props.price && Number(props.price) <= Number(props.currently)) {
			priceErr.invalidValue = "Must be bigger than Starting Price";
			inputValid = false;
			props.setInputError((prevState) => ({
			  ...prevState,
			  [props.InputName]: true,
			}));
		  }

		} else if (props.label === "First Bid Offer") {
		  if (
			(props.price && Number(props.price) > Number(props.currently)) ||
			(props.price && Number(props.price) >= Number(props.buyPrice))
		  ) {
			priceErr.invalidValue = "Must be smaller or equal to Starting Price and smaller than Buy Price";
			inputValid = false;
			props.setInputError((prevState) => ({
			  ...prevState,
			  [props.InputName]: true,
			}));
		  }
		}

		if (props.price && Number(props.price) > 10000) {
		  priceErr.invalidValue = `${props.label} cannot be more than 10000`;
		  inputValid = false;
		  props.setInputError((prevState) => ({
			...prevState,
			[props.InputName]: true,
		  }));
		}

		if (props.price && Number(props.price) <= 0) {
			priceErr.invalidValue = `Invalid price`;
			inputValid = false;
			props.setInputError((prevState) => ({
			  ...prevState,
			  [props.InputName]: true,
			}));
		  }
	  
		if (inputValid) {
		  props.setInputError((prevState) => ({
			...prevState,
			[props.InputName]: false,
		  }));
		}
	  
		setPriceErr(priceErr);
	  };
	  

	const handleChange = (e) => {
		props.setPrice(e.target.value);
	};

	return (
		<div>
			<input
				className="form-control"
				type="number"
				step=".01"
				disabled={props.isDisabled}
				name={props.label}
				onChange={(e) => handleChange(e)}
				value={props.price}
				placeholder={props.label}
			/>

			{Object.keys(priceErr).map((key) => {
				return (
					<div key={key} style={{ color: "red" }}>
						<h6>{priceErr[key]}</h6>
					</div>
				);
			})}
		</div>
	);
};

export default PriceForm;
