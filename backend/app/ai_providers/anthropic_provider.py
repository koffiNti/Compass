import random
from typing import List, Dict, Any, Optional
from app.ai_providers.base import BaseAIProvider
from app.core.config import settings

class AnthropicProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.ANTHROPIC_API_KEY
        self.model = model or "claude-3-5-sonnet-20241022"

    async def generate_completion(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        if not self.api_key:
            return f"[Compass AI Coach - Anthropic {self.model}]\n\nPlease enter your Anthropic API key in Settings to activate real-time intelligence.\n\nPrompt Preview: {prompt[:250]}..."
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": self.api_key,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "max_tokens": 1024,
                        "system": system_instruction or "You are Compass AI Coach.",
                        "messages": [{"role": "user", "content": prompt}]
                    },
                    timeout=30.0
                )
                if res.status_code == 200:
                    return res.json()["content"][0]["text"]
                return f"Anthropic Error ({res.status_code}): {res.text}"
        except Exception as e:
            return f"[Anthropic Provider Error]: {str(e)}"

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
            "procrastination_patterns": ["Delayed start on complex software architecture tasks when sleep is below 6.5h."],
            "productivity_patterns": ["Highest output in uninterrupted 2-hour coding blocks."],
            "emotional_trends": "Calm and focused baseline.",
            "study_consistency": "Consistent daily learning rhythm.",
            "coding_habits": "Solid multi-hour deep work consistency."
        }
