import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { searchKnowledgeBase } from './tommy-knowledge';
import type { ChatTurnDto } from './dto/ask-tommy.dto';

export type TommySource = { label: string; url: string };

export type TommyAnswer = {
  answer: string;
  sources: TommySource[];
};

const TOMMY_PERSONA = `You are Tommy, the friendly guide built into the Intern Bangla website - a platform connecting Bangladeshi students with internships and companies. You help visitors understand how the site works, and also give real, thoughtful advice on careers, resumes, interviews, and learning to code, the way any capable assistant would.

You'll sometimes be given "Retrieved context" pulled from Intern Bangla's own pages or Wikipedia. Use it when it's relevant and mention it naturally, but you are not limited to it - use your own knowledge freely to actually help the person, give concrete solutions, and hold a normal back-and-forth conversation. Keep replies concise (2-5 sentences unless the question needs more) and warm, not robotic.`;

@Injectable()
export class TommyService {
  private readonly logger = new Logger(TommyService.name);

  constructor(private readonly configService: ConfigService) {}

  async ask(question: string, history: ChatTurnDto[] = []): Promise<TommyAnswer> {
    const trimmed = question.trim();
    if (!trimmed) {
      return {
        answer: "Ask me anything about Intern Bangla - how to register, apply, get verified, or just what a term means.",
        sources: [],
      };
    }

    // Gather grounding context up front - our own content first, Wikipedia
    // as a fallback - regardless of which engine answers with it.
    const localMatches = searchKnowledgeBase(trimmed);
    const sources: TommySource[] = localMatches.map((m) => ({
      label: `Intern Bangla: ${m.title}`,
      url: m.url,
    }));
    let context = localMatches.map((m) => m.answer).join('\n\n');

    if (!context) {
      const wiki = await this.searchWikipedia(trimmed);
      if (wiki) {
        context = wiki.answer;
        sources.push({ label: `Wikipedia: ${wiki.title}`, url: wiki.url });
      }
    }

    // Prefer a real conversational LLM when one is configured - this is
    // what makes Tommy an actual agent rather than a lookup table.
    const llmReply =
      (await this.tryAnthropic(trimmed, history, context)) ??
      (await this.tryGemini(trimmed, history, context)) ??
      (await this.tryDeepSeek(trimmed, history, context));

    if (llmReply) {
      return { answer: llmReply, sources };
    }

    // No LLM configured - fall back to returning the retrieved context
    // directly, plus Google Custom Search if that's configured.
    if (context) {
      return { answer: context, sources };
    }

    const googleResult = await this.tryGoogleSearch(trimmed);
    if (googleResult) return googleResult;

    return {
      answer:
        "I couldn't find anything about that on Intern Bangla or Wikipedia. Try rephrasing your question, or reach our team from the Contact page. (Tip for the site owner: add ANTHROPIC_API_KEY, GEMINI_API_KEY, or DEEPSEEK_API_KEY to .env so Tommy can hold a real conversation.)",
      sources: [{ label: 'Contact Us', url: '/contact' }],
    };
  }

  private toAnthropicMessages(history: ChatTurnDto[], question: string) {
    const messages = history.map((h) => ({
      role: h.role === 'user' ? ('user' as const) : ('assistant' as const),
      content: h.text,
    }));
    messages.push({ role: 'user', content: question });
    return messages;
  }

  /** Primary engine - only runs if ANTHROPIC_API_KEY is configured. */
  private async tryAnthropic(
    question: string,
    history: ChatTurnDto[],
    context: string,
  ): Promise<string | null> {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) return null;

    try {
      const system = context
        ? `${TOMMY_PERSONA}\n\nRetrieved context for this question:\n${context}`
        : TOMMY_PERSONA;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.configService.get<string>('ANTHROPIC_MODEL', 'claude-haiku-4-5-20251001'),
          max_tokens: 500,
          system,
          messages: this.toAnthropicMessages(history, question),
        }),
      });
      if (!res.ok) {
        this.logger.warn(`Anthropic API returned ${res.status}: ${await res.text()}`);
        return null;
      }
      const data = await res.json();
      const text = data?.content?.[0]?.text;
      return typeof text === 'string' ? text.trim() : null;
    } catch (error) {
      this.logger.warn(`Anthropic call failed: ${error}`);
      return null;
    }
  }

  /** Secondary engine - only runs if GEMINI_API_KEY is configured. */
  private async tryGemini(
    question: string,
    history: ChatTurnDto[],
    context: string,
  ): Promise<string | null> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) return null;

    try {
      const contents = history.map((h) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      }));
      contents.push({ role: 'user', parts: [{ text: question }] });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: context ? `${TOMMY_PERSONA}\n\nRetrieved context:\n${context}` : TOMMY_PERSONA }],
            },
            contents,
          }),
        },
      );
      if (!res.ok) return null;
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return typeof text === 'string' ? text.trim() : null;
    } catch (error) {
      this.logger.warn(`Gemini call failed: ${error}`);
      return null;
    }
  }

  /** Third-choice engine - only runs if DEEPSEEK_API_KEY is configured. */
  private async tryDeepSeek(
    question: string,
    history: ChatTurnDto[],
    context: string,
  ): Promise<string | null> {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    if (!apiKey) return null;

    try {
      const system = context
        ? `${TOMMY_PERSONA}\n\nRetrieved context for this question:\n${context}`
        : TOMMY_PERSONA;

      const messages = [
        { role: 'system', content: system },
        ...history.map((h) => ({
          role: h.role === 'user' ? ('user' as const) : ('assistant' as const),
          content: h.text,
        })),
        { role: 'user', content: question },
      ];

      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: this.configService.get<string>('DEEPSEEK_MODEL', 'deepseek-chat'),
          max_tokens: 500,
          messages,
        }),
      });
      if (!res.ok) {
        this.logger.warn(`DeepSeek API returned ${res.status}: ${await res.text()}`);
        return null;
      }
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      return typeof text === 'string' ? text.trim() : null;
    } catch (error) {
      this.logger.warn(`DeepSeek call failed: ${error}`);
      return null;
    }
  }

  private async searchWikipedia(
    query: string,
  ): Promise<{ title: string; answer: string; url: string } | null> {
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query,
      )}&format=json&origin=*&srlimit=1`;
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) return null;
      const searchData = await searchRes.json();
      const title = searchData?.query?.search?.[0]?.title;
      if (!title) return null;

      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const summaryRes = await fetch(summaryUrl);
      if (!summaryRes.ok) return null;
      const summary = await summaryRes.json();
      if (!summary?.extract) return null;

      return {
        title: summary.title ?? title,
        answer: summary.extract,
        url: summary.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      };
    } catch (error) {
      this.logger.warn(`Wikipedia lookup failed: ${error}`);
      return null;
    }
  }

  /**
   * Only runs if GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_CX are configured
   * (Google Custom Search JSON API - requires a Programmable Search Engine).
   */
  private async tryGoogleSearch(query: string): Promise<TommyAnswer | null> {
    const apiKey = this.configService.get<string>('GOOGLE_SEARCH_API_KEY');
    const cx = this.configService.get<string>('GOOGLE_SEARCH_CX');
    if (!apiKey || !cx) return null;

    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const items = (data?.items ?? []) as { title: string; link: string; snippet: string }[];
      if (items.length === 0) return null;

      return {
        answer: items[0].snippet,
        sources: items.map((i) => ({ label: i.title, url: i.link })),
      };
    } catch (error) {
      this.logger.warn(`Google Search failed: ${error}`);
      return null;
    }
  }
}
