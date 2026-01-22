from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USER_RESUME_TEXT = ""
APPLICATIONS = {}  # job_id -> application data

MOCK_JOBS = [
    {
        "id": "1",
        "title": "React Developer",
        "company": "TechCorp",
        "location": "Remote",
        "job_type": "Full-time",
        "work_mode": "Remote",
        "description": "Looking for a React developer with JavaScript and REST API experience",
        "apply_link": "https://example.com/apply/react"
    },
    {
        "id": "2",
        "title": "Python Backend Developer",
        "company": "DataWorks",
        "location": "Bangalore",
        "job_type": "Full-time",
        "work_mode": "On-site",
        "description": "Python, FastAPI, Redis experience required",
        "apply_link": "https://example.com/apply/python"
    }
]

SKILL_KEYWORDS = [
    "react", "javascript", "python", "fastapi",
    "node", "redis", "sql", "api"
]

@app.get("/")
def health_check():
    return {"status": "Backend is running"}

@app.post("/resume")
async def upload_resume(file: UploadFile = File(...)):
    global USER_RESUME_TEXT
    content = await file.read()
    USER_RESUME_TEXT = content.decode("utf-8", errors="ignore")
    return {"message": "Resume uploaded"}

def calculate_match_score(resume_text: str, job_description: str):
    matched = []
    score = 0

    resume_lower = resume_text.lower()
    job_lower = job_description.lower()

    for skill in SKILL_KEYWORDS:
        if skill in job_lower and skill in resume_lower:
            matched.append(skill)
            score += 15

    return min(score, 100), matched

@app.get("/jobs")
def get_jobs_with_match():
    results = []

    for job in MOCK_JOBS:
        score, matched_skills = calculate_match_score(
            USER_RESUME_TEXT, job["description"]
        )

        job_with_score = job.copy()
        job_with_score["match_score"] = score
        job_with_score["matched_skills"] = matched_skills
        job_with_score["application_status"] = APPLICATIONS.get(job["id"], {}).get("status")

        results.append(job_with_score)

    return results

@app.post("/apply")
def apply_job(job_id: str, status: str):
    APPLICATIONS[job_id] = {
        "status": status,
        "timestamp": datetime.utcnow().isoformat()
    }
    return {"message": "Application status saved"}

@app.get("/applications")
def get_applications():
    return APPLICATIONS

@app.put("/applications/update")
def update_application(job_id: str, status: str):
    if job_id in APPLICATIONS:
        APPLICATIONS[job_id]["status"] = status
        return {"message": "Status updated"}
    return {"error": "Application not found"}

@app.post("/chat")
def chat(query: str):
    query_lower = query.lower()

    if "remote" in query_lower:
        return {"response": "You can filter jobs by Work Mode = Remote in the job feed."}

    if "highest" in query_lower or "best" in query_lower:
        return {"response": "Jobs are sorted by match score. Green badges indicate best matches (>70%)."}

    if "resume" in query_lower:
        return {"response": "You can upload your resume using the Resume Upload section at login."}

    if "applications" in query_lower:
        return {"response": "All your applied jobs appear in the Applications dashboard below the job feed."}

    return {"response": "Try asking about remote jobs, match scores, or applications."}
