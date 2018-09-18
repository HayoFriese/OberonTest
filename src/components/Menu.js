import React, { Component } from 'react';
// Import beer local JSON data
import beers from '../data/beers';

class Menu extends Component{
	/**
	 * Constructor of class Menu
	 */
	constructor(props){
		super(props);
		// Initialize the function to retrieve Beers within the state.
		this.state = {
			// Pass as parameter the name property granted from Search component. Brewer name
			beerList: this.findBeer(props.name)
		};
	}
	/**
	 * Function to make an array of beers from the brewery
	 * @param b 				Name of brewery
	 */
	findBeer(b){
		// Set empty array for submission
		let beerList = [];
		// Loop through Beer JSON data
		for(let i = 0; i < beers.length; i++){
			// If the names match up, push data to the beerlist Array.
			if(beers[i].brewery === b){
				beerList.push(beers[i])
			}
		}
		// Return the array if there are beers. Else, return false
		return beerList.length > 0 ? beerList : false;
	}

	/**
	 * Function to render the Beer List view
	 */
	render(){
		// Return all beers  + details for the brewery if there are beers available. If not, return empty message
		return (
			<div className="menu-container">
				{this.state.beerList &&
					<ul>
						{this.state.beerList.map((b, i) => (
							<li key={i}>
								<h3>{b.name}</h3>
								<p>{b.volume} litres, {b.alcohol}%</p>
								<p>{b.style} - {b.keg}</p>
							</li>
						))}
					</ul>
				}
				{!this.state.beerList && 
					<h4>No information available</h4>
				}
			</div>
		)
	}
}

export default Menu;
