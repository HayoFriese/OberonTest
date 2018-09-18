# Oberon Test by Hayo Friese

This project was rendered with the help of the create-react-app CLI.

## Execution

**Should you have an API Key available, make sure to switch these at the top of Search.js and Menu.js. Not sure what the effects of using my key will result in**

Should you have npm installed, you can execute the following codes:

1.
`npm start`

Runs the service on http://localhost:3000 in development mode.

2.
`npm test`

Runs unit Tests. Currently, none available. Might be updated later depending on time available and familiarity with react cli test language.
Would, however, run the unit tests to validate against PostCode format and PostCode availability by testing the searchPostal function in Search.js;

3.
`npm run build`

Builds the app for production.

To search for nearby breweries, type in a valid DUTCH postal code and press enter. This will trigger the Google Maps API to render a list of open breweries in order of distance between post code central location and the brewery, closest first. Images are not the valid images of the breweries.

## Setup

I used the React CLI to generate a quick project template to save time. Isn't a necessity, but I was hoping to be able to test the core function searchPostal.

### Structure
I branched my code in 3 view components:
#### 1. Map View 
-> The map where you can see the location of the breweries on the map. Done initially for review purposes. Nice to have feature is viewing the brewery information.
#### 2. Search View
-> The search box is where the magic happens. Enter a post code with a maxlength of 8 characters, and press enter. Then a list will render below it which shows a list of the breweries.
#### 3. Menu view
-> This was originally to be shown on click, but for time's sake was embedded below the description. Shows a list of beers available for the brewery. 

The map component is rendered immediately, with the markers being the first state-based change.
After the map and search boxes exist, a search for a post code will re-render the search component to show the results or an error message.
The images are random from the unsplash API.
After the search list is rendered, the beer list is rendered in the menu component based on the name of the brewery. If there was no beer available, a message is shown to accomodate that.

### Data

It took me a while to figure out why I couldn't use a fetch promise to get the beer data. However, it eventually became apparent that it was a loose JS file, not an API that returned JSON, which was why no CORS headers were enabled. Hence, I stored each js file from the assignment in a separate /data directory as a component in itself, exporting it to make it available to import and use within the components. Would use the fetch promises pattern if it came from an API URL.

## Next Steps

If I wanted to spend more time on it, I'd do the following:

### Popup Beer list

To save space, I'd render the Menu component onClick on the **See Menu** link. This would be a popout card with a list of beers that would scroll along with the list block. In mobile view it would render the exact same way as it is now.

### Unit Test

I would love to keep track of my searchPostal function and create a test case for it. Although I'm aware how to do it with Mocca + Chai, I'm not familiar with the language the React CLI uses.

### InfoWindows

The Google API Key enabled me to use services within the Google Maps API. Having the ability to click/press on a pin and view information about the brewery (AND IF ITS OPEN OR NOT) would be cool to have. However, I merely used the Google Map as a tool to verify whether the distance ordering made sense.

### Route Showing

It would be incredibly useful for this tool to show the route to the brewery on click on the brewery name.

### Design enhancements

I made some designs, but I wasn't fully satisfied with a few elements, so I haven't really gotten around to beautifying it. The tool is functional and in a BETA stage in that sense at this point :).

### Heroku hosting with Express

I kept it on the React Level, but I'd love to hide the API services in an Express environment and attach the documents to routes. That way I could more closely mimic the backend structure of it, and also use the distance matrix service as a back-end protocol, which Google seems to prefer. Additionally, once I'd have NodeJS & Express set up, I'd host the app on Heroku for a live environment model, to see how it would be looking were I to deploy it. Nice to have really...

## External Sources Used

I made use of the following packages and API:
- [React Google Maps](https://www.npmjs.com/package/google-maps-react)
- [Google Maps Geocoding API](https://www.npmjs.com/package/react-geocode)
- [Dutch Code Regexp by Steven Moseley](http://jsfiddle.net/hgU3u/)
- [React CLI](https://github.com/facebook/create-react-app)
- Google Maps Documentation
- [Unsplash API](https://source.unsplash.com/)

I made an extensive attempt at my regexp, and I was essentially there. Space handling and the banning of certain test cases was the only difference between Steven's and mine. Additionally, after some research it made sense to me why SS, SD, and SA were not used. [Read More Here](https://en.wikipedia.org/wiki/Postal_codes_in_the_Netherlands).


## Feedback

I really would like to get some feedback on my code! Whether you want to continue with me or not, I'd love to hear about what I could do better in the future. React is still new to me, but I'm feeling like I'm getting the hang of the lifecycles and state management.