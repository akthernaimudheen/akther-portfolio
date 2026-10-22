export type ArticleCategory =
  | 'Applied AI & NLP'
  | 'Systems & Backend'
  | 'Full-Stack Architecture'
  | 'Quality & Engineering';

export type ArticleStatus = 'published-case-study' | 'engineering-note';

export interface ArticleCodeBlock {
  language: string;
  code: string;
  caption?: string;
}

export interface ArticleCallout {
  type: 'note' | 'warning' | 'tip';
  title?: string;
  text: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  codeBlock?: ArticleCodeBlock;
  callout?: ArticleCallout;
  listItems?: string[];
}

export interface Article {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  publishedAt: string; // ISO YYYY-MM-DD
  updatedAt?: string;
  readTime: string;
  category: ArticleCategory;
  tags: string[];
  status: ArticleStatus;
  statusLabel: string;
  featured?: boolean;
  renderMode: 'component' | 'structured';
  componentName?: 'ClinicalAiArticle';
  sections?: ArticleSection[];
}

export const articleCategories: ArticleCategory[] = [
  'Applied AI & NLP',
  'Systems & Backend',
  'Full-Stack Architecture',
  'Quality & Engineering',
];

export const articles: Article[] = [
  {
    slug: 'building-clinical-ai-beyond-transcription',
    title: 'Building AI Clinical Documentation Beyond Transcription: Engineering Guardrails for Clinical Fact Extraction',
    eyebrow: 'Engineering Case Study · Applied Clinical NLP',
    description:
      'Speech recognition does not solve medical documentation. An engineering case study on combining deterministic NLP guardrails, verbatim span tracking, and schema validation to extract structured clinical facts while eliminating unprompted model fabrications.',
    publishedAt: '2026-10-18',
    updatedAt: '2026-10-19',
    readTime: '14 min read',
    category: 'Applied AI & NLP',
    tags: [
      'Clinical NLP',
      'Schema Validation',
      'Deterministic Guardrails',
      'Speech-to-Text Pipeline',
      'Ollama Benchmark',
    ],
    status: 'published-case-study',
    statusLabel: 'Published Technical Case Study',
    featured: true,
    renderMode: 'component',
    componentName: 'ClinicalAiArticle',
  },
  {
    slug: 'architecting-asynchronous-video-pipelines-fastapi-ffmpeg',
    title: 'Architecting Asynchronous Video Processing Pipelines with FastAPI, Task Queues, and Headless FFmpeg',
    eyebrow: 'Systems Architecture · Media Automation',
    description:
      'How to decouple compute-intensive media rendering jobs from HTTP request-response cycles using FastAPI background workers, word-level audio synchronization, and idempotent FFmpeg filtergraph construction.',
    publishedAt: '2026-09-28',
    updatedAt: '2026-10-02',
    readTime: '9 min read',
    category: 'Systems & Backend',
    tags: [
      'FastAPI',
      'Python',
      'FFmpeg',
      'Worker Queues',
      'Audio-Visual Sync',
      'Subtitling',
    ],
    status: 'engineering-note',
    statusLabel: 'Engineering Note (PromptToShort Architecture)',
    featured: true,
    renderMode: 'structured',
    sections: [
      {
        heading: '1. The Concurrency Bottleneck in Media Processing',
        paragraphs: [
          'Media processing is inherently CPU and memory intensive. When building PromptToShort (originally RShorts), the earliest design mistake was executing audio transcription, waveform synthesis, and FFmpeg composition inside the primary FastAPI application process.',
          'Under standard WSGI/ASGI configurations, long-running subprocess calls quickly tie up worker threads, causing HTTP request timeouts and catastrophic queue stalling. To achieve reliable throughput, the media transformation pipeline had to be completely decoupled into asynchronous queue workers.',
        ],
        callout: {
          type: 'warning',
          title: 'Subprocess Deadlocks',
          text: 'Spawning child FFmpeg processes using Python standard subprocess without redirecting or draining stderr pipes will deadlock when output buffers exceed default pipe capacities (typically 64KB on Linux). Always stream stderr asynchronously.',
        },
      },
      {
        heading: '2. Sub-12ms Drift Tolerance for Kinetic Subtitling',
        paragraphs: [
          'A key technical challenge in automated short-form video creation is timing precision. Viewers immediately notice when word highlights or bounding boxes lag behind spoken dialogue.',
          'To achieve frame-accurate synchronization, the transcription pipeline normalizes word timestamps from Deepgram STT into precise millisecond intervals, compensating for audio sample rate differences before generating Advanced SubStation Alpha (.ass) scripts.',
        ],
        codeBlock: {
          language: 'python',
          caption: 'Timestamp normalization and ASS dialogue event formatting',
          code: `def format_ass_timestamp(seconds: float) -> str:
    """Format decimal seconds into ASS timestamp format: H:MM:SS.cs"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    centis = int(round((seconds - int(seconds)) * 100))
    if centis == 100:
        secs += 1
        centis = 0
    return f"{hours}:{minutes:02d}:{secs:02d}.{centis:02d}"

def generate_karaoke_dialogue(words: list[dict], margin_v: int = 40) -> str:
    start_str = format_ass_timestamp(words[0]["start"])
    end_str = format_ass_timestamp(words[-1]["end"])
    # Construct karaoke tags with centisecond duration per syllable
    k_tags = "".join(f"{\\\\k{int((w['end'] - w['start']) * 100)}}{w['word']} " for w in words)
    return f"Dialogue: 0,{start_str},{end_str},Default,,0,0,{margin_v},,{k_tags}"`,
        },
      },
      {
        heading: '3. Headless Multi-Track Filtergraph Composition',
        paragraphs: [
          'Rather than running multiple re-encoding passes for overlays, voiceover tracks, and background music ducking, all operations are composed into a single complex FFmpeg filtergraph.',
          'This single-pass architecture prevents multi-generation compression artifacts and reduces rendering latency by more than 40%. Audio ducking is handled mathematically via sidechain compression directly in the filter chain.',
        ],
        codeBlock: {
          language: 'bash',
          caption: 'Single-pass sidechain audio ducking and video composition filter',
          code: `# Sidechain compressor ducks background audio whenever narration voice is active
ffmpeg -y -i background_music.mp3 -i narration_voice.wav -filter_complex \\
"[0:a]volume=0.25[music_quiet]; \\
 [1:a]asplit=2[voice_lead][voice_sidechain]; \\
 [music_quiet][voice_sidechain]sidechaincompress=threshold=0.08:ratio=4:attack=20:release=300[ducked_music]; \\
 [voice_lead][ducked_music]amix=inputs=2:duration=first:dropout_transition=2[aout]" \\
-map "[aout]" master_audio.wav`,
        },
      },
      {
        heading: '4. Testing and Automated Quality Verification',
        paragraphs: [
          'Complex media pipelines fail silently when edge cases arise—such as variable framerate videos, mono vs stereo channel mismatches, or invalid character encodings in subtitle files.',
          'To safeguard the pipeline, we maintain a test harness with 160+ unit and integration tests executing in pytest. The suite validates boundary audio lengths, font fallback resolution, zero-duration subtitle lines, and filtergraph parameter construction before any FFmpeg job is dispatched.',
        ],
        listItems: [
          'Verification of strict audio sample rate preservation (48kHz 16-bit PCM)',
          'Automated assertions on dynamic vertical video aspect ratios (1080x1920)',
          'Fuzz testing on transcript parser with unescaped curly braces and special characters',
          'Graceful degradation when b-roll footage duration is shorter than audio beat segment',
        ],
      },
    ],
  },
  {
    slug: 'deterministic-schema-guardrails-llm-apis',
    title: 'Deterministic Schema Guardrails: Eliminating Hallucinations in LLM API Pipelines',
    eyebrow: 'Software Quality · API Design',
    description:
      'Why model temperature tuning is not an engineering contract. A practical approach to combining Pydantic runtime schemas, regex boundary checks, and automated retry budgets for structured outputs.',
    publishedAt: '2026-10-05',
    updatedAt: '2026-10-08',
    readTime: '7 min read',
    category: 'Quality & Engineering',
    tags: [
      'Schema Validation',
      'Pydantic',
      'TypeScript',
      'API Design',
      'Error Handling',
      'Reliability',
    ],
    status: 'engineering-note',
    statusLabel: 'Engineering Note (Defensive API Patterns)',
    featured: false,
    renderMode: 'structured',
    sections: [
      {
        heading: '1. The Illusion of Natural Language Contracts',
        paragraphs: [
          'When integrating Large Language Models into production software, the most common anti-pattern is relying on prompting alone to enforce structured output format. Instructing a model to "return only valid JSON" works 95% of the time—which means it breaks 1 in 20 requests in production.',
          'For reliable applications, natural language is not a contract. A production system must establish deterministic validation boundaries where unstructured model completions are treated as untrusted user input.',
        ],
        callout: {
          type: 'note',
          title: 'The Core Principle',
          text: 'Treat LLM output with the same defensive validation as raw user input from a public web form: validate types, enforce boundaries, sanitize strings, and define deterministic fallback behavior.',
        },
      },
      {
        heading: '2. Two-Stage Syntactic and Semantic Validation',
        paragraphs: [
          'Validation must operate at two distinct layers: syntactic structure (is it well-formed JSON matching the expected schema?) and semantic validity (do the values make logical sense within domain constraints?).',
          'In both iScribe and our backend API systems, we employ strict Pydantic / Zod models with custom field validators that check range limits, format constraints, and mutual exclusions.',
        ],
        codeBlock: {
          language: 'python',
          caption: 'Strict Pydantic schema with domain boundary checks',
          code: `from pydantic import BaseModel, Field, field_validator
from typing import Literal

class ExtractedObservation(BaseModel):
    category: Literal["symptom", "vital_sign", "medication", "history"]
    entity_name: str = Field(min_length=2, max_length=100)
    status: Literal["confirmed", "denied", "suspected"]
    verbatim_quote: str = Field(min_length=1, description="Exact substring from transcript")
    
    @field_validator("verbatim_quote")
    @classmethod
    def check_non_empty_quote(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Observation must cite an exact verbatim transcript span")
        return cleaned`,
        },
      },
      {
        heading: '3. Controlled Retry Budgets vs Infinite Loops',
        paragraphs: [
          'When validation fails, naive implementations often feed the error trace back into the LLM in an unbounded loop. This burns API tokens and causes request timeouts.',
          'Instead, an engineering-first pipeline enforces a fixed retry budget (maximum 1-2 attempts) with error feedback showing only the exact schema path that failed. If the model fails a second time, the pipeline triggers a deterministic fallback: flagging the record for human review rather than returning corrupt data.',
        ],
      },
      {
        heading: '4. Summary and Key Engineering Takeaways',
        paragraphs: [
          'Achieving dependable AI application engineering requires moving past the myth of 100% prompt accuracy. True reliability comes from system architecture: deterministic schema validators, clear error isolation, and human-in-the-loop review boundaries.',
        ],
        listItems: [
          'Never consume raw LLM JSON without runtime schema validation (Pydantic / Zod)',
          'Require verbatim source quotes or citations to prevent unanchored hallucinations',
          'Cap retry attempts with strict timeout budgets to protect downstream latency',
          'Route unresolved ambiguity to human review rather than guessing',
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(category?: ArticleCategory): Article[] {
  if (!category) return articles;
  return articles.filter((article) => article.category === category);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((article) => article.featured);
}
