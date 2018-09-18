import React, { Component } from 'react';
import beers from '../data/beers';

class Menu extends Component{
	constructor(props){
		super(props);

		this.state = {
			beerList: this.findBeer(props.name)
		};
	}

	findBeer(b){
		let beerList = [];
		for(let i = 0; i < beers.length; i++){
			if(beers[i].brewery === b){
				beerList.push(beers[i])
			}
		}
		return beerList.length > 0 ? beerList : false;
	}

	render(){
		console.log(this.state.beerList);
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
			</div>
		)
	}
}

export default Menu;
