import "dotenv/config";
import express from "express";
import { connect, getLogs, insertLog } from "./database";

const userid = 'carlschader@gmail.com';

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

connect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`api listening on port ${process.env.PORT}`);
  });
});


