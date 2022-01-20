const model = require('../models/user');
const Connection = require('../models/connection');
const rsvp = require('../models/rsvp');

exports.new = (req, res)=>{
        return res.render('./user/new');
};

exports.create = (req, res, next)=>{
  
    let user = new model(req.body);
    user.save()
    .then(user=> {
        req.flash('success', 'Registration succeeded!');
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('back');
        }
        next(err);
    }); 
    
};

exports.getUserLogin = (req, res, next) => {
        return res.render('./user/login');
}

exports.login = (req, res, next)=>{

    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.session.name = user.firstName
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    
    Promise.all([Connection.find(),rsvp.find()])
    .then(results=>{
        let [allblogs,rsvps] = results;
        let blogsYes = [];
        let blogsNo = [];
        let blogsMaybe = [];
        rsvps.forEach(rsvp=>{
            rsvp.yes.forEach(rn=>{
                if(rn==id)
                {
                    allblogs.forEach(blog=>{
                        if(blog._id==rsvp.blogId)
                        {blogsYes.push(blog);}
                    })
                }
            })
            rsvp.no.forEach(rn=>{
                if(rn==id)
                {
                    allblogs.forEach(blog=>{
                        if(blog._id==rsvp.blogId)
                        {blogsNo.push(blog);}
                    })
                }
            })
            rsvp.maybe.forEach(rn=>{
                if(rn==id)
                {
                    allblogs.forEach(blog=>{
                        if(blog._id==rsvp.blogId)
                        {blogsMaybe.push(blog);}
                    })
                }
            })
        })
        
        Promise.all([model.findById(id), Connection.find({author: id})])
        .then(results=>{
            const [user, blogs] = results;
            res.render('./user/profile', {user, blogs, blogsYes,blogsNo,blogsMaybe});
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };



