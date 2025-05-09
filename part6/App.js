import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newLikes, setNewLikes] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3001/api/blogs')
      .then(response => setBlogs(response.data));
  }, []);

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = { title: newTitle, author: newAuthor, url: newUrl, likes: newLikes };

    axios.post('http://localhost:3001/api/blogs', blogObject)
      .then(response => {
        setBlogs(blogs.concat(response.data));
        setNewTitle('');
        setNewAuthor('');
        setNewUrl('');
        setNewLikes(0);
      });
  };

  const deleteBlog = (id) => {
    axios.delete(`http://localhost:3001/api/blogs/${id}`)
      .then(() => setBlogs(blogs.filter(blog => blog.id !== id)));
  };

  const handleTitleChange = (event) => setNewTitle(event.target.value);
  const handleAuthorChange = (event) => setNewAuthor(event.target.value);
  const handleUrlChange = (event) => setNewUrl(event.target.value);
  const handleLikesChange = (event) => setNewLikes(event.target.value);

  return (
    <div>
      <h2>Blog List</h2>
      <form onSubmit={addBlog}>
        <div>
          title: <input value={newTitle} onChange={handleTitleChange} />
        </div>
        <div>
          author: <input value={newAuthor} onChange={handleAuthorChange} />
        </div>
        <div>
          url: <input value={newUrl} onChange={handleUrlChange} />
        </div>
        <div>
          likes: <input value={newLikes} onChange={handleLikesChange} type="number" />
        </div>
        <button type="submit">add</button>
      </form>
      <h2>All Blogs</h2>
      <ul>
        {blogs.map(blog =>
          <li key={blog.id}>
            {blog.title} by {blog.author} 
            <button onClick={() => deleteBlog(blog.id)}>delete</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default App;
