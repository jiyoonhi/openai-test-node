import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid message",
      }
    });
    return;
  }

  try {
    const response = await openai.createImage({
      prompt: generatePrompt(prompt),
      n: 1,
      size: "512x512",
    });
    res.status(200).json({ result: response.data.data[0].url });
  } catch (error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
  }
}

function generatePrompt(prompt) {
  const movieNames = prompt.split(',').map(movie => movie.trim());
  if(movieNames.length < 2){
    throw new Error("Please provide at least two movies.");
  }
  return `Create a new movie character that embodies the spirit and style of the main characters from ${movieNames[0]} and ${movieNames[1]}, as a realistic individual.`;
}
