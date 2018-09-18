import React, { Component } from 'react';
import breweries from '../data/breweries';
// Import all Google Maps Stuff
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';	
import Geocode from 'react-geocode';
// Set the apiKey.
let apiKey = 'AIzaSyBrPSAnaWrGd2kJJzN6d29ETwL03-B7iCI';

class MapContainer extends Component {
	/**
	 * Constructor o f class Map
	 */
	constructor(props){
		// initialize parent
		super(props);
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
		breweries.map((b, i) => {
			// Reformat address to conform to the Geocode API standards
			let address = b.address.replace(" ","+") + ',+'+b.zipcode.replace(" ","+")+',+'+b.city.replace(" ","+");
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
		});
	}

	/**
	 * Constant that holds the map information
	 */
	componentDidMount(){
		Promise.all(this.marker)
			.then(markerList => {
				this.setState({
					markers: markerList
				})
			}) 	
	}

	/**
	 * Function to render the Map view
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
export default GoogleApiWrapper({
	apiKey: apiKey
})(MapContainer);