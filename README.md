# VORAX — AI Content Intelligence Engine

AI-powered platform that generates video scripts and analyzes compliance risk in real time

## Overview
AI-powered system that generates YouTube video scripts and automatically analyzes them for monetization compliance risk using a fine-tuned DistilBERT model.

## System Architecture
Topic Input → Script Generator (GPT-4o) → Compliance Model (DistilBERT) → API Response → Frontend Dashboard

## ML Model
- Model: DistilBERT fine-tuned for binary classification
- Dataset: 50,000 balanced samples (toxic comments + fake/real news)
- Accuracy: 99.98%
- Labels: safe / high_risk

## Tech Stack
- Backend: FastAPI, Python 3.12
- ML: HuggingFace Transformers, DistilBERT
- AI Generation: OpenAI GPT-4o
- Frontend: HTML, Tailwind CSS, JavaScript

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| POST | /api/scripts/generate | Generate YouTube script |
| POST | /api/compliance/score-text | Score text compliance |
| POST | /api/compliance/score | Score full video |
| POST | /api/content/analyze | Full pipeline: generate + score |

## How to Run
1. cd backend
2. pip install -r requirements.txt
3. Add OPENAI_API_KEY to .env file
4. uvicorn app.main:app --reload
5. Open http://127.0.0.1:8000/docs

## Demo Flow
1. User enters topic, niche, tone, duration
2. GPT-4o generates structured YouTube script
3. DistilBERT analyzes script for compliance risk
4. System returns compliance score (0-100) + risk level
5. Frontend displays results with color-coded risk badge

## Team
- Developer: Akshay
- College: New Horizon College of Engineering, Marathahalli
- Semester: 4th Semester BCA
