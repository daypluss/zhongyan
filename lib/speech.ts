export function speak(text: string, rate = 0.86) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
