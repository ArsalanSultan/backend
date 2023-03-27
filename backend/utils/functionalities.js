class APIFeatures{
    constructor(query,queryStr){
        this.query= query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this .queryStr.keyword ? {
         name:{
            $regex: this.queryStr.keyword,
            $options: 'i'

         }
        }:{}
        
        this.query = this.query.find({ ...keyword });
        return this
    }
    filter(){
        const queryCopy ={...this.queryStr}

        //removing fields from query(we dont need these filed in our filter method so we will remove them from querycopy)
        const removeFields = ['keyword','limit','page'];
        removeFields.forEach(el=> delete queryCopy[el])
        //advance filters for price,ratig etc
        //turn data to string to run methods
          let queryStr = JSON.stringify(queryCopy)
        //gte and lte is mongo operator we will add $ with this 
         queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match => `$${match}`)
        
        this.query = this.query.find(JSON.parse(queryStr))
        return this

    }
    pagination(resPerpage){

       // console.log(resPerpage)
        
        //see on which page we are
        const currentPage = Number(this.queryStr.page) || 1;
        //skip records from DB
        const skip = resPerpage * (currentPage - 1)

        

        this.query = this.query.limit(resPerpage).skip(skip)
        return this
    }
}

module.exports = APIFeatures