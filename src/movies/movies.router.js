const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");

// TODO: Add your routes here
router
  .route("/")
  .get(controller.list)          
  .all(methodNotAllowed);       

// Route to get a specific movie by movieId
router
  .route("/:movieId")
  .get(controller.read)         
  .all(methodNotAllowed);  

//route to get theaters for movies
router
  .route("/:movieId/theaters")
  .get(controller.readTheaters).all(methodNotAllowed);

//route to get review for movies
router
  .route("/:movieId/reviews")
  .get(controller.readReviews).all(methodNotAllowed);

module.exports = router;
