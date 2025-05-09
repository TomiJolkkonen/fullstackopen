// Part 2.1: Course information step
const Header = ({ course }) => <h1>{course}</h1>;

const App = () => {
  const course = 'Half Stack application development';
  return <Header course={course} />;
};

// Part 2.2: Rendering collection
const Course = ({ parts }) => (
  <ul>
    {parts.map((part, i) => <li key={i}>{part.name} {part.exercises}</li>)}
  </ul>
);

// Part 2.3: Single state phonebook
import { useState } from 'react';

const Phonebook = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]);
  const [newName, setNewName] = useState('');

  const addPerson = (event) => {
    event.preventDefault();
    setPersons(persons.concat({ name: newName }));
    setNewName('');
  };

  return (
    <div>
      <form onSubmit={addPerson}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button type="submit">add</button>
      </form>
      {persons.map((p, i) => <div key={i}>{p.name}</div>)}
    </div>
  );
};

// Part 2.4: Communicating with server (mock)
import { useState, useEffect } from 'react';

const AppWithServer = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setNotes([{ id: 1, content: 'Mock note' }]);
    }, 1000);
  }, []);

  return (
    <ul>
      {notes.map(note => <li key={note.id}>{note.content}</li>)}
    </ul>
  );
};

// Part 2.5: useEffect demo
const Counter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCounter(c => c + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <div>Counter: {counter}</div>;
};

// Combined App Component
const CombinedApp = () => {
  const parts = [
    { name: 'Fundamentals of React', exercises: 10 },
    { name: 'Using props to pass data', exercises: 7 },
    { name: 'State of a component', exercises: 14 },
  ];

  return (
    <div>
      <Header course="Half Stack application development" />
      <Course parts={parts} />
      <Phonebook />
      <AppWithServer />
      <Counter />
    </div>
  );
};

export default CombinedApp;
