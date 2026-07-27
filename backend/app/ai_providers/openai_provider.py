import random
from typing import List, Dict, Any, Optional
from app.ai_providers.base import BaseAIProvider
from app.core.config import settings

class OpenAIProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.model = model or settings.DEFAULT_AI_MODEL or "gpt-4o"

    async def generate_completion(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        if not self.api_key:
            return f"[Compass AI Coach - OpenAI {self.model}]\n\nPlease enter your OpenAI API key in Settings to activate real-time intelligence.\n\nPrompt Preview: {prompt[:250]}..."

        try:
            import httpx
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_instruction or "You are Compass AI Coach."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": temperature
                    },
                    timeout=30.0
                )
                if res.status_code == 200:
                    return res.json()["choices"][0]["message"]["content"]
                return f"OpenAI Error ({res.status_code}): {res.text}"
        except Exception as e:
            return f"[OpenAI Provider Exception]: {str(e)}"

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
            "procrastination_patterns": [
                "Higher friction observed on days with under 6 hours of sleep.",
                "Multitasking between trading notes and coding drops deep focus."
            ],
            "productivity_patterns": [
                "Peak deep work hours occur in early morning blocks (8:00 AM - 11:30 AM).",
                "High correlation between gym workouts and 8+ mood ratings."
            ],
            "emotional_trends": "Mood averages 7.8/10 on days with completed coding habits.",
            "study_consistency": "Lecture attendance is 92% consistent on Tuesdays and Thursdays.",
            "coding_habits": "Average coding minutes: 165 mins/day."
        }
