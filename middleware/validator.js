const {body} = require('express-validator');
const {validationResult} = require('express-validator');
const {DateTime} = require('luxon');
var todayDate = DateTime.now().toFormat("yyyy-LL-dd");


exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};


exports.validateSignup =
[
    body('firstName','First Name cannot be empty').notEmpty().trim().escape(),
    body('lastName','Last Name cannot be empty').notEmpty().trim().escape(),
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password','Password be minimum of 8 charatcers and maximum of 64 characters').isLength({min:8, max:64})

];

exports.validateLogin = 
[
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password','Password be minimum of 8 charatcers and maximum of 64 characters').isLength({min:8, max:64})
];

exports.validateBlog= 
[
    body('categoryTopic','Topic cannot be empty').notEmpty().trim().escape(),
    body('categoryTopic','Topic must be atleast 3 characters.').isLength({min:3}),
    body('connectionName','Title cannot be empty').notEmpty().trim().escape(),
    body('connectionName','Title must be atleast 3 characters.').isLength({min:3}),
    body('details','Details cannot be empty').notEmpty().trim().escape(),
    body('details','Details must be atleast 10 characters.').isLength({min:10}),
    body('date','Date cannot be empty').notEmpty().trim().escape(),
    body('date','Date must be in a valid format').isDate(),
    body('date',"Date must be greater than today's date").isAfter(todayDate),
    body('startTime','StartTime cannot be empty').notEmpty().trim().escape(),
    body('endTime','EndTime cannot be empty').notEmpty().trim().escape(),
    body('endTime','EndTime cannot be empty').trim().custom((value,{req})=>{
        if(req.body.startTime>=req.body.endTime){
            throw new Error("End Time should be after start Time");
        }else{
            return true;
        }
    }),
    body('image','Image URL cannot be empty').notEmpty(),
    body('location','Location cannot be empty').notEmpty().trim().escape()
]  

exports.validateRSVP = [
    body("rsvp")
      .exists()
      .withMessage("RSVP cannot be empty")
      .if(body("rsvp").exists())
      .toUpperCase()
      .isIn(["YES", "NO", "MAYBE"])
      .withMessage("RSVP can only be Yes, No or Maybe"),
  ];



exports.validateResult = (req,res,next)=>{
    let errors= validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error',error.msg);
        });
        res.redirect('back');
    }else{
        return next();
    }
}