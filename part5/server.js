import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// Connection to MongoDB
mongoose.connect('mongodb://localhost:27017/phonebook', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema and model for phonebook entries
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// API routes
app.get('/api/persons', async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

app.get('/api/persons/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).send({ error: 'Person not found' });
    }
  } catch (error) {
    res.status(400).send({ error: 'malformed id' });
  }
});

app.post('/api/persons', async (req, res) => {
  const { name, number } = req.body;

  const person = new Person({ name, number });
  await person.save();

  res.json(person);
});

app.delete('/api/persons/:id', async (req, res) => {
  await Person.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

app.put('/api/persons/:id', async (req, res) => {
  const { name, number } = req.body;

  const updatedPerson = await Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true }
  );

  res.json(updatedPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
``
