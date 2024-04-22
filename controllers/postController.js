const Post = require('../models/Post');
const User = require('../models/User');

module.exports.getPosts = async (req, res, next) => {
    try {
      const { page, pageSize, sortBy, order, ...filters } = req.query;

      const currentPage = parseInt(page, 10) || 1;
      const limit = parseInt(pageSize, 10) || 10;
      const skip = (currentPage - 1) * limit;
  
      let filterQuery = {};
      for (let key in filters) {
        if (filters[key]) {
          filterQuery[key] = new RegExp(filters[key], 'i');
        }
      }
  
      const sortQuery = sortBy ? { [sortBy]: order === 'desc' ? -1 : 1 } : {};
  
      const posts = await Post.find(filterQuery)
        .skip(skip)
        .limit(limit)
        .sort(sortQuery)
        .populate('author', 'username'); 
  
      const totalPosts = await Post.countDocuments(filterQuery);
      const totalPages = Math.ceil(totalPosts / limit);
  
      res.status(200).json({
        posts,
        currentPage,
        totalPages,
        pageSize: limit,
        totalPosts
      });
    } catch (error) {
      next(error);
    }
  };


module.exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.userData.userId;

    const post = new Post({
      title,
      content,
      author: userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

module.exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports.updatePost = async (req, res, next) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

module.exports.deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports.getPosts = async (req, res, next) => {
  try {
    const sortParam = req.query.sort || 'desc'; 
    const sortOrder = sortParam === 'desc' ? -1 : 1; 
    const posts = await Post.find()
                            .sort({ createdAt: sortOrder })
                            .populate('author', 'username');

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
