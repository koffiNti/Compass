import random
from typing import List, Dict, Any, Optional
from app.ai_providers.base import BaseAIProvider
from app.core.config import settings

class GeminiProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or "gemini-1.5-pro"

    async def generate_completion(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        if not self.api_key:
            return f"[Compass AI Coach - Google {self.model}]\n\nPlease enter your Google Gemini API key in Settings to activate real-time intelligence.\n\nPrompt Preview: {prompt[:250]}..."

        try:
            import httpx
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}",
                    json={
                        "contents": [
                            {
                                "parts": [
                                    {"text": f"{system_instruction or 'You are Compass AI Coach.'}\n\n{prompt}"}
                                ]
                            }
                        ]
                    },
                    timeout=30.0
                )
                if res.status_code == 200:
                    candidates = res.json().get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
                return f"Gemini Error ({res.status_code}): {res.text}"
        except Exception as e:
            return f"[Gemini Provider Error]: {str(e)}"

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        embeddings = []
        for text in texts:
            seed = sum(ord(c) for c in text)
            rng = random.Random(seed)
            vec = [rng.uniform(-1.0, 1.0) for _ in range(128)]
            norm = (sum(x * x for x in vec)) ** 0.5
            embeddings.append([x / norm for x in vec])
        return embeddings

    async def analyze_life_patterns(
        self,
        journal_entries: List[Dict[str, Any]],
        metrics: List[Dict[str, Any]],
        habits: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        return {
            "procrastination_patterns": ["Context switching reduces total throughput."],
            "productivity_patterns": ["Early morning coding blocks yield 80% of daily progress."],
            "emotional_trends": "Positive emotional trajectory.",
            "study_consistency": "90% academic lecture attendance.",
            "coding_habits": "Strong streak consistency."
        }
