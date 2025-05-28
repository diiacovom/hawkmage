const { Configuration, OpenAIApi } = require('openai');

// simple in-memory rate limiting
const rateLimitMap = {};
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

exports.handler = async (event) => {
  const ip = event.requestContext && event.requestContext.identity ? event.requestContext.identity.sourceIp : 'unknown';
  const currentTime = Date.now();
  const requests = rateLimitMap[ip] || [];
  rateLimitMap[ip] = requests.filter(ts => currentTime - ts < RATE_LIMIT_WINDOW_MS);
  if (rateLimitMap[ip].length >= MAX_REQUESTS_PER_WINDOW) {
    return {
      statusCode: 429,
      body: JSON.stringify({ error: 'Too many requests' })
    };
  }
  rateLimitMap[ip].push(currentTime);

  console.log('Incoming request:', event.body);
  const data = JSON.parse(event.body);
  const prompt = generatePrompt(data);

  const apiKey = process.env.OPENAI_API_KEY;
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 500
    });
    const yaml = completion.data.choices[0].text.trim();
    return {
      statusCode: 200,
      body: JSON.stringify({ yaml })
    };
  } catch (err) {
    console.error('OpenAI error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate YAML' })
    };
  }
};

function generatePrompt(data) {
  const entries = Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  return `Given the following inputs, generate a StackHawk YAML config file:\n${entries}`;
}
