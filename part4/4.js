// Part 4.1: Exercise 1 - The server
import express from 'express';

const app = express();
app.use(express.json());

let notes = [
  { id: 1, content: 'HTML is easy', important: true },
  { id: 2, content: 'Browser can execute only JavaScript', important: false },
  { id: 3, content: 'GET and POST are the most important methods of HTTP', important: true }
];

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const note = notes.find(note => note.id === parseInt(req.params.id));
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.post('/api/notes', (req, res) => {
  const body = req.body;
  const note = { id: notes.length + 1, content: body.content, important: body.important || false };
  notes = notes.concat(note);
  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  notes = notes.filter(note => note.id !== parseInt(req.params.id));
  res.status(204).end();
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

// Part 4.2: Exercise 2 - Frontend application with React
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/notes')
      .then(response => setNotes(response.data));
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = { content: newNote, important: Math.random() < 0.5 };
    axios.post('http://localhost:3001/api/notes', noteObject)
      .then(response => setNotes(notes.concat(response.data)));
    setNewNote('');
  };

  const handleNoteChange = (event) => setNewNote(event.target.value);

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };
    axios.put(`http://localhost:3001/api/notes/${id}`, changedNote)
      .then(response => setNotes(notes.map(n => (n.id !== id ? n : response.data))));
  };

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {notesToShow.map(note =>
          <li key={note.id}>
            {note.content}
            <button onClick={() => toggleImportanceOf(note.id)}>
              {note.important ? 'make not important' : 'make important'}
            </button>
          </li>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;

// Part 4.3: Exercise 3 - Express error handling
app.get('/api/notes/:id', (req, res, next) => {
  const note = notes.find(note => note.id === parseInt(req.params.id));
  if (note) {
    res.json(note);
  } else {
    const error = new Error('Note not found');
    error.status = 404;
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(error.status || 500).send({ error: error.message });
});

// Part 4.4: Exercise 4 - Validation
app.post('/api/notes', (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const note = { id: notes.length + 1, content: body.content, important: body.important || false };
  notes = notes.concat(note);
  res.json(note);
});

// Part 4.5: Exercise 5 - Update backend with PUT
app.put('/api/notes/:id', (req, res) => {
  const body = req.body;
  const note = notes.find(note => note.id === parseInt(req.params.id));

  if (!note) {
    return res.status(404).json({ error: 'note not found' });
  }

  const updatedNote = { ...note, content: body.content, important: body.important };
  notes = notes.map(n => n.id !== note.id ? n : updatedNote);
  res.json(updatedNote);
});
