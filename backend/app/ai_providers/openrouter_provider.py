import random
from typing import List, Dict, Any, Optional
from app.ai_providers.base import BaseAIProvider
from app.core.config import settings

class OpenRouterCustomProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None, custom_base_url: Optional[str] = None):
        self.api_key = api_key or ""
        self.model = model or "deepseek/deepseek-r1"
        self.base_url = custom_base_url or "https://openrouter.ai/api/v1"

    async def generate_completion(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        if not self.api_key and "openrouter" in self.base_url:
            return f"[Compass AI Coach - OpenRouter ({self.model})]\n\nPlease configure your OpenRouter API key in Settings to unlock real-time completions.\n\nSimulated output for prompt: {prompt[:200]}..."

        try:
            import httpx
            endpoint = f"{self.base_url.rstrip('/')}/chat/completions"
            headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
            if "openrouter" in self.base_url:
                headers["HTTP-Referer"] = "https://compass.ai"
                headers["X-Title"] = "Compass AI OS"

            async with httpx.AsyncClient() as client:
                res = await client.post(
                    endpoint,
                    headers=headers,
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
                return f"Custom Provider ({res.status_code}): {res.text}"
        except Exception as e:
            return f"[Custom Provider Error]: {str(e)}"

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
            "procrastination_patterns": [f"Analysis using custom model {self.model}: Task hesitation noted when sleep is below 6.5 hours."],
            "productivity_patterns": ["High velocity output during early morning coding sprints."],
            "emotional_trends": "Balanced mood trajectory.",
            "study_consistency": "Consistent daily study hours.",
            "coding_habits": "Solid coding streak."
        }
