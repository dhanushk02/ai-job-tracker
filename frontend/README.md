# AI-Powered Job Tracker with Smart Matching

## Overview
This project is an AI-powered job tracking system that fetches jobs, matches them against a user's resume, and tracks application status intelligently.

The system focuses on real-world job-seeker workflows with smart apply confirmation and explainable match scores.

---

## Architecture

Frontend (React)
        |
        | REST APIs
        |
Backend (FastAPI - Python)
        |
        | In-memory Storage
        |
AI Matching & Rule-based Assistant

---

## Tech Stack
- Frontend: React
- Backend: FastAPI (Python)
- AI Matching: Keyword-based scoring (extendable to LLMs)
- Storage: In-memory (Redis-ready)
- Job Source: Mock API (allowed per assignment)

---

## Core Features

### Job Feed & Filters
- Job listing with title, company, location, job type, and work mode
- Match score shown on each job card
- Best matches highlighted using scores

### Resume Upload
- Users upload a single resume (PDF/TXT)
- Resume text is extracted and stored
- Resume can be replaced anytime

### AI-Powered Job Matching
- Jobs are scored against resume content
- Match score ranges from 0–100
- Explanation provided using matched skills

### Smart Application Tracking
- Clicking "Apply" opens job link in new tab
- On return, user is prompted to confirm application
- Status options:
  - Applied
  - Just Browsing
  - Applied Earlier
- Status can be updated to Interview / Offer / Rejected
- Applications are shown in a dashboard with timeline

### AI Sidebar Assistant
- Answers job-related questions
- Explains product features
- Helps users find relevant jobs

---

## AI Matching Logic
- Resume and job descriptions are scanned for skill keywords
- Each matched skill increases the match score
- Scores are capped at 100%
- Logic is explainable and efficient

---

## Popup Flow (Critical Thinking)
- Uses browser focus detection
- Ensures users are not forced to confirm application
- Handles real-world browsing behavior
- Avoids false positives

---

## Scalability
- Stateless backend allows horizontal scaling
- In-memory storage can be replaced with Redis
- Job matching is lightweight and fast
- Designed to handle 100+ jobs per user

---

## Tradeoffs & Improvements
- Mock job API used due to time constraints
- Keyword-based AI matching instead of deep NLP
- Can be extended with:
  - Redis persistence
  - LLM-based semantic matching
  - Auth and multi-user support

---

## Setup Instructions

### Backend
```bash
pip install fastapi uvicorn
uvicorn backend.main:app --reload

## Live Demo
- Frontend: https://ai-job-tracker-phi.vercel.app/
- Backend: https://ai-job-tracker-06uz.onrender.com
