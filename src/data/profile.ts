// Single source of truth — parsed from boss_profile.md
// Update this file to change content across the entire site.

export interface Education {
  school: string
  degree: string
  graduation?: string
  gpa?: string
  researchFocus?: string
  tools?: string[]
}

export interface ExperienceItem {
  id: string
  title: string
  company: string
  type: 'full-time' | 'intern' | 'research'
  duration: string
  description: string
  achievements: string[]
  stack: string[]
}

export interface SkillGroup {
  category: string
  skills: string[]
}

export interface Certification {
  name: string
  issuer: string
  url?: string
}

export interface ContactInfo {
  email: string      // TODO: replace with your actual email
  linkedin: string   // TODO: replace with your LinkedIn URL
  github: string     // TODO: replace with your GitHub URL
}

export interface ProfileData {
  name: string
  preferredName: string
  tagline: string
  location: string
  status: string
  summary: string
  education: Education[]
  experience: ExperienceItem[]
  skillGroups: SkillGroup[]
  certifications: Certification[]
  researchInterests: string[]
  contact: ContactInfo
}

export const profile: ProfileData = {
  name: 'Bhanuprasad Kokkula',
  preferredName: 'Boss',
  tagline: 'Data Scientist & GenAI Engineer',
  location: 'New Jersey, USA',
  status: 'Open to opportunities',
  summary:
    'Data Scientist with ~2 years of industry experience and 1.5 years of GenAI research at Rutgers, specializing in agentic AI systems, RAG pipelines, and ML for financial services. Built production fraud detection models delivering measurable business impact (8% fraud reduction, 50% precision lift) and architected MARS, a multi-agent risk synthesis framework for financial analysis. M.S. in Data Science from Rutgers (GPA 3.7, May 2026), with deep interest in LLMs, model risk evaluation, and applied ML in fintech and legal tech.',

  education: [
    {
      school: 'Rutgers, The State University of New Jersey',
      degree: 'M.S. in Data Science',
      graduation: 'May 2026',
      gpa: '3.7 / 4.0',
      researchFocus: 'Generative AI — RAG systems, LLM fine-tuning, model risk & bias assessment',
      tools: ['FAISS', 'Pinecone', 'LangChain', 'BERTopic', 'SentenceBERT', 'LLaMA', 'LoRA'],
    },
    {
      school: 'University of Pennsylvania',
      degree: 'Professional Certificate Course — AI for Business',
    },
  ],

  experience: [
    {
      id: 'hexaware',
      title: 'Data Scientist',
      company: 'Hexaware Technologies',
      type: 'full-time',
      duration: '~14 months',
      description:
        'Embedded on a financial-services data science team, building and shipping production ML models for fraud detection and optimizing the pipelines that serve them.',
      achievements: [
        '8% reduction in fraud through ML-driven detection models',
        '40% pipeline speedup via optimization and infrastructure improvements',
        '50% precision improvement on production ML models',
      ],
      stack: ['Python', 'Scikit-learn', 'XGBoost', 'LightGBM', 'SQL'],
    },
    {
      id: 'rutgers-research',
      title: 'GenAI Researcher (Independent Applied Research)',
      company: 'Rutgers University',
      type: 'research',
      duration: '~1.5 years',
      description:
        'Independent applied research alongside the M.S. program on retrieval-augmented generation and LLM adaptation for academic research workflows — emphasis on reproducibility and honest benchmarking over headline metrics.',
      achievements: [
        'Built an offline LLaMA + LangChain document search system with agentic retrieval over mixed-format corpora (PDF, HTML, LaTeX, Word)',
        'RAG/retrieval R&D across FAISS, Pinecone, and ChromaDB; LoRA fine-tuning with custom precision/recall benchmarks — ~50% improvement in task-specific precision',
        'Benchmarked open-source tools (retrieval quality, latency, scalability) and tracked experiments via Streamlit/Plotly dashboards to inform team adoption',
      ],
      stack: [
        'Python',
        'PyTorch',
        'Hugging Face',
        'LoRA',
        'LangChain',
        'FAISS',
        'Pinecone',
        'ChromaDB',
        'OpenAI API',
        'Anthropic API',
        'Streamlit',
        'Plotly',
      ],
    },
    {
      id: 'chinmaya',
      title: 'Data Science Intern',
      company: 'Chinmaya Technologies',
      type: 'intern',
      duration: '~5 months',
      description:
        'Early-career internship applying core data science and ML techniques across multiple client projects, end to end from data ingestion to deployment.',
      achievements: [
        'Applied data science and ML model development across multiple projects',
        'Built end-to-end ML pipelines from data ingestion to model deployment',
      ],
      stack: ['Python', 'Scikit-learn', 'Pandas', 'SQL'],
    },
    {
      id: 'echortech',
      title: 'Data Engineering Intern',
      company: 'Echortech',
      type: 'intern',
      duration: '~4 months',
      description:
        'Focused on building reliable data infrastructure on Google Cloud — the ETL pipelines and scheduled workflows that downstream analytics depended on.',
      achievements: [
        'Built and maintained ETL pipelines on Google Cloud Platform',
        'Authored Airflow DAGs for automated data workflows',
        'Leveraged BigQuery for large-scale data processing and analytics',
      ],
      stack: ['BigQuery', 'Airflow', 'GCP', 'Python', 'SQL'],
    },
    {
      id: 'iit-kharagpur',
      title: 'Machine Learning Intern',
      company: 'IIT Kharagpur',
      type: 'research',
      duration: 'May 2020 – August 2020',
      description:
        'Summer research internship focused on the theoretical foundations of ML and deep learning, ahead of applying them in production roles later on.',
      achievements: [
        'Completed a guided study on the fundamentals of Machine Learning (ML) and Deep Learning (DL) architectures',
        'Explored the foundational math behind statistical modeling, focusing on how random variables work within Generalized Linear Models (GLMs)',
      ],
      stack: ['Python', 'Statistics', 'GLMs', 'Deep Learning'],
    },
  ],

  skillGroups: [
    {
      category: 'Languages',
      skills: ['Python', 'SQL', 'R'],
    },
    {
      category: 'Machine Learning',
      skills: [
        'Scikit-learn',
        'XGBoost',
        'LightGBM',
        'PyTorch',
        'TensorFlow',
        'pandas',
        'NumPy',
        'SciPy',
        'Matplotlib',
        'Seaborn',
      ],
    },
    {
      category: 'NLP & LLMs',
      skills: [
        'Sentence-BERT',
        'BERTopic',
        'LDA',
        'LLaMA',
        'OpenAI API',
        'Anthropic Claude API',
        'Google Gemini API',
        'Hugging Face',
      ],
    },
    {
      category: 'Agentic AI & RAG',
      skills: [
        'LangChain',
        'LangGraph',
        'FAISS',
        'Pinecone',
        'ChromaDB',
        'LoRA',
        'sentence-transformers',
        'Streamlit',
      ],
    },
    {
      category: 'Causal Inference & Statistics',
      skills: ['Propensity Score Matching', 'lme4', 'MatchIt', 'cobalt', 'glmnet', 'MCMCpack', 'Rosenbaum bounds', 'E-values'],
    },
    {
      category: 'Data Engineering',
      skills: ['BigQuery', 'Airflow', 'ETL', 'GCP', 'Microsoft Azure'],
    },
    {
      category: 'Backend & Deployment',
      skills: [
        'FastAPI',
        'Azure Deployment',
        'Full-stack ML Systems',
        'MLflow',
        'SQLite',
        'SQLAlchemy',
        'Pydantic v2',
        'pytest',
      ],
    },
    {
      category: 'Domain Expertise',
      skills: [
        'Fraud Detection',
        'Credit Risk Modeling',
        'Financial Services ML',
        'Computational Linguistics',
        'NLP Bias Analysis',
      ],
    },
  ],

  certifications: [
    {
      name: 'Azure Data Scientist Associate',
      issuer: 'Microsoft',
      url: 'https://learn.microsoft.com/en-us/users/bhanukokkula-1243/credentials/eea52dc12acc0a25',
    },
    {
      name: 'Microsoft Certified: Azure AI Fundamentals',
      issuer: 'Microsoft',
      url: 'https://learn.microsoft.com/en-us/users/Bhanukokkula-1243/credentials/2BA08341CE8A8ADA',
    },
    {
      name: 'Bloomberg Market Concepts (BMC)',
      issuer: 'Bloomberg',
      url: 'https://portal.bloombergforeducation.com/certificates/9iqWpFPRHmBZ2ggRNTavEcsi',
    },
    {
      name: 'Bloomberg Finance Fundamentals',
      issuer: 'Bloomberg',
      url: 'https://portal.bloombergforeducation.com/certificates/Sz8GDBFEzpZptQJnpmzMgB4W',
    },
    {
      name: 'IT Leadership Skills for Technical Professionals',
      issuer: 'LinkedIn Learning',
      url: 'https://www.linkedin.com/learning/certificates/0b9b36ad12e9d5d21e0dcfc163a374b804c96b880bb043de3b554e74133ea3ef',
    },
  ],

  researchInterests: [
    'Gender bias in scientific literature using computational linguistics',
    'Analysis of the "Man the Hunter" hypothesis via NLP — epistemic modality & rhetorical bias detection',
    'Quantitative NLP metrics: chi-square, odds ratios, WEAT',
    'LLM safety, model bias, and agentic AI systems',
  ],

  contact: {
    email: 'your.email@example.com',    // TODO: replace with your actual email
    linkedin: 'https://www.linkedin.com/in/bhanu-kokkula/',
    github: 'https://github.com/Bhanukokkula',
  },
}
