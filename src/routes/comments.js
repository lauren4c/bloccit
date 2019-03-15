const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const validation = require("./validation");
const helper = require("../auth/helpers");

router.post(
  "/topics/:topicId/posts/:postId/comments/create",
  validation.validateComments,
  commentController.create
);

router.post(
  "/topics/:topicId/posts/:postId/comments/:id/destroy",
  helper.ensureAuthenticated,
  commentController.destroy
);
module.exports = router;
