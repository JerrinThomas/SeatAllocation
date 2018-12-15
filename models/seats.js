let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let seatSchema= new Schema({
    seatNo:{
        type: String,
        unique: true
    },
    seatStatus:{
        type: String        //Occupied or not
    }


});

module.exports = mongoose.model('Seat',seatSchema);