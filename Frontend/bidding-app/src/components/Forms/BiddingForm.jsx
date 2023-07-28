import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../../context/AuthProvider";
import { getCurrentDate, to2Decimal } from "../../Helper/helper";
import BidAmount from "./BidAmount";
import ModalPopUp from "../PopUp/ModalPopUp";
import Button from "react-bootstrap/Button";

const BiddingForm = (props) => {
	const [bidValue, setBidValue] = useState(props.item.firstbid);
	const { auth } = useContext(AuthProvider);
	const [valueError, setValueError] = useState(false);
	const navigate = useNavigate();
	const [confirmBid, setConfirmBid] = useState(false);
	const [show, setShow] = useState(false);

	const navigateToLogin = () => {
		navigate("/login");
	};

	useEffect(() => {
		if (confirmBid) {
			submit();
			setConfirmBid(false);
		}
	}, [confirmBid]);

	const submit = async () => {
		if (!valueError) {
			let response = await fetch(`https://localhost:8000/item-checker/${props.item.id}/`, {
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
							message: "This Auction Is No longer Available",
							access: true,
						},
					});
					return;
				}
			}

			let json_structure = {
				name: props.item.name,
				location: props.item.location,
				country: props.item.country,
				latitude: props.item.latitude,
				longitude: props.item.longitude,
				currently: to2Decimal(Number(bidValue)),
				buyprice: props.item.buyprice,
				firstbid: props.item.firstbid,
				started: props.item.started,
				ends: props.item.ends,
				description: props.item.description,
				seller_user: props.item.seller_user,
				category: props.item.category,
			};

			response = await fetch(`https://localhost:8000/item-bid/${props.item.id}/`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(auth.access),
				},
				body: JSON.stringify(json_structure),
			});

			data = await response.json();

			if (!response.ok) {
				throw new Error("Bidding Post Error");
			} else {
				let bidder_user = auth.profile_id;
				let time = getCurrentDate();
				let amount = parseFloat(bidValue);
				let item = props.item.id;

				response = await fetch(`https://localhost:8000/list-bids/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + String(auth.access),
					},
					body: JSON.stringify({ time, amount, item, bidder_user }),
				});

				data = await response.json();

				props.getItemData();
			}
		}
	};

	return (
		<div>
			<BidAmount
				bidValue={bidValue}
				setBidValue={setBidValue}
				valueError={valueError}
				setValueError={setValueError}
				firstbid={props.item.firstbid}
				numberofbids={props.item.numberofbids}
			/>

			<Button
				disabled={props.isDisabled}
				onClick={() => {
					auth.profile_id === undefined ? navigateToLogin() : setShow(true);
				}}
			>
				Bid
			</Button>

			{show && <ModalPopUp setConfirmBid={setConfirmBid} show={show} setShow={setShow} />}
		</div>
	);
};

export default BiddingForm;
