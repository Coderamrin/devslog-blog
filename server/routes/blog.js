const express = require('express');
const router = express.Router();
const Blog = require('../model/Blog');

//Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (err) {
    res.json({ message: err });
  }
});

// Add blog
router.post('/', async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    body: req.body.body,
  });

  try {
    const savedBlog = await blog.save();
    res.json(savedBlog);
  } catch (err) {
    res.json({ message: err });
  }
});

// Update blog
router.put('/:id', async (req, res) => {
  try {
    const updatedBlog = await Blog.updateOne(
      { _id: req.params.id },
      { $set: { title: req.body.title, body: req.body.body } }
    );

    res.json(updatedBlog);
  } catch (err) {
    res.json({ message: err });
  }
});

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).send('The blog with the given ID was not found.');

    const removedBlog = await Blog.deleteOne({ _id: req.params.id });
    res.json(removedBlog);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
