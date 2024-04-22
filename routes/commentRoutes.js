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
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: string
 *               content:
 *                 type: string
 *                 format: email
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

/**
 * @swagger
 * /api/comments/{commentId}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: New content of the comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: User is not authorized to update this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put('/:commentId', checkAuth, commentController.updateComment);

/**
 * @swagger
 * /api/comments/by-user/{author}:
 *   get:
 *     summary: Retrieve all comments made by a user, grouped by post
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: author
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID whose comments are to be retrieved
 *     responses:
 *       200:
 *         description: A list of comments grouped by posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postId:
 *                   type: string
 *                 postTitle:
 *                   type: string
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       404:
 *         description: No comments found
 *       500:
 *         description: Server error
 */
router.get('/by-user/:author', checkAuth, commentController.getUserCommentsByPost);


module.exports = router;
