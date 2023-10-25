import { MongoClient, Db, Collection } from 'mongodb';

export type Log = {
  id: string;
  timestamp: Date;
  // [longitude, latitude]
  location: [number, number] | null;
  userid: string;
  message: string;
};

const client = new MongoClient(process.env.MONGODB_URI as string);
let db: Db | null = null;
let logsCollection: Collection | null = null;

export function getConnection(): Collection {
  if (!db || !logsCollection) {
    throw new Error("Not connected to database");
  } else {
    return logsCollection;
  }
}

export async function connect() {
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME);
  logsCollection = db.collection(process.env.MONGO_DB_LOGS_COLLECTION_NAME as string);
}

export async function getLogs(userid: string): Promise<Log[]> {
  const connection = getConnection();
  const logs = await connection.find({ userid }).toArray();

  // convert mongo logs to logs
  return logs.map((log) => {
    return {
      id: log._id.toString(),
      timestamp: log._id.getTimestamp(),
      location: log.location ? log.location.coordinates : null,
      userid: log.userid,
      message: log.message,
    };
  });
}

export async function insertLog(userid: string, message: string, location: [number, number] | null = null) {
  const connection = getConnection();

  if (message === "") {
    throw new Error("Message cannot be empty");
  }
  
  const result = await connection.insertOne({
    userid, message, location: {
      type: 'Point',
      coordinates: location,
    }
  });
  return result.insertedId.toString();
}
