const model = require('../models/connection');
const rsvp = require('../models/rsvp');

exports.connections = (req,res,next)=> { 
 let categories = new Set();
 model.find()
 .then((blogs)=>{
            for(let i=0; i< blogs.length; ++i){
               categories.add(blogs[i].categoryTopic);
        }
    categories = [...categories];
    categories.sort()
     res.render('blog/connections',{categories,blogs})})
 .catch((err)=> next(err))
}; 

exports.new = (req,res)=> { 
    res.render('blog/newConnection');
}

exports.create = (req,res,next)=> { 
    let blog = new model(req.body)
    blog.author = req.session.user;
    blog.save()
    .then((blog)=> {
        let newrsvp = new rsvp({blogId:blog._id});
        newrsvp.save().then(rsvp=>{
            req.flash('success', 'Blog created successfully');
            res.redirect('/connections')
        })
        .catch(err=>next(err))
    })
    .catch((err)=> {
        if(err.name === 'ValidationError')
        {
            req.flash('error', err.message);  
            return res.redirect('back');
        }
        next(err)})
}

exports.show = (req,res,next)=> { 
    let id = req.params.id;
    let count = 0; 

    rsvp.findOne({blogId:id})
    .then(result=>{
        console.log(result)
        count = result.yes.length;
        model.findById(id).populate('author', 'firstName lastName')
        .then(blog => {
            if(blog){
                res.render('blog/connection',{blog, count});
            }else{
                let err = new Error('Blog not found with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
    })
    .catch(err => next(err))
} 

exports.edit = (req,res,next)=> {
    let id = req.params.id;
    model.findById(id)
    .then(blog => {
        if(blog){
            return res.render('blog/edit',{blog});
        }else{
            let err = new Error('Blog not found with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
} 

exports.update = (req,res,next)=> { 
    let blog = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, blog, {useFindAndModify: false, runValidators: true})
    .then(blog => {
        if(blog){
            req.flash('success', 'Blog updated successfully');
            res.redirect('/connections/'+id);    
        }else{
            let err = new Error('Blog not found with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);  
            return res.redirect('back');
        }
        next(err);
    });
} 

exports.delete = (req,res,next)=> { 
    let id = req.params.id;
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then((blog) => {
        if(blog){
            req.flash('success', 'Blog deleted successfully');
            res.redirect('/connections');
        }else{
            let err = new Error('Blog not found with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
} 

// RSVP controllers

exports.rsvpDelete = (req,res,next)=>{
    let blog = req.params.id.toString();
    let userId = req.session.user.toString();
     
    if(!req.body){
        let err = new Error("RSVP must be only 'yes', 'no' or 'maybe'");
        err.status = 400;
        next(err); 
    }else if(req.body.rsvp.toLowerCase() === "yes"){
        rsvp.updateOne({blogId:blog},{$pull:{"yes":userId}})
        .then(result=>{
            console.log(result);
            req.flash('success','RSVP was deleted successfully!');
            res.redirect('/users/profile');
        })
        .catch(err=>{next(err)});
    }else if(req.body.rsvp.toLowerCase() === "no"){
        rsvp.updateOne({blogId:blog},{$pull:{"no":userId}})
        .then(result=>{
            console.log(result);
            req.flash('success','RSVP was deleted successfully!');
            res.redirect('/users/profile');
        })
    .catch(err=>{next(err)});
    }else if(req.body.rsvp.toLowerCase() === "maybe"){
        rsvp.updateOne({blogId:blog},{$pull:{"maybe":userId}})
        .then(result=>{
            console.log(result);
            req.flash('success','RSVP was deleted successfully!');
            res.redirect('/users/profile');
        })
        .catch(err=>{next(err)});
    }else {
        let err = new Error("RSVP must be either 'yes', 'no' or 'maybe'");
        err.status = 400;
        next(err); 
    }
}



exports.rsvp = (req,res,next) =>{
    let blog = req.params.id.toString();
    let userId = req.session.user.toString();
    console.log(req.body)
    if(!req.body || !req.body.rsvp){
        let err = new Error("RSVP can not be Empty");
        err.status =400;
        next(err); 
    }else if(req.body.rsvp.toLowerCase() === "yes"){
        rsvp.updateOne({blogId:blog},{$pull:{"yes":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({blogId:blog},{$pull:{"maybe":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({blogId:blog},{$pull:{"no":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({blogId:blog},{$push:{"yes":userId}})
        .then(result=>{
                req.flash('success','You have successfully RSVPed this blog.');
                res.redirect('/users/profile');
        })
        .catch(err=>{
            console.log(err);
            next(err)
        })
    }else if(req.body.rsvp.toLowerCase() === "no"){
        rsvp.updateOne({blogId:blog},{$pull:{"yes":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({blogId:blog},{$pull:{"maybe":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({blogId:blog},{$pull:{"no":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({blogId:blog},{$push:{"no":userId}})
        .then(result=>{
            console.log(result)
                req.flash('success','You have successfully RSVPed this blog.');
                res.redirect('/users/profile');
        })
        .catch(err=>{
            console.log(err);
            next(err)
        })
    }else if(req.body.rsvp.toLowerCase() === "maybe"){
        rsvp.updateOne({blogId:blog},{$pull:{"yes":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({blogId:blog},{$pull:{"maybe":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({blogId:blog},{$pull:{"no":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({blogId:blog},{$push:{"maybe":userId}})
        .then(result=>{
                req.flash('success','You have successfully RSVPed this blog.');
                res.redirect('/users/profile');
        })
        .catch(err=>{
            console.log(err);
            next(err)
        })
    }else {
        let err = new Error("RSVP must be 'yes', 'no' or 'maybe'");
        err.status =400;
        next(err); 
    }
}
