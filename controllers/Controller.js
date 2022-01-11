const model = require('../models/connection');


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
        req.flash('success', 'Blog created successfully');
        res.redirect('/connections')}
    )
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
    model.findById(id).populate('author', 'firstName lastName')
    .then(blog => {
        if(blog){
            res.render('blog/connection',{blog});
        }else{
            let err = new Error('Blog not found with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
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

