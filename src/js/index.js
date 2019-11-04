// GLOBAL APP CONTROLLER

/**  
 
    * --- importing a DEFAULT import file ---
     
    * import stirng from './models/Search'; 
    * console.log(stirng); 

    --- importing NAMED exports ---

    * import { add, multiply, id } from './views/searchView';
    * console.log(add(1,2)); 
    * console.log(multiply(3, 4));
    * console.log(id); 

    --- cusomizing names of imports ---

    * import { add as a, multiply as b, id as d} from './views/searchView';

    --- import EVERYTHING ---

    * import * searchView from './views/searchView';
    * console.log(searchView.add(2,3), searchView.multiply(2,3), searchView.id);
    
**/

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** 
 
Global state of the ap
 * Search object
 * current recipe object
 * Shopping list object
 * Liked recipes
  
**/

// handles all the current STATE of the application
// 'PIZZA' | BACON | BROCCOLI

const state = {};
window.state = state;
/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
    
    // 1) Get query from the view
    const query = searchView.getInput();

    if (query) {

        // 2) New search object and add to state
        state.search = new Search(query); // store the query into our state obj

        // 3) Prepare the UI for what will happen - for results
        
        // we need to clear the results from the previous search
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try{
        
            // 4) Search for recipes
            // running this asynchronously so we need the 'await' keyword
            await state.search.getResults();

            // 5) Render results on UI
            // console.log(state.search.result);
            searchView.renderResults(state.search.result);
            clearLoader(); 
        
        } catch (err) {
            alert('Something went wrong with search');
            clearLoader();
        }
    }
} // end controlSearch


// handles the submit value
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // keeps the page from re-submitting
    controlSearch(); 
});


// handles the pagination
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10); // returns something like...'2'
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        
    }
});

// const search = new Search('pizza');
// search.getResults();

// ------ END SEARCH CONTROLLER ------






















/**
 * RECIPE CONTROLLER
 */

//  const r = new Recipe(46956); 
//  r.getRecipe(); 
//  console.log(r); 
const controlRecipe = async () => {
    // Get ID from URL
    // replace the hash symbol and get the ID only
    const id = window.location.hash.replace('#', '');
    // console.log(id); 

    // checks if there's an idea in the URL
    if(id){

        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if(state.search) searchView.highlightSelected(id); 

        // Create new recipe object
        state.recipe = new Recipe(id);
      
      try {
            // Get recipe data
            await state.recipe.getRecipe(); // returns a promise (so that's why we use await)
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            // console.log(state.recipe); 
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (err) {
            console.log(err); 
            alert('Error processing recipe');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe); // when the page changes
// window.addEventListener('load', controlRecipe); // if the page loads

// simplified of the top two methods
['hashchange', 'load'].forEach(event => window.addEventListener(event , controlRecipe));



















/**
 * ----- LIST CONTROLLER -----
 */
const controlList = () =>{
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredients to the list
    // el is an element of the ingredients
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient); 
        listView.renderItem(item); 
    })
}

// Handle delete and update list item devents
elements.shopping.addEventListener('click', e => {
    // goes to the closest shopping item and read the data from that
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // Handle the delete button 
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        
        // Delete from state
        state.list.deleteItem(id); 

        // Delete from UI
        listView.deleteItem(id);
    
        // Handle the Count update
    } else if (e.target.matches('.shopping__count-value')){
        // Read the date from interface, then update it in HTML
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val); 
    }
});














/**
 * ----- LIKE CONTROLLER -----
 */

 // TESTING
//  state.likes = new Likes(); 

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

        // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}; 


// Restore liked recipes on page load
window.addEventListener('load', () => {
    
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage(); 

    // Toggle like menu button 
    likesView.toggleLikeMenu(state.likes.getNumLikes()); 

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like)); 

})





// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    // cannot use 'closest' because there's more than one thing to select, potentially
    // * --> any child
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // Add ingredients to shopping list
        controlList(); 
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        // Like controller 
        controlLike(); 
    }
    
});

window.l = new List();

// ------ END RECIPE CONTROLLER ------
// elements.recipe.addEventListener('click', e => {
//     if (e.target.matches('.btn-decrease, .btn-decrease *')) {
//         // Decrease button is clicked
//         if (state.recipe.servings > 1) {
//             state.recipe.updateServings('dec');
//             recipeView.updateServingsIngredients(state.recipe);
//         }
//     } else if (e.target.matches('.btn-increase, .btn-increase *')) {
//         // Increase button is clicked
//         state.recipe.updateServings('inc');
//         recipeView.updateServingsIngredients(state.recipe);
//     } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
//         // Add ingredients to shopping list
//         controlList();
//     } else if (e.target.matches('.recipe__love, .recipe__love *')) {
//         // Like controller
//         controlLike();
//     }
// });
