import React from "react";

const Footer = () => {
	return (
		<div>
			<br />
			<br />
			<br />
			<br />
			<br />
			<div className="fixed-bottom bg-dark text-white">
				<div className="container fluid">
					<div className="footer-bottom">
						<p className="text-center">
							&copy;{new Date().getFullYear()} All Rights Reserved
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
