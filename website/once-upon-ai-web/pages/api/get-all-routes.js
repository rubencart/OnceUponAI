import { MongoClient } from "mongodb";

/**
 * Endpoint to get all route groups.
 *
 * Request method: GET
 * Response: JSON object with an array of route groups
 *
 * Example request:
 *
 * GET http://localhost:3000/api/get-routes
 *
 * Example response:
 *
 * HTTP/1.1 200 OK
 * Content-Type: application/json
 *
 * [
 *   {
 *     "_id": "614f60f1a90e8d8aa09b7fde",
 *     "routeObjects": [
 *       {
 *         "object_id": "aaa",
 *         "coordinates": [1.0101, 5.002],
 *         "description": "lqlqlqlq",
 *         "image_url": "https://loremflickr.com/640/480/gent,art",
 *         "tags": ["19e eeuw", "lol"]
 *       },
 *       {
 *         "object_id": "aaa",
 *         "coordinates": [1.0101, 5.002],
 *         "description": "lqlqlqlq",
 *         "image_url": "https://loremflickr.com/640/480/gent,art",
 *         "tags": ["19e eeuw", "lol"]
 *       }
 *     ],
 *     "createdAt": "2021-09-24T14:16:33.145Z",
 *     "updatedAt": "2021-09-24T14:16:33.145Z",
 *     "__v": 0
 *   },
 *   {
 *     "_id": "614f61c4a90e8d8aa09b7fdf",
 *     "routeObjects": [
 *       {
 *         "object_id": "aaa",
 *         "coordinates": [1.0101, 5.002],
 *         "description": "lqlqlqlq",
 *         "image_url": "https://loremflickr.com/640/480/gent,art",
 *         "tags": ["19e eeuw", "lol"]
 *       },
 *       {
 *         "object_id": "aaa",
 *         "coordinates": [1.0101, 5.002],
 *         "description": "lqlqlqlq",
 *         "image_url": "https://loremflickr.com/640/480/gent,art",
 *         "tags": ["19e eeuw", "lol"]
 *       }
 *     ],
 *     "createdAt": "2021-09-24T14:20:04.934Z",
 *     "updatedAt": "2021-09-24T14:20:04.934Z",
 *     "__v": 0
 *   }
 * ]
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(400).json({ message: "Invalid request method" });
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

    // Get all documents in the collection
    const result = await collection.find().toArray();

    // Respond with the documents
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    // Close the connection when finished
    await client.close();
  }
}
