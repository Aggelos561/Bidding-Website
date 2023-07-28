import React, { useEffect, useState } from "react";

const BidAmount = ({
	bidValue,
	setBidValue,
	valueError,
	setValueError,
	firstbid,
	numberofbids,
}) => {
	const [bidValueErr, setBidValueErr] = useState({});

	useEffect(() => {
		const formValidation = () => {
			let errorFound = false;
			let bidValueErr = {};
			if (Number(bidValue) < Number(firstbid) && Number(numberofbids) === 0) {
				bidValueErr.invalid = "Bid Value Must Be Greater Or Equal To First Bid";
				setValueError(true);
				errorFound = true;
			}
			if (Number(bidValue) <= 0 || Number(bidValue) >= 10000) {
				bidValueErr.invalid = "Invalid Bid Amount";
				setValueError(true);
				errorFound = true;
			}
			if (Number(bidValue).toString().split(".")[1]?.length > 2) {
				bidValueErr.decimalInvalidity = "Cannot Contain More Than 2 Decimal Points";
				setValueError(true);
				errorFound = true;
			}

			if (!errorFound) setValueError(false);

			setBidValueErr(bidValueErr);
		};

		formValidation();
	}, [bidValue]);

	const handleChange = (e) => {
		setBidValue(e.target.value);
	};

	return (
		<div align="center">
			<input
				className="form-control"
				style={{ width: "40%" }}
				placeholder="Bid Amount"
				type="number"
				step=".01"
				onChange={(e) => handleChange(e)}
				value={bidValue}
			/>
			{Object.keys(bidValueErr).map((key) => {
				return (
					<div key={key} style={{ color: "red" }}>
						<h6>{bidValueErr[key]}</h6>
					</div>
				);
			})}
		</div>
	);
};

export default BidAmount;
