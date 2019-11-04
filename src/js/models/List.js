import uniquid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        // create a new item object
        const item = {
            id: uniquid(),
            count,
            unit,
            ingredient,
        }
        
        // push it to the item array
        this.items.push(item); 
        return item;
    }
    /**
     * 
     * @param {*} id
     * pass in the ID and delete it
     * splice : pass in start index 
     * and how many positions you want to remove
     * --> mutates the original one
     */
    deleteItem (id) {
        const index = this.items.findIndex( el =>  el.id === id );
        /** 
         * splice - start at position 1, and take only 1 element
         * --> [2,4,8] splice (1,1) --> returns [4], original array is [2,8]
         * --> [2,4,8] splice (1,2) --> returns [4,8], original array is [2]
         * --> [2,4,8] slice (1,2) --> returns 4, original array is [2,4,8]
        */

        // start where we want in the index and remove one element
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        // returns the element (find)
        this.items.find( el => el.id === id).count = newCount;
    }

}