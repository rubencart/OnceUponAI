// import fetch from "node-fetch";

// export default async function handler(req, res) {
//   const prompt = req.body.prompt;

//   console.log("Calling gpt3 api with prompt:", prompt);

//   // configure api key and url
//   const apiKey = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";  // HERE YOU NEED TO ADD YOUR API KEY
//   const apiUrl = "https://api.openai.com/v1/completions"; // GPT

//   // headers
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${apiKey}`,
//   };

//   const requestBody = JSON.stringify({
//     model: "text-davinci-003",
//     prompt,
//     max_tokens: 100,
//   });

//   try {
//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: headers,
//       body: requestBody,
//     });
//     console.log("gpt3 api response", response);

//     if (response.ok) {
//       const data = await response.json();
//       const generatedMessage = data.choices[0].text.trim(); // GPT response
//       res.status(200).json({ message: generatedMessage });
//     } else {
//       res.status(response.status).json({ error: response.statusText });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }
