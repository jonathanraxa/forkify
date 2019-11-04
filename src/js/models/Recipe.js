/**
 * Essentially takes the data and defines in a specific way
 */

import axios from 'axios';
// import {key, proxy} from '../config';

export default class Recipe {
    
    constructor(id){
        this.id = id; 
    }

    async getRecipe(){
        try {
            // const res = await axios(`${PROXY}http://food2fork.com/api/get?key=${KEY}&rId=${this.id}`);
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`); 

            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher; 
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            
        
        } catch (error) {
            console.log(error); 
        }
    }

    /**
     * time it takes to cook something
     * every 3 ingredients is an extra 15mins
     */
    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    
    calcServings(){this.servings = 4; }

    parseIngredients(){

        // replacing the longer version with the shorter version
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon'];
        const unitsShort = ['tbsp', 'tbsp','oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        
        
        const newIngredients = this.ingredients.map(el => {
            
            // 1) Uniform units
            let ingredient = el.toLowerCase(); 

            // loop over each of these unit possibilities and use the shorter version
            unitsLong.forEach((unit, i) => {
                // unit ==> current element
                // i ==> current index

                ingredient = ingredient.replace(unit, unitsShort[i]);
            })

            // 2) Remove parentheses
            // use regular expressions to remove specific pattern combination
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            // need to return something because that's how the map method works
            const arrIng = ingredient.split(' ');
            
            // why not indexOf? finds the position of the unit when we don't know the 
            // index we're looking for
            const unitIndex = arrIng.findIndex( el2 => units.includes(el2) );

            let objIng; 

            if (unitIndex > -1){
                
                // there is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex); 

                let count; 
                
                if (arrCount.length === 1){
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count, 
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ') 
                }

            } else if (parseInt(arrIng[0], 10)) {
                
                // there is NO unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10), 
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if ( unitIndex === -1){
                
                // there is NO unit and NO number in 1st position
                objIng = {
                    count: 1, 
                    unit: '', 
                    ingredient
                }

            }

            return objIng;
        });

        this.ingredients = newIngredients;
    }

    updateServings (type){
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1; 

        // Ingredients
        this.ingredients.forEach(ing => {

            // new servings divided by the old servings
            ing.count *= (newServings / this.servings); 
        });

        // return this value here
        this.servings = newServings;
    }

} 