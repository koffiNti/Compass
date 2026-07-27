from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class BaseAIProvider(ABC):
    @abstractmethod
    async def generate_completion(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        pass

    @abstractmethod
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        pass

    @abstractmethod
    async def analyze_life_patterns(
        self,
        journal_entries: List[Dict[str, Any]],
        metrics: List[Dict[str, Any]],
        habits: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        pass
