import React, { Component } from 'react';
import breweries from '../data/breweries';
import Menu from './Menu';

import {GoogleApiWrapper} from 'google-maps-react';	
let apiKey = 'AIzaSyBrPSAnaWrGd2kJJzN6d29ETwL03-B7iCI';

class SearchContainer extends Component{
	constructor(props){
		super(props);
		this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		this.searchPostal = this.searchPostal.bind(this);

		this.state = {
			error: false,
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
				for(let i=0; i < breweries.length; i++){
					if(breweries[i].open.includes(day)){
						options.destinations.push(breweries[i].address+', '+breweries[i].zipcode+', '+breweries[i].city);
						distance.push(breweries[i]);
					}
				}
				Service.getDistanceMatrix(options, (res, status) => {
					if(status === 'OK'){
						let sts = true;
						let results = res.rows[0].elements;
						for(let i=0; i < results.length; i++){
							if(results[i].status === "OK"){
								distance[i].distance = results[i].distance;
								distance[i].duration = results[i].duration;
							} else {
								sts = false;
							}
						}
						if(sts){
							this.setState({
								error: false,
								locales: distance.sort((a,b) => a.distance.value - b.distance.value)
							});
						} else {
							this.setState({
								error: "Postcode doesn't exist",
								locales: []
							});
						}
						
					} else {
						console.log(status);
					}
				});
			} else {
				this.setState({
					error: "Invalid Postcode Format",
					locales: []
				});
			}
		}
	}

	render(){
		const imgURL = "https://source.unsplash.com/300x300/?beer&v=";
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
export default GoogleApiWrapper({
	apiKey: apiKey
})(SearchContainer);