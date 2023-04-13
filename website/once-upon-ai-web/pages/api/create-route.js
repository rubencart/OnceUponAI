import { MongoClient } from "mongodb";

/**
 * Endpoint to create a new route group.
 *
 * Request method: POST
 * Request payload: JSON object with an array of route objects
 * Response: JSON object with a success message and the ID of the newly created route group
 *
 * Example request:
 *
 * POST http://localhost:3000/api/create-route
 * Content-Type: application/json
 *
 * {
 *   "routes": [
 *     {
 *       "name": "Route 1",
 *       "address": "123 Main St",
 *       "latitude": "37.7749",
 *       "longitude": "-122.4194"
 *     },
 *     {
 *       "name": "Route 2",
 *       "address": "456 Main St",
 *       "latitude": "37.7749",
 *       "longitude": "-122.4194"
 *     }
 *   ]
 * }
 *
 * Example response:
 *
 * HTTP/1.1 201 Created
 * Content-Type: application/json
 *
 * {
 *   "message": "Route created",
 *   "routeId": "643858bf4e2031db4a281d2c"
 * }
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400).json({ message: "Invalid request method" });
    return;
  }

  const { routes } = req.body;

  if (!Array.isArray(routes)) {
    res.status(400).json({ message: "Invalid payload format" });
    return;
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the database and collection
    const db = client.db("onceuponai");
    const collection = db.collection("routes");

    // Create a new document in the collection
    const result = await collection.insertOne({ routes });

    // Respond with the new document
    res.status(201).json({ message: "Route created", routeId: result.insertedId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    // Close the connection when finished
    await client.close();
  }
}
