import React, { Component } from 'react';
// Load in the breweries locally. Has to be local since API URLs provided in the assignment don't have CORS settings implemented
import breweries from '../data/breweries';
// Import all Google Maps API services
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';	
import Geocode from 'react-geocode';
// Set the apiKey globally. Has to be global for the export initialization, and for use within the class without duplicating.
let apiKey = 'AIzaSyBrPSAnaWrGd2kJJzN6d29ETwL03-B7iCI';

class MapContainer extends Component {
	/**
	 * Constructor of class Map
	 */
	constructor(props){
		// initialize parent
		super(props);
		// Initialize the Geocoder service
		Geocode.setApiKey(apiKey);
		// Initialise the state
		this.state = {
			error: null,
			markers: []
		}
		
		/**
		 * Initialize marker call from the API. loop through all addressses convert them to Geocoded locations, and prepare the lat longs in an array
		 */
		// Initialize marker array where promises will be stored
		this.marker = [];
		// Loop through each brewery
		for(let i = 0; i < breweries.length; i++){
			// Reformat address to conform to the Geocode API standards
			let address = breweries[i].address.replace(" ","+") + ',+'+breweries[i].zipcode.replace(" ","+")+',+'+breweries[i].city.replace(" ","+");
			// Fetch the Geocoded lat longs from the above address
			this.marker[i] = Geocode.fromAddress(address)
				// On success, return the lat and long values
				.then(response => {
					const {lat, lng} = response.results[0].geometry.location;
					return {lat: lat, lng: lng};
				})
				// On error, set the state to err.
				.catch(err => {
					this.setState({error: err});
				});
		}
	}

	/**
	 * Constant that holds the map information
	 */
	componentDidMount(){
		// Once the map has been added to the client, resolve the marker data
		Promise.all(this.marker)
			// Loop through each marker and set the markerList as the marker promise results
			.then(markerList => {
				// Toggle state change to initialize rendering with marker data
				this.setState({
					markers: markerList
				})
			}) 	
	}

	/**
	 * Function to render the Map view
	 * Markers initialized in constructor as empty to prevent crashes. Markers don't render until data is returned.
	*/
	render(){
		return (
			<Map
				google = {this.props.google}
				zoom = {10}
				gestureHandling = 'cooperative'
				initialCenter = {{lat: 52.3585101, lng: 4.9014738}}
				className = 'map'
			>
				{this.state.markers.map((m, index) => (
						<Marker position = {m} key = {index} />
					))
				}

			</Map>
		)
	}
}
// Export the google maps API with the key
export default GoogleApiWrapper({
	apiKey: apiKey
})(MapContainer);