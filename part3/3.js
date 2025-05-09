// Part 3.1: Exercise 1 - Course information step with props
const Header = ({ course }) => <h1>{course}</h1>;

const Part = ({ part }) => (
  <p>{part.name} {part.exercises}</p>
);

const Content = ({ parts }) => (
  <div>
    {parts.map((part, index) => <Part key={index} part={part} />)}
  </div>
);

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p>Total exercises {totalExercises}</p>;
};

const App = () => {
  const course = 'Half Stack application development';
  const parts = [
    { name: 'Fundamentals of React', exercises: 10 },
    { name: 'Using props to pass data', exercises: 7 },
    { name: 'State of a component', exercises: 14 }
  ];

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

// Part 3.2: Exercise 2 - Phonebook app with multiple state variables
import { useState } from 'react';

const PhonebookApp = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas', number: '040-1234567' }]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const addPerson = (event) => {
    event.preventDefault();
    setPersons(persons.concat({ name: newName, number: newNumber }));
    setNewName('');
    setNewNumber('');
  };

  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="name"
          />
        </div>
        <div>
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="number"
          />
        </div>
        <button type="submit">add</button>
      </form>
      <ul>
        {persons.map((p, index) => <li key={index}>{p.name} {p.number}</li>)}
      </ul>
    </div>
  );
};

// Part 3.3: Exercise 3 - Adding filter to phonebook
const Filter = ({ search, setSearch }) => (
  <div>
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="filter by name"
    />
  </div>
);

const FilteredPhonebookApp = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' },
    { name: 'Ada Lovelace', number: '39-44-532532' },
    { name: 'Dan Abramov', number: '12-43-234345' }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  const addPerson = (event) => {
    event.preventDefault();
    setPersons(persons.concat({ name: newName, number: newNumber }));
    setNewName('');
    setNewNumber('');
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Filter search={search} setSearch={setSearch} />
      <form onSubmit={addPerson}>
        <div>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="name"
          />
        </div>
        <div>
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="number"
          />
        </div>
        <button type="submit">add</button>
      </form>
      <ul>
        {filteredPersons.map((p, index) => <li key={index}>{p.name} {p.number}</li>)}
      </ul>
    </div>
  );
};

// Part 3.4: Exercise 4 - Phonebook backend integration
import { useState, useEffect } from 'react';

const PhonebookBackendApp = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch initial data from a mock backend
    setTimeout(() => {
      setPersons([
        { name: 'Arto Hellas', number: '040-1234567' },
        { name: 'Ada Lovelace', number: '39-44-532532' },
        { name: 'Dan Abramov', number: '12-43-234345' }
      ]);
    }, 1000);
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    setPersons(persons.concat({ name: newName, number: newNumber }));
    setNewName('');
    setNewNumber('');
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Filter search={search} setSearch={setSearch} />
      <form onSubmit={addPerson}>
        <div>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="name"
          />
        </div>
        <div>
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="number"
          />
        </div>
        <button type="submit">add</button>
      </form>
      <ul>
        {filteredPersons.map((p, index) => <li key={index}>{p.name} {p.number}</li>)}
      </ul>
    </div>
  );
};

export default PhonebookBackendApp;
