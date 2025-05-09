import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Blog from './models/blog.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bloglist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define routes for getting, adding, and deleting blog posts
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

app.post('/api/blogs', async (req, res) => {
  const { title, author, url, likes } = req.body;
  const blog = new Blog({ title, author, url, likes });
  const savedBlog = await blog.save();
  res.json(savedBlog);
});

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndRemove(id);
  res.status(204).end();
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
