const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const {Rental} = require('../../models/rental');
const moment = require('moment');
const {Movie} =require('../../models/movie');

let server;

//////GENRES.TEST
describe('/api/genres', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await server.close(); 
    await Genre.remove({});
  });
  /////GENRES GET /api/genres
  describe('GET /', () => {
    it('should return all genres', async () => {
      const genres = [
        { name: 'genre1' },
        { name: 'genre2' },
      ];
      
      await Genre.collection.insertMany(genres);

      const res = await request(server).get('/api/genres');
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });
  /////GENRES GET /api/genres/:id
  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);     
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/genres/' + id);

      expect(res.status).toBe(404);
    });
  });

  /////GENRES POST /api/genres
  describe('POST /', () => {

    // Define the happy path, and then in each test, we change 
    // one parameter that clearly aligns with the name of the 
    // test. 
    let token; 
    let name; 

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateJsonWebToken();      
      name = 'genre1'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      await exec();

      const genre = await Genre.find({ name: 'genre1' });

      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });

  /////GENRES PUT /api/genres/:id
  describe('PUT /:id', () => {
    let token; 
    let newName; 
    let genre; 
    let id; 

    const exec = async () => {
      return await request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name: newName });
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      token = new User().generateJsonWebToken();     
      id = genre._id; 
      newName = 'updatedName'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      newName = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      newName = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if genre with the given id was not found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should update the genre if input is valid', async () => {
      await exec();

      const updatedGenre = await Genre.findById(genre._id);

      expect(updatedGenre.name).toBe(newName);
    });

    it('should return the updated genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });  

  /////GENRES DELETE /api/genres/:id
  describe('DELETE /:id', () => {
    let token; 
    let genre; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      id = genre._id; 
      token = new User({ isAdmin: true }).generateJsonWebToken();     
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateJsonWebToken(); 

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the genre if input is valid', async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it('should return the removed genre', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
      expect(res.body).toHaveProperty('name', genre.name);
    });
  }); 

});

//////AUTH MIDDLEWARE
describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => { 
      await Genre.remove({});
      await server.close(); 
    });

  
    let token; 
  
    const exec = () => {
      return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' });
    }
  
    beforeEach(() => {
      token = new User().generateJsonWebToken();
    });
  
    it('should return 401 if no token is provided', async () => {
      token = ''; 
  
      const res = await exec();
  
      expect(res.status).toBe(401);
    });
  
    it('should return 400 if token is invalid', async () => {
      token = 'a'; 
  
      const res = await exec();
  
      expect(res.status).toBe(400);
    });
  
    it('should return 200 if token is valid', async () => {
      const res = await exec();
  
      expect(res.status).toBe(200);
    });
});

////// RETURNS.test
describe('Returns tests',()=>{
  
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;

  const exec =  ()=>{
    return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId ,movieId});
  };

  beforeEach(async () => { 
    server = require('../../index'); 

  customerId= mongoose.Types.ObjectId();
   movieId= mongoose.Types.ObjectId();
   token=new User().generateJsonWebToken();
    
    movie = new Movie({
        _id:movieId,
        title:'12345',
        dailyRentalRate:2,
        genre: {name:'12345'},
        numberInStock: 10
    });
    await movie.save();

    rental = new Rental({
      customer:({
        _id: customerId,
        name:'12345',
        phone:'12345'
      }),
      movie:({
        _id:movieId,
        title:'12345',
        dailyRentalRate:2
      }),
    });
    
    await rental.save();
  
  })

    afterEach(async () => { 
      
      await server.close(); 

      await Rental.remove({});
      await Movie.remove({});
    });
  
  
  it('should return 401 if client is not logged in', async ()=>{
    token = '';
    

    const res = await exec();

    expect(res.status).toBe(401);
    });

    it('should return 400 if customerId not provided', async ()=>{
      customerId ='';

      const res = await exec();

      expect(res.status).toBe(400);
      
     
    });

    it('should return 400 if movieId not provided', async ()=>{
      movieId ='';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if no rental exists for customerId/movieId', async ()=>{
      rental.remove();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed', async ()=>{
      rental.dateReturned = new Date();
      rental.save();

      const res = await exec();


      expect(res.status).toBe(400);
    });

    it('should return 200 if valid request', async ()=>{
      

      const res = await exec();


      expect(res.status).toBe(200);
    });

    it('should set the returnDate if input is valid', async ()=>{
      

      const res = await exec();


      //rental object is not aware of changes in the db from exec() being called so we reload the rental.
      //changes were made with exec call in returns route, and our rental object in this file would not have changed,
      //so we need to reload it from the database with teh changes we made from our exec call.
      const rentalInDb = await Rental.findById(rental._id);

      //load difference between current time and rentalInDb.dateReturned which should be very small. its in milliseconds
       const diff = new Date()- rentalInDb.dateReturned;
       expect(diff).toBeLessThan(10 * 1000);
      
    });

    it('should return calculated rental fee if input is valid', async ()=>{
      rental.dateRented = moment().add(-7,'days');
      await rental.save();

      await exec();

      const rentalInDb = await Rental.findById(rental._id);
      expect(rentalInDb.rentalFee).toBe(14);
      
    });
    
    it('should increase movie stock if input is valid', async ()=>{
      

      await exec();
      const movieInDb = await Movie.findById(movieId);
      
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
      
    });

    it('should return rental in body of response if input is valid', async ()=>{
      

      const res = await exec();
      
      const rentalInDb = await Rental.findById(rental._id);
      
    // expect(res.body).toHaveProperty('dateRented');
    // expect(res.body).toHaveProperty('dateReturned');
    // expect(res.body).toHaveProperty('rentalFee');
    // expect(res.body).toHaveProperty('customer');
    // expect(res.body).toHaveProperty('movie');

      //this is the same as listing all the propertys in the 5 lines above.
      expect(Object.keys(res.body))
        .toEqual(expect.arrayContaining([
            'dateRented',
             'dateReturned',
             'rentalFee',
             'customer',
             'movie'
            ]));
      
    });



});