const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const checkAuth = require('../middlewares/checkAuth');

/**
 * @swagger
 * /api/comments/posts/{postId}/comments:
 *   post:
 *     summary: Create a comment on a post
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post('/posts/:postId/comments', checkAuth, commentController.createComment);

/**
 * @swagger
 * /api/comments/posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the post to get comments for
 *     responses:
 *       200:
 *         description: An array of comments
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get('/posts/:postId/comments', commentController.getCommentsByPostId);

/**
 * @swagger
 * /api/comments/posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the post associated with the comment
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment or post not found
 *       500:
 *         description: Server error
 */
router.delete('/posts/:postId/comments/:commentId', checkAuth, commentController.deleteComment);

module.exports = router;
