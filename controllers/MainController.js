
exports.home = (req,res)=> { 
    res.render('index')
}

exports.about = (req,res) => { 
    console.log('In about')
    res.render('about')
}

exports.contact = (req,res) => { 
    console.log('In about')
    res.render('contact')
}