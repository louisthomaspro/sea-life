import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: "key",
})

// https://community.openai.com/t/gpt-4-vision-preview-with-response-format/620476

// description are better with smaller prompt. Should I run twice the model ?
// elongated instead of fusiform sometimes
async function describe(speciesObject: { scientificName: string; urls: string[] }) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: {
      type: "json_object",
    },
    logit_bias: {
      63: -100,
      14196: -100,
      74694: -100,
    },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
            Analyze the provided images and return a JSON object containing the following details about the fish species present in the images:

            1. Colors: An array listing the colors of the fish. Be careful with the light and shadow.
            Use only the allowed colors: red, green, blue, yellow, purple, orange, black, white, gray, brown, pink, cyan.

            2. Patterns: An array listing the the patterns observed on the fish.
            Use only the allowed patterns: blotches-or-dots, vertical-marking, horizontal-marking, reticulations-pattern, oblique-markings, streaks-pattern, banded-pattern, grid-pattern, chevrons-pattern, camouflage-pattern, tubercles-pattern, spines-pattern, barbels-pattern, none.

            3. Caudal Fin Shape: The shape of the caudal fin (tail fin) of the fish.
            Use only the allowed shapes: rounded, forked, truncated, pointed, lunate. This field can be null if the caudal fin is not visible in the images.

            4. Body Shape: The shape of the body of the fish.
            Use only the allowed shapes: fusiform, compressed, elongated, globelike, anguilliform, flat, rectangular, other.

            Ensure the response starts with the character "{" to produce valid JSON.

            Example of the expected JSON object:
            {
              "colors": ["red", "blue", "green"],
              "patterns": ["blotches-or-dots", "vertical-marking"],
              "caudal_fin_shape": "rounded",
              "body_shape": "elongated",
            }
          `,
          },
          ...speciesObject.urls.map(
            (url) =>
              ({
                type: "image_url",
                image_url: {
                  url,
                },
              }) as any
          ),
        ],
      },
    ],
  })
  console.log(speciesObject.scientificName)
  console.log(JSON.parse(response.choices[0].message.content!))
  return response.usage
}

function main() {
  const species = [
    {
      scientificName: "Apolemichthys Xanthotis",
      urls: [
        "https://d20kolehhc2yw3.cloudfront.net/public/94418/ce3c0987-2906-4023-bb59-05e103434433.jpeg?format=auto&quality=75&width=640",
        "https://d20kolehhc2yw3.cloudfront.net/public/94418/9a6b3f15-f3c5-47f2-8e8d-4b5f0ed5d157.jpeg?format=auto&quality=75&width=640",
      ],
    },
    // "https://d20kolehhc2yw3.cloudfront.net/public/118610/786f2116-e52e-4ca0-b264-d2f33b3c795f.jpeg?format=auto&quality=75&width=640",
    // "https://d20kolehhc2yw3.cloudfront.net/public/121321/883d26cf-cf14-477c-96a1-4c097982ba83.jpeg?format=auto&quality=75&width=640",
    // "https://d20kolehhc2yw3.cloudfront.net/public/69675/1f53f02b-d6ef-41cf-9d33-807a3a85cd4e.jpeg?format=auto&quality=75&width=640",
    // "https://d20kolehhc2yw3.cloudfront.net/public/187006/70d43efd-7d50-4318-8778-1d3bb9e1c4e9.jpeg?format=auto&quality=75&width=640",
    // "https://d20kolehhc2yw3.cloudfront.net/public/54679/5903405e-949e-47c0-803f-1e773f8ee306.jpeg?format=auto&quality=75&width=640",
    // "https://d20kolehhc2yw3.cloudfront.net/public/119428/c7712ca4-8bed-461e-a20d-e73ba46c279f.jpeg?format=auto&quality=75&width=640",
    // "https://d20kolehhc2yw3.cloudfront.net/public/119385/811d4106-971a-4e83-b49f-82a80aaef199.jpeg?format=auto&quality=75&width=640",
    // "https://d20kolehhc2yw3.cloudfront.net/public/343229/fa24f4e0-345f-49f9-bbbe-a355dbc6b7b6.jpeg?format=auto&quality=75&width=640",
    // "https://d20kolehhc2yw3.cloudfront.net/public/49639/37da50c0-c40f-4ef2-b802-e0f1b7f01c52.jpeg?format=auto&quality=75&width=640",
    // "https://d20kolehhc2yw3.cloudfront.net/public/84181/1f6fd165-29d7-45bf-a1c4-6ee3aa6eee89.jpeg?format=auto&quality=75&width=640",
  ]

  Promise.all(species.map(describe)).then((responses) => {
    // sum up the usages
    const totalUsage = responses.reduce((acc, reponse) => acc + (reponse?.total_tokens ?? 0), 0)
    console.log(`Total tokens used: ${totalUsage} for ${responses.length} images`)
  })
}

main()
