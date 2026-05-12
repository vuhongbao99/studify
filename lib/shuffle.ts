import type { Card } from "@/types/study";

export function shuffleCards(cards: Card[], seed = Date.now()): Card[] {
  const output = [...cards];
  let random = seed % 2147483647;
  if (random <= 0) random += 2147483646;

  for (let i = output.length - 1; i > 0; i -= 1) {
    random = (random * 16807) % 2147483647;
    const j = random % (i + 1);
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}
