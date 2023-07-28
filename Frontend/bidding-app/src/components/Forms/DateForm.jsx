import React, { useRef, useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";

const DateForm = (props) => {
	const [startsErr, setStartsErr] = useState({});
	const [endsErr, setEndsErr] = useState({});

	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else {
			formValidation();
		}
	}, [props.starts, props.ends]);

	const Input1Error = (value) => {
		props.setInputError((prevState) => ({
			...prevState,
			[props.InputName1]: value,
		}));
	};

	const Input2Error = (value) => {
		props.setInputError((prevState) => ({
			...prevState,
			[props.InputName2]: value,
		}));
	};

	const formValidation = () => {
		let startsErr = {};
		let endsErr = {};

		let inputValid = true;

		if (props.starts instanceof Date) {
			let currentDateTime = new Date();

			if (!props.checked) {
				if (props.starts < currentDateTime) {
					startsErr.notValid = "Must be greater than the Current Date";
					inputValid = false;
					Input1Error(true);
				} else if (
					currentDateTime.getFullYear() === props.starts.getFullYear() &&
					currentDateTime.getMonth() === props.starts.getMonth() &&
					props.starts.getDate() === currentDateTime.getDate() &&
					props.starts.getHours() === currentDateTime.getHours() &&
					props.starts.getMinutes() - currentDateTime.getMinutes() < 2
				) {
					startsErr.notValid =
						"Must be scheduled for expiration of at least 2 minutes ahead of current date";
					inputValid = false;
					Input1Error(true);
				}
			} else {
				if (
					currentDateTime.getFullYear() === props.starts.getFullYear() &&
					currentDateTime.getMonth() === props.starts.getMonth() &&
					props.starts.getDate() === currentDateTime.getDate() &&
					props.starts.getHours() === currentDateTime.getHours() &&
					props.starts.getMinutes() < currentDateTime.getMinutes()
				) {
					startsErr.notValid = "Must be greater than the Current Date";
					inputValid = false;
					Input1Error(true);
				}
			}

			currentDateTime = props.isDisabled ? new Date() : props.starts;

			if (currentDateTime.getTime() > props.ends.getTime()) {
				endsErr.notValid = "Must be greater than the Submition Date";
				inputValid = false;
				Input2Error(true);
			} else if (
				currentDateTime.getFullYear() === props.ends.getFullYear() &&
				currentDateTime.getMonth() === props.ends.getMonth() &&
				props.ends.getDate() === currentDateTime.getDate() &&
				props.ends.getHours() === currentDateTime.getHours() &&
				props.ends.getMinutes() - currentDateTime.getMinutes() < 2
			) {
				endsErr.notValid =
					"Must be scheduled for expiration of at least 2 minutes ahead of submition";
				inputValid = false;
				Input2Error(true);
			}
		} else {
			startsErr.notValid = "Cannot Be Blank";
			inputValid = false;
			Input2Error(true);
		}

		if (inputValid) {
			Input1Error(false);
			Input2Error(false);
		}

		setStartsErr(startsErr);
		setEndsErr(endsErr);
	};

	return (
		<div>
			<label>
				<h5>Submition Date: </h5>
			</label>
			<DateTimePicker
				className="form-control"
				disabled={props.isDisabled}
				name="starts"
				format="dd-MM-yyyy h:mm a"
				onChange={props.setStarts}
				value={props.starts}
			/>

			{Object.keys(startsErr).map((key) => {
				return (
					<div key={props.starts} style={{ color: "red" }}>
						<h6>{startsErr[key]}</h6>
					</div>
				);
			})}

			<label>
				<input
					className="form-check-input"
					type="checkbox"
					checked={props.checked}
					onChange={(e) => {
						props.setIsDisabled(!props.isDisabled);
						props.setChecked(!props.checked);
						props.setStarts(
							props.starts instanceof Date && props.checked ? "" : new Date()
						);
						props.setActive(!props.checked);
					}}
				/>
				<h6>Current Date</h6>
			</label>

			<br />
			<br />
			<label>
				<h5>Expiration Date: </h5>
			</label>
			<DateTimePicker
				className="form-control"
				name="ends"
				format="dd-MM-yyyy h:mm a"
				onChange={props.setEnds}
				value={props.ends}
			/>

			{Object.keys(endsErr).map((key) => {
				return (
					<div key={props.ends} style={{ color: "red" }}>
						<h6>{endsErr[key]}</h6>
					</div>
				);
			})}
		</div>
	);
};

export default DateForm;
