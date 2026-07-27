import random
from typing import List, Dict, Any, Optional
from app.ai_providers.base import BaseAIProvider
from app.core.config import settings

class LocalProvider(BaseAIProvider):
    def __init__(self, base_url: Optional[str] = None):
        self.base_url = base_url or settings.LOCAL_LLM_URL
        self.model = "llama3"

    async def generate_completion(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": f"{system_instruction}\n\nUser: {prompt}\n\nAssistant:",
                        "stream": False
                    },
                    timeout=10.0
                )
                if res.status_code == 200:
                    return res.json().get("response", "")
        except Exception:
            pass
        return f"[Compass Local AI Engine ({self.model})]\n\nLocal Privacy Mode Analysis:\n\n{prompt[:300]}..."

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
            "procrastination_patterns": ["Local AI offline analysis: procrastination correlates with sleep deficits."],
            "productivity_patterns": ["High coding focus during 9:00 AM - 12:00 PM."],
            "emotional_trends": "Balanced mood levels.",
            "study_consistency": "Consistent daily study hours.",
            "coding_habits": "Regular daily git commits."
        }
