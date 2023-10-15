// Utility functions used in components

export const getTimeFormat = (date) => {
	let day = String(date.getDate()).padStart(2, "0");
	let month = String(date.getMonth() + 1).padStart(2, "0");
	let year = date.getFullYear();
	let hour = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

	return year + "-" + month + "-" + day + "T" + hour + ":" + minutes + ":" + seconds + "Z";
};

export const onlyLetters = (characters) => {
	return String(characters)
		.toLowerCase()
		.match(/^[a-zA-Z\s]*$/);
};

export const lettersNumbers = (characters) => {
	return String(characters)
		.toLowerCase()
		.match(/^[a-zA-Z\1-9.,\s]*$/);
};

export const isNumeric = (characters) => {
	const numericRegex = /^[0-9]+$/;
	return numericRegex.test(characters);
};

export const validNameFormat = (characters) => {
	return String(characters)
		.toLowerCase()
		.match(/^[a-zA-Z\α-ωΑ-Ω\ά-ώΆ-Ώ\s]*$/);
};

export const validUsernameFormat = (characters) => {
	return String(characters)
		.toLowerCase()
		.match(/^[a-zA-Z1-9\_]*$/);
};

export const validEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

export const formatDate = (date) => {
	if (!(typeof date === "undefined")) {
		let year = date.split("-")[0];
		let month = date.split("-")[1];
		let day = date.split("-")[2].split("T")[0];

		let time = date.split("T")[1].split("Z")[0];

		return day + "/" + month + "/" + year + " at " + time;
	} else {
		return "";
	}
};

export const to2Decimal = (num) => {
	if (num > 0) return Math.floor(num * 100) / 100;
	else return Math.ceil(num * 100) / 100;
};

export const getCurrentDate = () => {
	let date = new Date();
	let day = String(date.getDate()).padStart(2, "0");
	let month = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
	let year = date.getFullYear();
	let hour = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

	return year + "-" + month + "-" + day + "T" + hour + ":" + minutes + ":" + seconds + "Z";
};

export const parseJwt = (token) => {
	try {
		return JSON.parse(atob(token.split(".")[1]));
	} catch (e) {
		return null;
	}
};
