let mongoose = require('mongoose');
let employeeSchema = new mongoose.Schema({
    name:{
        type: String,
        
    },
    empID:{
        type: String,
        unique: true
    },
    seatNo:{
        type: String
    },
    managerID:{
        type: String
    },
    mail:{
        type: String
    },
    role:{
        type: String    //Admin or Employee or Manager
    }

});

module.exports = mongoose.model('Employee',employeeSchema);