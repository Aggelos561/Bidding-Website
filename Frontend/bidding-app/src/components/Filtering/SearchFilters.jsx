import React from "react";
import FilteredCategories from "../Filtering/FilteredCategories";
import FilterAuctionsName from "../Filtering/FilterAuctionsName";
import FilteredLocation from "../Filtering/FilteredLocation";
import FilterMinMaxPrice from "../Filtering/FilterMinMaxPrice";

const SearchFilters = () => {
	return (
		<div>
			<h5>Filters:</h5>
			<div className="container">
				<div className="row">
					<div className="col-4 mx-auto">
						<FilterAuctionsName />
						<br />

						<FilteredLocation />
						<br />

						<FilterMinMaxPrice
							minPrice="buyprice_min"
							maxPrice="buyprice_max"
							label="Buy Price"
						/>

						<br />
						<FilterMinMaxPrice
							minPrice="currently_min"
							maxPrice="currently_max"
							label="Current Price"
						/>

						<br />

						<FilteredCategories placeholder="Filter By Categories" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchFilters;
