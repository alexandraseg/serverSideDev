const express = require('express');
const bodyParser = require('body-parser');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => {
	Promotions.find({})
	.then((promotions) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotions);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post((req,res,next) => {
	Promotions.create(req.body)
	.then((promotion) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotion);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put((req,res,next) => {
	res.statusCode = 403;
	res.end("PUT operation is not supoorted on /promotions");
})
.delete((req,res,next) => {
	Promotions.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});


promoRouter.route('/:promoId')
.get((req,res,next) => {
	Promotions.findById(req.params.promoId)
	.then((promotion) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotion);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post((req,res,next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put((req,res,next) => {
	Promotions.findByIdAndUpdate(req.params.promoId, {
		$set: req.body,
	}, {
		new: true
	})
	.then((promotion) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotion);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.delete((req,res,next) => {
	Promotions.findByIdAndRemove(req.params.promoId)
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = promoRouter;

// const express = require('express');
// const bodyParser = require('body-parser');

// const promoRouter = express.Router();

// promoRouter.use(bodyParser.json());

// promoRouter.route('/')
// .all((req,res,next)=>{
// 	res.statusCode=200;
// 	res.setHeader('Content-Type','text/plain');
// 	next();
// })
// .get((req,res,next)=>{
// 	res.end("Will send all the promotions to you!");
// })
// .post((req,res,next)=>{
// 	res.end("Will add the promotion " + req.body.name + " with details " + req.body.description);
// })
// .put((req,res,next)=>{
// 	res.statusCode = 403;
// 	res.end("PUT operation is not supoorted on /promotions");
// })
// .delete((req,res,next)=>{
// 	res.end("Will delete all the promotions!");
// });


// promoRouter.route('/:promotionId')
// .get((req,res,next) => {
//     res.end('Will send details of the promotion: ' + req.params.promotionId +' to you!');
// })
// .post((req,res,next) => {
//   res.statusCode = 403;
//   res.end('POST operation not supported on /promotions/'+ req.params.promotionId);
// })
// .put((req,res,next) => {
//   res.write('Updating the promotion: ' + req.params.promotionId + '\n');
//   res.end('Will update the promotion: ' + req.body.name + 
//         ' with details: ' + req.body.description);
// })
// .delete((req,res,next) => {
//     res.end('Deleting promotion: ' + req.params.promotionId);
// });


// module.exports = promoRouter;