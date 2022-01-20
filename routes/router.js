const express = require('express')
const controller = require('../controllers/Controller.js')
const router = express.Router(); 
const {isLoggedIn, isAuthor, isNotBlogAuthor} = require('../middleware/auth');
const{validateId,validateBlog,validateResult, validateRSVP} = require('../middleware/validator');

router.get('/',controller.connections)

router.get('/new',isLoggedIn,controller.new)

router.post('/',isLoggedIn, validateBlog,validateResult, controller.create)

router.get('/:id',validateId,controller.show)

router.get('/:id/edit',validateId,isLoggedIn,isAuthor,controller.edit )

router.put('/:id',validateId,isLoggedIn,isAuthor,validateBlog, validateResult, controller.update)

router.delete('/:id',validateId,isLoggedIn,isAuthor,controller.delete)

// RSVP routes 
//RSVP Connections
router.post('/:id/rsvp',isLoggedIn, validateId, validateRSVP, isNotBlogAuthor, controller.rsvp);
router.delete('/:id/rsvp',isLoggedIn, validateId, validateRSVP, isNotBlogAuthor, controller.rsvpDelete);


module.exports = router