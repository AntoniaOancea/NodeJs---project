const Comment = require('../models/Comment');
const Post = require('../models/Post');

module.exports.createComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;
    const userId = req.userData.userId;

    const comment = new Comment({
      content,
      author: userId,
      post: postId,
    });

    await comment.save();

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

module.exports.getCommentsByPostId = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId }).populate('author', 'username');
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteComment = async (req, res, next) => {
  try {
    // console.log(req.params);
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
