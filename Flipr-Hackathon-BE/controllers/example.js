import Example from '../models/example.js'; 

export const getExampleData = async (req, res) => {
  try {
    const result = await Example.find(); // ✅ Mongoose query
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
};

export const createExampleData = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });

    const newDoc = await Example.create({ message }); // ✅ Mongoose create
    res.status(201).json({ message: 'Created', data: newDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error inserting data' });
  }
};
