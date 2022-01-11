const express = require('express')
const morgan = require('morgan')
const storyRoutes = require('./routes/router')
const methodOverride = require('method-override')
const otherRoutes = require('./routes/mainrouter')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


const app = express()

let port = 3000
let host = 'localhost'
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/demos', { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
    app.listen(port,host,()=> { 
        console.log('server running on port', port);
    })
})
.catch((err)=> console.log(err.message))



app.use(
    session({
        secret: "qwertyuioolkjhgfdsa",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/demos'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.name = req.session.name||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(morgan('tiny'))
app.use(methodOverride('_method'))


app.use('/connections', storyRoutes)
app.use('/users', userRoutes);
app.use('/', otherRoutes)

app.use((req,res,next)=> {
    
    let err = new Error('The server cannot locate ' + req.url)
    err.status = 404 
    console.log(err.message) 
    res.render('error', {error:err})
})

app.use((err,req,res,next)=> { 
    console.log(err.message)
    if(!err.status){ 
        err.status = 500; 
        err.message = ("Internal server error")
    }
    res.status(err.status)
    res.render('error',{error: err});
})
