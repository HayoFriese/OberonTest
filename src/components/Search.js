import React, { Component } from 'react';
// Import local list of breweries
import breweries from '../data/breweries';
// Import menu component
import Menu from './Menu';

// Import Google Maps API services to access the DistanceMatrixService, and initialize
import {GoogleApiWrapper} from 'google-maps-react';	
let apiKey = 'AIzaSyBrPSAnaWrGd2kJJzN6d29ETwL03-B7iCI';

class SearchContainer extends Component{
	/**
	 * Constructor of class SearchContainer
	 */
	constructor(props){
		super(props);
		// array of days (as Date().getDay() returns a number) for reformatting
		this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		// Bind the searchPostal function to the class. This allows e.target to access dom properties for the instance
		this.searchPostal = this.searchPostal.bind(this);

		// Initialize the state
		// Error message for poor formatting, Locales where brewery information will be stored in order of closest
		this.state = {
			error: false,
			locales: []
		}
	}

	/**
	 * Function to search for breweries by Post Code
	 * @param e 			On Keydown Event element
	 */
	searchPostal(e) {
		// If you pressed enter
		if(e.keyCode === 13){
			// Regex for formatting dutch PostCode (sorry Belgians :/) 
			let postreg = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
			// If the postcode is in the correct format
			if(e.target.value.match(postreg)){
				// Initialize variables for the distance matrix service, including options, current day, and an empty array;
				let Service = new this.props.google.maps.DistanceMatrixService(),
					options = {
						origins: [e.target.value], 
						destinations: [],
						travelMode: 'DRIVING'
					},
					day = this.days[new Date().getDay()],
					distance = [];
				// Loop through all breweries
				for(let i=0; i < breweries.length; i++){
					// Compare their open day strings with today's day string. 
					if(breweries[i].open.includes(day)){
						// If open, will move the address in the destinations parameter of the distance options, formatted according to docs
						options.destinations.push(breweries[i].address+', '+breweries[i].zipcode+', '+breweries[i].city);
						distance.push(breweries[i]);
					}
				}
				// Run Distance Matrix Service, with options object as parameter.
				Service.getDistanceMatrix(options, (res, status) => {
					// If the service ran successfully
					if(status === 'OK'){
						// Mark status default as true, and shrink the result to a single word (save space)
						let sts = true,
							results = res.rows[0].elements;
						// loop through result object
						for(let i=0; i < results.length; i++){
							// If the destination was successfully found
							if(results[i].status === "OK"){
								// Add duration and distance to the distance result array. 
								distance[i].distance = results[i].distance;
								distance[i].duration = results[i].duration;
							} else {
								// If the address didn't exist or postcode didn't exist, return false status
								sts = false;
							}
						}
						// If the distances were processed successfully
						if(sts){
							// Set the state, error reinitialized to false incase of error, and locales being the distance array sorted by distance value
							this.setState({
								error: false,
								locales: distance.sort((a,b) => a.distance.value - b.distance.value)
							});
						// If not
						} else {
							// Die an error message, and empty the results
							this.setState({
								error: "Postcode doesn't exist",
								locales: []
							});
						}
						
					} else {
						// Die error message if the API service failed
						this.setState({
								error: "Oh gosh, something went wrong!",
								locales: []
							});
					}
				});
			} else {
				// Die error message for invalid postcode format
				this.setState({
					error: "Invalid Postcode Format",
					locales: []
				});
			}
		}
	}

	/**
	 * Function to render the Search bar viewport
	 */
	render(){
		// Initialize an image constant. Not necessary, but nice for easy access to change the origin if another API is desired
		const imgURL = "https://source.unsplash.com/300x300/?beer&v=";
		// Return side bar with the search box and results if set
			// If there was an error, show an error message above the input
			// SearchPostal will run on keyDown
			// If results are set, will create a box in a list format with information about the brewery.
				// For each brewery will also have a menu available.
		return (
			<section className="data-wrapper">
				<article className="search-box">
	            	<h1>Search a nearby brewery</h1>
	            	{this.state.error && 
						<p className="error">{this.state.error}</p>
	            	}
	        		<input type="text" placeholder="Enter postcode" onKeyDown={this.searchPostal} maxLength="8"/>
	        	</article>
	        	{this.state.locales.length > 0 &&
					<article className="result-box">
						{this.state.locales.map((obj, index) => (
							<div className="result-set" key={index}>
			            		<img alt={"beer van" + obj.name} src={imgURL + index} />
			            		<h1>{obj.name}</h1>
			            		<div className="address">
			            			<p>{obj.address}</p>
			                		<p>{obj.zipcode}, {obj.city}</p>
			              		</div>
			              		<div className="opening">
			                		<h2>Open On</h2>
			                		<ul>
										{obj.open.map((day, num) => (
											<li key={num}>{day}</li>
										))}
			                		</ul>
			              		</div>
			              		<p>See Menu</p>
				              	<Menu name={obj.name} />	
			            	</div>
						))}
		        	</article>
	        	}
        	</section>
		)
	}
}

// Export the google maps API service in addition to the class. Initialized via the apiKey set globally.
export default GoogleApiWrapper({
	apiKey: apiKey
})(SearchContainer);