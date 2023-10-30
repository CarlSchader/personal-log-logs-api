import "dotenv/config";
import express from "express";
import axios from "axios";
import { connect, getLogs, insertLog } from "./database";

const userid = 'carlschader@gmail.com';
const LLM_API_URL = process.env.LLM_API_URL as string;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.sendStatus(200);
});

app.get('/logs', async (req, res) => {
  const logs = await getLogs(userid);
  return res.json(logs);
});

app.post('/logs', async (req, res) => {
  const { message, location } = req.body;
  const logId = await insertLog(userid, message, location);
  return res.json({ id: logId });
});

app.get('/insight', async (req, res) => {
  const logs = await getLogs(userid);
  const formattedLogs = logs.map((log) => `${log.timestamp.toLocaleString()}: ${log.message}`).join('\n');
  const preamble = `Given these notes:\n${formattedLogs}\n\n`;

  let queryString = `q=${preamble}How would you summarise?`;
  if (req.query.q) queryString = `q=${preamble + req.query.q}`;
  if (req.query.system_prompt) queryString += `&system_prompt=${req.query.system_prompt}`;
  if (req.query.max_new_tokens) queryString += `&max_new_tokens=${req.query.max_new_tokens}`;

  const llmResponse = await axios.get(`${LLM_API_URL}/query?${queryString}`);

  return res.json(llmResponse.data);
});

connect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`api listening on port ${process.env.PORT}`);
  });
});


