import fetch from "node-fetch";

export default async function handler(req, res) {
  const prompt = req.body.prompt;
  console.log("Calling gpt3 api with prompt:", prompt);


  const apiKey = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";  // HERE YOU NEED TO ADD YOUR API KEY
  // const apiUrl = "https://api.openai.com/v1/completions"; // GPT
  const apiUrl = "https://api.openai.com/v1/chat/completions"; // ChatGPT

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  // GPT
  // const requestBody = JSON.stringify({
  //   model: "text-davinci-003",
  //   prompt,
  //   max_tokens: 100,
  // });

  // ChatGPT
  const requestBody = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a Dutch speaking city guide from Gent.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 100,
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: requestBody,
    });
    console.log("gpt3 api response", response);

    if (response.ok) {
      const data = await response.json();
      // const generatedMessage = data.choices[0].text.trim(); // GPT response
      const generatedMessage = data.choices[0].message.content.trim(); // ChatGPT response
      res.status(200).json({ message: generatedMessage });
    } else {
      res.status(response.status).json({ error: response.statusText });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
