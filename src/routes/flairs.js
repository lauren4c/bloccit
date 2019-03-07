const express = require("express");
const router = express.Router();

const flairController = require("../controllers/flairController");

router.get("/posts/:postId/flairs/new", flairController.new);
router.post("/posts/:postId/flairs/create", flairController.create);
router.get("/posts/:postId/flairs/:id", flairController.show);
router.post("/posts/:postId/flairs/:id/destroy", flairController.destroy);
router.get("/posts/:postId/flairs/:id/edit", flairController.edit);
router.post("/posts/:postId/flairs/:id/update", flairController.update);

module.exports = router;
