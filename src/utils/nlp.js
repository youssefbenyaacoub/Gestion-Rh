import intentsData from '../data/intents.json';

export function detectIntent(input) {
  const intents = intentsData.intents;
  const lowerInput = input.toLowerCase();
  let bestMatch = null;
  let longestPatternLength = 0;

  for (let intent of intents) {
    for (let pattern of intent.patterns) {
      if (lowerInput.includes(pattern.toLowerCase())) {
        if (pattern.length > longestPatternLength) {
          longestPatternLength = pattern.length;
          bestMatch = {
            tag: intent.tag,
            response: intent.responses[Math.floor(Math.random() * intent.responses.length)],
            suggestions: intent.suggestions || []
          };
        }
      }
    }
  }

  if (bestMatch) {
    return bestMatch;
  }

  return {
    tag: 'unknown',
    response: "Désolé, je n'ai pas compris. Pouvez-vous reformuler ?",
    suggestions: ["Aide", "Menu"]
  };
}