const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateJsonWebToken', ()=>{
    it('should return valid Json Web Token', ()=>{
        //generated ObjectId would be different if we generated the id in the expect and when creating new user
        //so we generate itr once as a payload and compare it to that same payload after the jwt is generated
        //and after it is decoded
        //the jwt is generated with a secert key and must use that same key to decode the jwt it was generated with.
        //for this instance we use the config file to pull a key in an environment variable for generationa nd decoding
        const payload = {
            _id: mongoose.Types.ObjectId().toHexString(),
             isAdmin:true
            };

        const user = new User(payload);
        const result = user.generateJsonWebToken();
        const decoded = jwt.verify(result, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);



    });
});