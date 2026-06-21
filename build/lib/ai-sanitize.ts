/** Remove MiniMax thinking/reasoning blocks from model output. */
export function stripAiReasoning(text: string): string {
  if (!text) return text;
  return text
    .replace(/<think>[\s\S]*?<\/redacted_thinking>\s*/gi, "")
    .replace(/[\s\S]*?<\/think>\s*/gi, "")
    .replace(/<thinking>[\s\S]*?<\/thinking>\s*/gi, "")
    .replace(/<reasoning>[\s\S]*?<\/reasoning>\s*/gi, "")
    .trim();
}
