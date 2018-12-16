var router = require('express').Router()
var bodyParser = require('body-parser')
var faker = require('faker')
router.use(bodyParser.urlencoded({
    extended: true
}))
var Employee = require('../models/employees')
var Seats = require('../models/seats')




/**************************************************************************************/
/****************************** Database Fake Values **********************************/
/**************************************************************************************/

router.get('/fake-data',function(req,res){
    res.redirect('/add-seat');
})


/*************************************** Add Seats *******************************************/

router.get('/add-seat',function(req,res){
    for (var i = 0; i < 20; i++) {
        var seat=new Seats();
        seat.seatNo= i+1;
        seat.seatStatus = 'Free';

        seat.save(function (err) {})

    }
    res.redirect('/createRequest')
})

/***************************************** Create Requests **************************************/
router.get('/createRequest', function (req, res) {
    var reqQue = require('../models/requests');

    var product = new reqQue()

    product.empID = '20984'
    product.name = 'Jonie'
    product.requestBy = 'Jonie'
    product.curSeat = '1'
    product.reqSeat = '100'

    product.save(function (err) {
        if (err) throw err
    })

    res.redirect('/add-employee')

});


/******************************* Add Employee *******************************************/

router.get('/add-employee', function (req, res, next) {
    res.render('main/add-employee')
})

router.post('/add-employee', function (req, res, next) {
    var employee = new Employee();
    var seats = new Seats();
    employee.name = req.body.name
    employee.empID = req.body.empID
    employee.seatNo = req.body.seat
    employee.role = req.body.Role
    employee.managerID = req.body.manager
    employee.mail = req.body.mail

    var query = { seatNo: req.body.seat };
    Seats.update(query, { $set: { seatStatus: 'Occupied' } }, function (err) {
        console.log(err);
    });

    employee.save(function (err) {
        if (err) throw err
        res.redirect('/add-employee')
    })
})





router.get('/test', function (req, res, next) {
    res.render('main/users')
})


/************************************** Search ***********************************************/





/**********************************************************************************************/
/************************************** Admin Log-In ******************************************/
/**********************************************************************************************/

router.get('/admin',function(req,res){
   
        res.render('admin/admin-index');
    
   
})




/************************************ Admin Search *******************************************/

router.get('/searches',function(req,res){
    res.render('admin/admin-search')
})


router.post('/searches', function (req, res) {
    var datatablesQuery = require("datatables-query")
    params = req.body
    query = datatablesQuery(Employee);

    query.run(params).then(function (data) {
        console.log(data)

        res.json(data);
    }, function (err) {
        res.status(500).json(err);
    })
    //res.render('admin-search');
});




/************************************ Admin Floor Map *******************************************/





/********************************** Admin change seat *****************************************/

router.get('/admin-alloc',function(req,res){
    res.render('admin/admin-alloc')
})
router.get('/freeSeats',function(req,res){
    Seats.find({seatStatus:'Free'}).then(function(docs){
        //console.log('freeSeats')
        //console.log(docs);
        res.send(docs);
    })
})

router.post('/admin-alloc',function(req,res){
        var query={empID:req.body.emp_id};
        Employee.findOne({empID: req.body.emp_id}).then(function(docs){
            query={seatNo: docs.seatNo};
            Seats.update(query, { $set: { seatStatus: 'Free' } }, function (err) {
               // console.log(err);
            }); 
            query={seatNo: req.body.seat_no};
            Seats.update(query, { $set: { seatStatus: 'Occupied' } }, function (err) {
               // console.log(err);
            });
        })
        Employee.update(query, { $set: { seatNo: req.body.seat_no } }, function (err) {
           // console.log(err);
        });
      
        

        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: req.session.user.mail,
            pass: 'lordcares'
        }
        });

        var user_data;
        //var employee=require('../models/employees');
        Employee.find({ empID: req.body.emp_id }).then(function (docs) {
        user_data = docs[0];

        console.log(user_data);
        var mailOptions = {
            from: req.session.user.mail,
            to: user_data.mail,
            subject: 'Seat Allocated',
            text: user_data.name+ ' you have been allocated '
                + req.body.seat_no +
                ' as your new seat.'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
    res.redirect('/admin');
})


/********************************** Admin Request Queue ***********************************/
router.get('/reqQue',function(req,res){
    res.render('admin/requests');
})

router.post('/reqQue', function (req, res) {
    // console.log(req.body);
    var reqQue = require('../models/requests');
    var datatablesQuery = require("datatables-query")
    params = req.body
    query = datatablesQuery(reqQue);

    query.run(params).then(function (data) {
        //console.log(data)

        res.json(data);
    }, function (err) {
        res.status(500).json(err);
    })

});




router.get('/accept:ID&:reqSeat', function (req, res) {
    var employee = require('../models/employees');
    console.log(req.params.ID);
    var query = { empID: req.params.ID };
    employee.update(query, { $set: { seatNo: req.params.reqSeat } }, function (err) {
        console.log(err);
    });
    var reqQue = require('../models/requests');
    reqQue.deleteOne({ empID: req.params.ID }, function (err) { });
    res.render('RequestQue');
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: req.session.user.mail,
            pass: 'lordcares'
        }
    });

    var user_data;
    //var employee=require('../models/employees');
    employee.find({ empID: req.params.ID }).then(function (docs) {
        user_data = docs[0];

        console.log(user_data);
        var mailOptions = {
            from: req.session.user.mail,
            to: user_data.mail,
            subject: 'Request Accepted',
            text: 'Your request for seat allocation for Emp ID: '
                + user_data.empID +
                ' has been acepted and allocated.'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
})

router.get('/reject:ID', function (req, res) {
    var reqQue = require('../models/requests');
    reqQue.deleteOne({ empID: req.params.ID }, function (err) { });
    res.render('RequestQue');
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: req.session.user.mail,
            pass: 'lordcares'
        }
    });

    var user_data;
    var employee = require('../models/employees');
    employee.find({ empID: req.params.ID }).then(function (docs) {
        user_data = docs[0];

        console.log(user_data);
        var mailOptions = {
            from: req.session.user.mail,
            to: user_data.mail,
            subject: 'Request rejected',
            text: 'Your request for seat allocation for Emp ID: '
                + user_data.empID +
                ' has been rejected. Please contact admin for more details'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
})







/*************************************************************************************************/
/************************************* Manager Page *********************************************/
/***********************************************************************************************/

router.get('/manager', function (req, res) {
    res.redirect('/manager-index');
})


/************************************ Manager Search *******************************************/

router.get('/admin-search', function (req, res) {
    res.render('admin-search');
});




/************************************ Manager Floor Map *******************************************/





/********************************** Manager change seat request ***********************************/


router.get('/manager-allocation',function(req,res){

})







/**************************************************************************************************/
/************************************* Employee Page *********************************************/
/************************************************************************************************/

router.get('/employee', function (req, res) {
    res.redirect('/employee');
})


/************************************ Employee Search *******************************************/

router.get('/employee-search', function (req, res) {
    res.render('employee-search');
});




/************************************ Employee Floor Map *******************************************/





/********************************** Employee change seat request ***********************************/


router.get('/Employee-allocation',function(req,res){

})


/***********************************************************************************************/
/************************************** Sign-In Page ******************************************/
/*********************************************************************************************/

router.get('/index', function (req, res) {
    res.render('index');
})


router.post('/index', function (req, res) {
    var employees = require('../models/employees');
    employees.findOne({ empID: req.body.empID }).then(function (docs) {
        req.session.user = docs;
        console.log(docs);
        console.log(docs.role);
        if (docs.role === "Admin") {
            console.log('Admin');
            res.redirect('/admin');
        } else if (docs.role == 'Manager') {
            console.log('manager');
            res.redirect('/manager');
        }
        else {
            console.log('employee');
            res.redirect('/employee');
        }
    })

})





router.get('/', function (req, res, next) {
    res.redirect('/index');
});


module.exports = router;