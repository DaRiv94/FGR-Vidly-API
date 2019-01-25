module.exports =function (handler){
    return async (req, res, next)=>{
        try{
            await handler(req, res);
        }catch(ex){
            next(ex);
        }
    };
}
//im not using this at the moment, but if I can figure out how to manufacture an error to test this maybe I will 
//use this just for understanding.      
//I could also use express-async-errors and just require it at the top of my index.js file.