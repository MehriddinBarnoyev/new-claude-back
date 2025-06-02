const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const app = express();
const PORT = 3000;
const DB_FILE = __dirname + '/db.json';

app.use(cors({
  origin: ['https://main.dk4r0np7ptej8.amplifyapp.com', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: false // credentials true faqat kerak bo‘lsa qo‘sh
}));


app.use(express.json());
// sdf
// Ma'lumotlarni o'qish
function readTasks() {
  return fs.readJson(DB_FILE).catch(() => []);
}

function writeTasks(tasks) {
  return fs.writeJson(DB_FILE, tasks);
}

app.get('/tasks', async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
});

// Yangi vazifa qo'shish
app.post('/tasks', async (req, res) => {
  const tasks = await readTasks();
  const newTask = { id: Date.now(), text: req.body.text };
  tasks.push(newTask);
  await writeTasks(tasks);
  console.log(`New task added: ${newTask.text}`);
  
  res.json(newTask);
});

// Vazifani o‘chirish
app.delete('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  let tasks = await readTasks();
  tasks = tasks.filter(t => t.id !== id);
  await writeTasks(tasks);
  res.json({ success: true });
});

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is now running on port: ${PORT}`);
});
