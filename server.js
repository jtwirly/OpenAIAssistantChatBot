import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/assistants', async (req, res) => {
  const { name, id } = req.body;
  try {
    let assistant;
    if (id) {
      assistant = await openai.beta.assistants.retrieve(id);
    } else if (name) {
      const assistants = await openai.beta.assistants.list({ limit: 100 });
      assistant = assistants.data.find(a => a.name.toLowerCase() === name.toLowerCase());
    }

    if (assistant) {
      res.json({ assistant_id: assistant.id, assistant_name: assistant.name });
    } else {
      res.status(404).json({ error: 'Assistant not found' });
    }
  } catch (error) {
    console.error('Error fetching assistant:', error);
    res.status(500).json({ error: 'Failed to fetch assistant', details: error.message });
  }
});

app.post('/api/threads', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    res.json({ thread_id: thread.id });
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Failed to create thread', details: error.message });
  }
});

app.post('/api/run', async (req, res) => {
  const { message, thread_id, assistant_id } = req.body;
  try {
    if (!thread_id || !assistant_id) {
      return res.status(400).json({ error: 'Missing thread_id or assistant_id' });
    }

    await openai.beta.threads.messages.create(thread_id, {
      role: "user",
      content: message,
    });

    const run = await openai.beta.threads.runs.create(thread_id, {
      assistant_id: assistant_id
    });

    let runStatus;
    do {
      runStatus = await openai.beta.threads.runs.retrieve(thread_id, run.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } while (runStatus.status !== 'completed' && runStatus.status !== 'failed');

    if (runStatus.status === 'failed') {
      throw new Error('Run failed: ' + runStatus.last_error?.message || 'Unknown error');
    }

    const messages = await openai.beta.threads.messages.list(thread_id);
    const latestMessage = messages.data[0];
    
    res.json({ 
      run_id: run.id,
      message: {
        role: latestMessage.role,
        content: latestMessage.content[0].text.value
      }
    });
  } catch (error) {
    console.error('Error running assistant:', error);
    res.status(500).json({ error: 'Failed to run assistant', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});