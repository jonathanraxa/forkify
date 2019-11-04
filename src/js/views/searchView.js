// returning a function 
// export const add = (a, b) =>  a + b;
// export const multiply = (a, b) => a * b;
// export const id = 23; 

// return the input value of the field
// export const getInput = () => 
import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// clears our input field
export const clearInput = () => elements.searchInput.value = '';

// clears the list items
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};
// limit the length of the title
// 'Pasta with tomato and spinach'
/** 
 
 * acc = accumulator; cur = current
 
 * acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta', ]
 * acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
 * acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
 * acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
 * acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']

 */
export const limitRecipeTitle = (title, limit = 17) => {
    
    if(title.length > limit) {
        
        const newTitle = [];

        // has an accumulator already built in: 'reduce' method
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur)
            }
            return acc + cur.length;
        
        }, 0);
        
        return `${newTitle.join(' ')} ...`; // ie. 'Pasta with tomato ...'
    
    }

    return title;
}

// creates are data and renders a <li> item HTML
const renderRecipe = recipe => {
    const markup = 
        `<li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

/**
 * 
 * @param {Integer} page    Page number we're currently on 
 * @param {*}       type    Type of button we want  (prev, or next)
 */

const createButton = (page, type) => `

    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>

<!-- 
    <button class="btn-inline results__btn--prev">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-left"></use>
        </svg>
        <span>Page 1</span>
    </button>
    <button class="btn-inline results__btn--next">
        <span>Page 3</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
    </button> -->
`;

// render the buttons according to the page we're on
// we're DEFINING the buttons
const renderButtons = (page, numResults, resPerPage) => {
    
    /** 
     * what page we're on?
     * how many pages are there?
    */

    const pages = Math.ceil(numResults / resPerPage); // round to the highest number
    let button;

    if(page === 1 && pages > 1){

        // only button to go to next page
        button = createButton(page, 'next');

    } else if(page < pages){
        
        // both buttons
        button = `
            ${button = createButton(page, 'next')}
            ${button = createButton(page, 'prev')}
        `;
        
    } else if (page === pages && pages > 1) {

        // only button to go to prev page
        button = createButton(page, 'prev');

    }
    
    elements.searchResPages.insertAdjacentHTML('afterbegin', button); 


};

// calls the render method for each of the recipes in the list
// shows the results of the page
export const renderResults = (recipes, page = 2, resPerPage = 10) => {
    // renders the results of the current page
    /* 
        * depending on where you start in the recipes will determine how many
        recipes are shown in the pagination
        * ie. 
     */
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    
    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage); 
}; // end renderREsults