import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newLikes, setNewLikes] = useState(0);
  const [user, setUser] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:3001/api/blogs', {
        headers: { Authorization: `bearer ${user.token}` }
      })
        .then(response => setBlogs(response.data));
    }
  }, [user]);

  const login = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        username: loginUsername,
        password: loginPassword,
      });
      const loggedInUser = response.data;
      setUser(loggedInUser);
      window.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      setLoginUsername('');
      setLoginPassword('');
    } catch (exception) {
      setMessage('Invalid username or password');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = { title: newTitle, author: newAuthor, url: newUrl, likes: newLikes, user: user.id };

    axios.post('http://localhost:3001/api/blogs', blogObject, {
      headers: { Authorization: `bearer ${user.token}` }
    })
      .then(response => {
        setBlogs(blogs.concat(response.data));
        setNewTitle('');
        setNewAuthor('');
        setNewUrl('');
        setNewLikes(0);
      });
  };

  const handleLogin = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={login}>
        <div>
          Username: <input value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
        </div>
        <div>
          Password: <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );

  const handleBlogForm = () => (
    <div>
      <h2>Add New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title: <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        </div>
        <div>
          Author: <input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} />
        </div>
        <div>
          URL: <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
        </div>
        <div>
          Likes: <input type="number" value={newLikes} onChange={(e) => setNewLikes(Number(e.target.value))} />
        </div>
        <button type="submit">Add Blog</button>
      </form>
    </div>
  );

  return (
    <div>
      {user ? (
        <>
          <h2>Blogs</h2>
          <ul>
            {blogs.map(blog => (
              <li key={blog.id}>
                {blog.title} by {blog.author}
              </li>
            ))}
          </ul>
          {handleBlogForm()}
        </>
      ) : handleLogin()}
      {message && <div>{message}</div>}
    </div>
  );
};

export default App;
