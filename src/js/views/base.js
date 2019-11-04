

// determine what we need from our DOM
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader'
};

// parent -> is the class parent where the loader is the child
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    // places the loader right after the parent
    parent.insertAdjacentHTML('afterbegin', loader); 
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    
    // need to go up to the parent and then remove the child
    if (loader) loader.parentElement.removeChild(loader);
}
