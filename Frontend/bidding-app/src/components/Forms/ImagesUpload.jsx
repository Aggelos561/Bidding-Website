import React, { useRef, useEffect, useState } from "react";

const ImagesUpload = (props) => {
	const [imagesErr, setImgaesErr] = useState({});

	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else formValidation();
	}, [props.images]);

	const inputError = (value) => {
		props.setInputError((prevState) => ({
			...prevState,
			[props.InputName]: value,
		}));
	};

	const formValidation = () => {
		let imagesErr = {};

		let inputValid = true;

		if (props.images.length > 4) {
			imagesErr.tooManyImages = "Up To 4 Images Are Allowed";
			inputValid = false;
			inputError(true);
		}

		for (let i = 0; i < Number(props.images.length); i++) {
			if (!props.images[i].type.match("image.*")) {
				imagesErr.invalidImageFormat =
					"Invalid Image Format Detected. Only Image Files Are Allowed";
				inputValid = false;
				inputError(true);
			}
		}

		if (inputValid) {
			inputError(false);
		}

		setImgaesErr(imagesErr);
	};

	return (
		<div>
			<input
				className="form-control"
				type="file"
				disabled={props.isDisabled}
				onChange={(event) => {
					props.setImages(event.target.files);
				}}
				name="images"
				accept="image/*"
				multiple
			/>

			{Object.keys(imagesErr).map((key) => {
				return (
					<div key={props.images} style={{ color: "red" }}>
						<h6>{imagesErr[key]}</h6>
					</div>
				);
			})}
		</div>
	);
};

export default ImagesUpload;
