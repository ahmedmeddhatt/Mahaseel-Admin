const express = require('express');
const router = express.Router({mergeParams: true});
const postsController = require('../controllers/posts.controller');

router.get('/', postsController.postsList);
router.put('/:id', postsController.updatePost);
router.put('/active/:id', postsController.activePost);
router.put('/deactive/:id', postsController.deactivePost);
router.post('/', postsController.createPost);
router.delete('/:id', postsController.deletePost);

module.exports = router;