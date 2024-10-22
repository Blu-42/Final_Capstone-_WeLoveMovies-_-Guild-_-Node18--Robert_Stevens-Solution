const db = require("../db/connection");

async function read(reviewId) {
  return db("reviews").select("*").where({ review_id: reviewId }).first();
}

async function update(review) {
  return db("reviews")
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

async function destroy(reviewId) {
  const existingReview = await read(reviewId);
  if (!existingReview) {
    throw { status: 404, message: "Review cannot be found." };
  }
  return db("reviews").where({ review_id: reviewId }).del();
}

async function list(movie_id) {
  return db("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .where({ "reviews.movie_id": movie_id })
    .select("reviews.*", "critics.*")
    .then((reviews) => {
      return reviews.map((review) => {
        const {
          critic_id,
          preferred_name,
          surname,
          organization_name,
          created_at,
          updated_at,
          ...rest
        } = review;

        return {
          ...rest,
          critic: {
            critic_id,
            preferred_name,
            surname,
            organization_name,
            created_at,
            updated_at,
          },
        };
      });
    });
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

module.exports = {
  read,
  update,
  destroy,
  list,
};