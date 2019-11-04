// we're going to save LIKES

export default class Likes {
    constructor() {
        this.likes = [];
    }
    addLike(id, title, author, img){
        const like = { id, title, author, img }; 
        this.likes.push(like); 
     
        // Persist data in localStorage
        this.persistData();
        
        return like; 
    }
    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id); 
        this.likes.splice(index, 1); 

        // Persist data in localStorage
        // method on THIS object
        this.persistData();
    }
    isLiked(id){
        return this.likes.findIndex( el => el.id === id) !== -1;
    }
    getNumLikes(){
        return this.likes.length;
    }

    persistData() {
        // STRINGS only
        localStorage.setItem('likes', JSON.stringify(this.likes)); 
    }

    readStorage() {
        // will return a string and must convert it back to an array
        const storage = JSON.parse(localStorage.getItem('likes')); 

        // Restoring likes from the localStorage
        if (storage) this.likes = storage; 

    }

}