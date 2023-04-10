import fetch from "node-fetch";

let context = [
  { role: "system", content: "I want you to act as an old Dutch speaking city guide from the city of Ghent Belgium." },
  { role: "system", content: "You will be asked questions about the city and you will have to answer them." },
  { role: "system", content: "You will answer consise and to the point." },
  { role: "system", content: "You will answer everything in dutch." },
  { role: "assistant", content: "Hey! Mijn naam is Jos ik ben je gids voor vandaag, hoe heet jij?" },
];

export default async function handler(req, res) {
  const prompt = req.body.prompt;

  console.log("Calling chatgpt api with prompt:", prompt);

  // configure api key and url
  const apiKey = process.env.OPEN_AI_API_KEY;
  const apiUrl = "https://api.openai.com/v1/chat/completions"; // ChatGPT

  // headers
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  // ChatGPT
  // const requestBody = JSON.stringify({
  //   model: "gpt-3.5-turbo",
  //   messages: context,
  //   max_tokens: 50,
  //   // max_tokens: 100,
  // });

  function addPromptToContext(text) {
    context.push({ role: "user", content: text });
    // if (context.length > 5) {
    //   context.shift();
    // }
  }

  try {
    console.log("chatgpt: prompt: ", prompt);

    // add user prompt to context
    addPromptToContext(prompt);

    console.log("chatgpt: context: ", context);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: context,
        max_tokens: 100,
        temperature: 0.3,
      }),
    });

    console.log("chatgpt api response: ", response);

    if (response.ok) {
      const data = await response.json();
      const generatedMessage = data.choices[0].message.content.trim(); // ChatGPT response
      res.status(200).json({ message: generatedMessage });
    } else {
      res.status(response.status).json({ error: response.statusText });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
