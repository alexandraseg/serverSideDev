const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorites');

const Dishes = require('../models/dishes');

const User = require('../models/user');


const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(authenticate.verifyUser, (req,res,next) => {
  Favorites.find({})
  .populate('user')
  .populate('dishes')
	.then((favorites) => {
		res.send(favorites);
	})
	.catch((err) => console.log(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
  Favorites.findOne({user: req.user._id})
  if (err) return next(err)
  .then((favorite) => {
    if(favorite){
      for (let i=0; i<req.body.length; i++){
        if(favorite.dishes.indexOf(req.body[i]._id) === -1)
          favorite.dishes.push(req.body[i]._id);
        else
          res.json("Dish " + req.body[i]._id + " already exists");
      }
      favorite.save()
      //Also while we are in favorites, whenever we make any changes to the favorites, 
//we want to be able to populate the user and dishes information, 
//the favorites, before we return. 
      .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                })
    	.catch((err) => console.log(err));
    } else {
      Favorites.create({
        user: req.user._id,
        dishes: req.body 
      })
      .then((favorite) => {
        res.json(favorite);
      })
    	.catch((err) => console.log(err));
    }
  })
})
.put(authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end("PUT operation is not supoorted on /favorites");
})
.delete(authenticate.verifyUser, (req,res,next) => {
	Favorites.remove({})
	.then((resp) => {
		res.send(resp);
	})
	.catch((err) => console.log(err));
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id}) //
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites}); // favorites will be null here
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) { //negative index showing that the specific dish doesnt exist in the favorites list of the user
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites}); 
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
  Favorites.findOne({user: req.user._id})
  .then((favorite) => {
    if(favorite){
      if(favorite.dishes.indexOf(req.params.dishId) === -1) {
        favorite.dishes.push(req.params.dishId);
        favorite.save()
        .then(favorite => {
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        })
        .catch((err) => console.log(err));
      } else {
        res.json("Dish " + req.params.dishId + " already exists");
      }
      
    } else {
      Favorites.create({
        user: req.user._id,
        dishes: req.params.dishId 
      })
      .then((favorite) => {
        res.json(favorite);
      })
    	.catch((err) => console.log(err));
    }
  })
})
.put(authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end("PUT operation is not supoorted on /favorites/"+req.params.dishId);
})
.delete(authenticate.verifyUser, (req,res,next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorite) => {
    const index = favorite.dishes.indexOf(req.params.dishId);
    if(index === -1) {
      res.json("Dish " + req.params.dishId + " not found");
    } else {
      favorite.dishes.splice(index, 1);
      favorite.save()
      .then(() => {
        Favorites.findById(favorite._id)
        .populate('user')
        .populate('dishes')
        .then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        })
      })
      .catch((err) => console.log(err));
    }
    
  })
	.catch((err) => console.log(err));
});

module.exports = favoriteRouter;
