import React, { Component } from 'react';
import breweries from '../data/breweries';
import beers from '../data/beers';

import {GoogleApiWrapper} from 'google-maps-react';	
let apiKey = 'AIzaSyBrPSAnaWrGd2kJJzN6d29ETwL03-B7iCI';

class SearchContainer extends Component{
	constructor(props){
		super(props);
		this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		this.searchPostal = this.searchPostal.bind(this);

		this.state = {
			error: null,
			locales: []
		}
	}

	searchPostal(e) {
		if(e.keyCode === 13){
			let postreg = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
			if(e.target.value.match(postreg)){
				let Service = new this.props.google.maps.DistanceMatrixService(),
					options = {
						origins: [e.target.value], 
						destinations: [],
						travelMode: 'DRIVING'
					},
					day = this.days[new Date().getDay()],
					distance = [];
				breweries.map((b, i) => {
					if(b.open.includes(day)){
						options.destinations.push(b.address+', '+b.zipcode+', '+b.city);
						distance.push(b);
					}
				});
				Service.getDistanceMatrix(options, (res, status) => {
					if(status === 'OK'){
						let results = res.rows[0].elements;
						for(let i=0; i < results.length; i++){
							if(results[i].status === "OK"){
								distance[i].distance = results[i].distance;
								distance[i].duration = results[i].duration;
							}
						}
						this.setState({
							locales: distance.sort((a,b) => a.distance.value - b.distance.value)
						});
					} else {
						console.log(status);
					}
				});
			}
		}
	}

	render(){
		return (
			<section className="data-wrapper">
				<article className="search-box">
	            	<h1>Search a nearby brewery</h1>
	        		<input type="text" placeholder="Enter postcode" onKeyDown={this.searchPostal} maxLength="8"/>
	        	</article>
	        	{this.state.locales.length > 0 &&
					<article className="result-box">
						{this.state.locales.map((obj, index) => (
							<div className="result-set" key={index}>
			            		<img src="https://source.unsplash.com/300x300/?beer,bar" />
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
			            	</div>
						))}
		        	</article>
	        	}
        	</section>
		)
	}
}
export default GoogleApiWrapper({
	apiKey: apiKey
})(SearchContainer);