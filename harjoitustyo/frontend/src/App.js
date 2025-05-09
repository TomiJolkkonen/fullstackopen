import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/items')
      .then(response => setItems(response.data));
  }, []);

  const addItem = () => {
    const item = { content: newItem };
    axios.post('http://localhost:3001/api/items', item)
      .then(response => {
        setItems(items.concat(response.data));
        setNewItem('');
      });
  };

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map(item => <li key={item.id}>{item.content}</li>)}
      </ul>
      <input
        value={newItem}
        onChange={e => setNewItem(e.target.value)}
      />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

export default App;
