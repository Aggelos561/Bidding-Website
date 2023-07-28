import React from "react";
import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalPages, paginate }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const pageNumbers = [];
	let currentPage = Number(searchParams.get("page"));

	if (totalPages < 13) {
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
	} else if (currentPage - 6 <= 1) {
		for (let i = 1; i <= 13; i++) {
			pageNumbers.push(i);
		}
	} else if (currentPage + 6 > totalPages) {
		for (let i = totalPages - 12; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
	} else if (currentPage <= totalPages) {
		for (let i = currentPage - 6; i <= currentPage + 6; i++) {
			pageNumbers.push(i);
		}
	}

	return (
		<div className="d-flex justify-content-center">
			<nav>
				<ul className="pagination">
					{pageNumbers.map((number) => (
						<li
							key={number}
							className={currentPage === number ? "page-item active" : "page-item"}
						>
							<a
								onClick={(e) => {
									paginate(number);
									e.preventDefault();
								}}
								href="!#"
								className="page-link "
							>
								{number}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default Pagination;
