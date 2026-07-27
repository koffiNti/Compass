from typing import Optional
from app.ai_providers.base import BaseAIProvider
from app.ai_providers.openai_provider import OpenAIProvider
from app.ai_providers.anthropic_provider import AnthropicProvider
from app.ai_providers.gemini_provider import GeminiProvider
from app.ai_providers.local_provider import LocalProvider
from app.ai_providers.openrouter_provider import OpenRouterCustomProvider
from app.core.config import settings

class AIProviderFactory:
    @staticmethod
    def get_provider(
        provider_name: Optional[str] = None,
        model_name: Optional[str] = None,
        api_key: Optional[str] = None,
        custom_base_url: Optional[str] = None
    ) -> BaseAIProvider:
        name = (provider_name or settings.DEFAULT_AI_PROVIDER).lower().strip()

        if name == "anthropic":
            return AnthropicProvider(api_key=api_key, model=model_name)
        elif name == "gemini":
            return GeminiProvider(api_key=api_key, model=model_name)
        elif name == "local":
            return LocalProvider(base_url=custom_base_url)
        elif name == "openrouter" or name == "custom":
            return OpenRouterCustomProvider(api_key=api_key, model=model_name, custom_base_url=custom_base_url)
        else:
            return OpenAIProvider(api_key=api_key, model=model_name)
