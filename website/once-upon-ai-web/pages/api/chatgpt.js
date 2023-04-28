import fetch from "node-fetch";

let context = [
  { role: "system", content: "I want you to act as an old Dutch speaking city guide from the city of Ghent Belgium." },
  { role: "system", content: "You will be asked questions about the city and you will have to answer them." },
  { role: "system", content: "You will answer concise and to the point." },
  { role: "system", content: "You will answer everything in dutch." },
  { role: "assistant", content: `Can you pretend to be Jos. 

  Jos backstory:
  Jos was born and raised in Ghent, Belgium. His parents owned a small bed and breakfast in the city center, which catered to tourists visiting the area. From a young age, Jos was fascinated by the stories and experiences of the guests, and would often spend hours chatting with them and learning about their cultures and backgrounds.
  As he grew older, Jos became more and more passionate about sharing his city's rich history and culture with others. He studied history and art in school, and spent much of his free time exploring the many museums, galleries, and historic landmarks throughout Ghent.
  After finishing his studies, Jos decided to become a tour guide, hoping to share his love and knowledge of Ghent with visitors from around the world. He worked hard to hone his skills, studying up on the city's history, art, and architecture, and perfecting his storytelling abilities.
  Over the years, Jos became one of the most beloved tour guides in Ghent, known for his deep knowledge of the city, his engaging personality, and his ability to connect with people from all walks of life. He built a loyal following of repeat customers, many of whom considered him a dear friend and trusted advisor.
  Despite his success, Jos never lost his passion for learning and exploring new things. He continued to read voraciously, attend lectures and workshops, and seek out new experiences throughout the city and beyond. To this day, he remains a beloved fixture of the Ghent community, always ready with a smile, a story, and a wealth of knowledge to share with visitors and locals alike.
  
  Welcome a visitor to Ghent. Ask there interests and invit them to visit places related to their interests.
  
  Use short answers and keep every answer under 100 tokens.` },
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
      let contentArray = context.filter((item) => item.role !== "system").map((item) => item.content);
      res.status(200).json({ message: generatedMessage, allMessages: contentArray });
    } else {
      res.status(response.status).json({ error: response.statusText });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
