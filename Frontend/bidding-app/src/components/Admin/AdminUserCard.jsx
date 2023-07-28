import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

const AdminUserCard = (props) => {
	const navigate = useNavigate();

	const navToUser = (e) => {
		e.preventDefault();
		navigate(`/admin/user/${props.user.user_id.username}`);
	};

	return (
		<div>
			<Nav>
				<a
					href={`/admin/user/${props.user.user_id.username}`}
					onClick={(e) => navToUser(e)}
					className="list-group-item list-group-item-action"
				>
					{props.user.user_id.username}
				</a>
			</Nav>
		</div>
	);
};

export default AdminUserCard;
