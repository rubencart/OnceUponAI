import { MongoClient, ObjectId } from "mongodb";

/**
 * Endpoint to get a single route group by ID.
 *
 * Request method: GET
 * Request parameter: ID of the route group
 * Response: JSON object with details of the route group, including its ID
 *
 * Example request:
 *
 * GET http://localhost:3000/api/get-route/614f60f1a90e8d8aa09b7fde
 *
 * Example response:
 *
 * HTTP/1.1 200 OK
 * Content-Type: application/json
 *
 * {
 *   "_id": "614f60f1a90e8d8aa09b7fde",
 *   "routeObjects": [
 *      {
 *        "object_id": "550016631",
 *        "title": "Titel van het object",
 *        "coordinates": [51.06783069999999, 3.7290914],
 *        "description": "Een uitleg over het object",
 *        "address": "9000 Ghent, Belgium",
 *        "image_url": null,
 *        "location_link": "ChatGPT",
 *        "collection": "stam"
 *      }
 *   ],
 *   "createdAt": "2021-09-24T14:16:33.145Z",
 *   "updatedAt": "2021-09-24T14:16:33.145Z",
 *   "__v": 0
 * }
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export default async function handler(req, res) {
  console.log("in get-route");
  if (req.method !== "GET") {
    res.status(400).json({ message: "Invalid request method" });
    return;
  }

  const { routeId } = req.query;
  console.log("getting route for id:", routeId);

  if (!routeId) {
    res.status(400).json({ message: "Missing route group ID" });
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

    // Get the document with the specified ID
    const result = await collection.findOne({ _id: new ObjectId(routeId) });

    // Respond with the document
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    // Close the connection when finished
    await client.close();
  }
}
