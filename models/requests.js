let mongoose = require('mongoose');
let requestSchema = new mongoose.Schema({
    name:{
        type: String
        
    },
    empID:{
        type: String,
        unique: true
    },
    requestBy:{
        type: String
    },
    curSeat:{
        type: String
    },
    reqSeat:{
        type: String    //Admin or Employee or Manager
    }

});

module.exports = mongoose.model('requests',requestSchema);