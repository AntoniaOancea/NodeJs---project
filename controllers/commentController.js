const Comment = require('../models/Comment');
const Post = require('../models/Post');
const mongoose = require('mongoose');


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
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports.updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params; 
    const { content } = req.body; 
    const userId = req.userData.userId; 

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'User is not authorized to update this comment' });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    next(error);
  }
};


module.exports.getUserCommentsByPost = async (req, res, next) => {
  try {
    const author = req.params.author; 
    const comments = await Comment.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(author) } },
      { $group: {
          _id: "$post",
          comments: { $push: { content: "$content", createdAt: "$createdAt" } }
      }},
      { $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "_id",
          as: "postDetails"
      }},
      { $unwind: "$postDetails" }, 
      { $project: {
          postTitle: "$postDetails.title",
          comments: 1
      }}
    ]);

    if (!comments) {
      return res.status(404).json({ message: 'No comments found for this user' });
    }

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
