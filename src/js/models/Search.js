// using ES6 classes to describe the data model
import axios from 'axios';

export default class Search {
    constructor(query){
        // creates an object attribute from the 'query' 
        this.query = query;
    }
    async getResults() {
        // this was the old way since the API doesn't work
        // const proxy = 'https://cors-anywhere.herokuapp.com/';
        // const res = await axios(`${PROXY}http://food2fork.com/api/search?key=${KEY}&q=${this.query}`);
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
        } catch(error) {
            console.log(`Something went wrong: ${error}`);
        }
    }
} 

