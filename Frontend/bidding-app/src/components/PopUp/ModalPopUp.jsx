import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalPopUp = (props) => {
	return (
		<div>
			<Modal
				show={props.show}
				backdrop="static"
				onHide={() => props.setShow(false)}
				keyboard={false}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Confirmation</Modal.Title>
				</Modal.Header>

				<Modal.Body>Are you sure you would like to submit for this auction?</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={() => props.setShow(false)}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={() => {
							props.setConfirmBid(true);
							props.setShow(false);
						}}
					>
						Yes
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default ModalPopUp;
