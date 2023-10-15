import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { parseJwt } from "../helper/helpers.js";
import Loading from "../components/Loading/Loading";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});
	let [loading, setLoading] = useState(true);

	const checkIfTokenExpired = () => {
		const user = JSON.parse(localStorage.getItem("USER_INFORMATION"));
		if (user) {
			const decodedJwt = parseJwt(user.access);

			if (decodedJwt?.exp * 1000 < Date.now()) {
				setAuth({});
				localStorage.clear();
			}
		}
	};

	useEffect(() => {
		let updateToken = async () => {
			checkIfTokenExpired();

			let refresh_token = JSON.parse(localStorage.getItem("USER_INFORMATION"))?.refresh;

			if (refresh_token) {
				let response = await fetch("https://localhost:8000/login/refresh/", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						refresh: refresh_token,
					}),
				});

				let data = await response.json();

				if (response.status === 200) {
					let jwt_obj = jwt_decode(data.access);
					let tok_username = jwt_obj.username;
					let profile_id = jwt_obj.profile_id;
					let is_superuser = jwt_obj.is_superuser;
					let access = data.access;
					let refresh = data.refresh;

					setAuth({ access, refresh, tok_username, is_superuser, profile_id });
					localStorage.setItem(
						"USER_INFORMATION",
						JSON.stringify({
							access,
							refresh,
							tok_username,
							is_superuser,
							profile_id,
						})
					);
				}
			} else {
				setAuth({});
				localStorage.setItem("USER_INFORMATION", JSON.stringify({}));
			}
			if (loading) {
				setLoading(false);
			}
		};

		if (loading) {
			updateToken();
		}
		let fiveMinutes = 1000 * 60 * 5;

		let interval = setInterval(() => {
			let Authenticated = JSON.stringify(auth) !== "{}";
			if (Authenticated) {
				updateToken();
			}
		}, fiveMinutes);
		return () => clearInterval(interval);
	}, [auth, loading]);

	return (
		<AuthContext.Provider value={{ auth, setAuth, setLoading }}>
			{loading ? <Loading type="spinningBubbles" /> : children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
