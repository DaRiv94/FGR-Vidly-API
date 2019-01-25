const config = require('config');

//setting NODE_ENV decides what the environment will be
//if its not set then running npm test will default NODE_ENV=test , 
//and default npm start  NODE_ENV=development
describe('See DB Connection',()=>{
    it('returns the connection string of db, remove NODE_ENV to let it default to "development" or "test" when needed', ()=>{
        const result = config.get('db');
        expect(result).toBe('mongodb://localhost/vidly_tests');
    });
   
});