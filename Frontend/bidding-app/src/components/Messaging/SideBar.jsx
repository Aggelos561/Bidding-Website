import React, { useState } from "react";
import Compose from "./Compose";
import Inbox from "./Inbox";
import Send from "./Send";
import "./side_bar.css";

const SideBar = () => {
	const [inbox, setInbox] = useState(true);
	const [send, setSend] = useState(false);
	const [compose, setCompose] = useState(false);

	return (
		<div>
			<div className="sidebar">
				<a
					className={compose ? "active" : ""}
					role="button"
					onClick={() => {
						setInbox(false);
						setSend(false);
						setCompose(true);
					}}
				>
					Compose
				</a>
				<a
					className={inbox ? "active" : ""}
					role="button"
					onClick={() => {
						setSend(false);
						setCompose(false);
						setInbox(true);
					}}
				>
					Inbox
				</a>
				<a
					className={send ? "active" : ""}
					role="button"
					onClick={() => {
						setInbox(false);
						setCompose(false);
						setSend(true);
					}}
				>
					Sent
				</a>
			</div>

			<br />

			<div className="content">
				{compose && <Compose />}
				{inbox && <Inbox />}
				{send && <Send />}
			</div>
		</div>
	);
};

export default SideBar;
