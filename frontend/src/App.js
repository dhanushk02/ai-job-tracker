import { useEffect, useState } from "react";

function App() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const sendChat = () => {
    fetch("http://127.0.0.1:8000/chat?query=" + chatInput, {
      method: "POST"
    })
      .then(res => res.json())
      .then(data => setChatResponse(data.response));
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
    loadApplications();
  }, []);

  const loadApplications = () => {
    fetch("http://127.0.0.1:8000/applications")
      .then(res => res.json())
      .then(data => setApplications(data));
  };

  useEffect(() => {
    const onFocus = () => {
      if (selectedJob) setShowPopup(true);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [selectedJob]);

  const handleApply = (job) => {
    setSelectedJob(job);
    window.open(job.apply_link, "_blank");
  };

  const sendStatus = (status) => {
    fetch(`http://127.0.0.1:8000/apply?job_id=${selectedJob.id}&status=${status}`, {
      method: "POST"
    }).then(loadApplications);

    setShowPopup(false);
    setSelectedJob(null);
  };

  const updateStatus = (jobId, status) => {
    fetch(`http://127.0.0.1:8000/applications/update?job_id=${jobId}&status=${status}`, {
      method: "PUT"
    }).then(loadApplications);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Job Feed</h2>

      {jobs.map(job => (
        <div key={job.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <h4>{job.title}</h4>
          <p>{job.company} — {job.location}</p>
          <p>Match Score: {job.match_score}%</p>
          <button onClick={() => handleApply(job)}>Apply</button>
        </div>
      ))}

      <h2>Applications</h2>
      {Object.keys(applications).length === 0 && <p>No applications yet</p>}

      {Object.entries(applications).map(([jobId, app]) => (
        <div key={jobId} style={{ border: "1px solid #999", padding: 10, marginBottom: 10 }}>
          <p>Job ID: {jobId}</p>
          <p>Status: {app.status}</p>
          <button onClick={() => updateStatus(jobId, "interview")}>Interview</button>
          <button onClick={() => updateStatus(jobId, "offer")}>Offer</button>
          <button onClick={() => updateStatus(jobId, "rejected")}>Rejected</button>
        </div>
      ))}

      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{ background: "#fff", padding: 20 }}>
            <p>Did you apply to {selectedJob.title}?</p>
            <button onClick={() => sendStatus("applied")}>Yes, Applied</button>
            <button onClick={() => sendStatus("just_browsing")}>Just Browsing</button>
            <button onClick={() => sendStatus("applied_earlier")}>Applied Earlier</button>
          </div>
        </div>
      )}
      {/* AI ASSISTANT */}
      <hr />
      <h2>AI Assistant</h2>

      <input
        type="text"
        placeholder="Ask me something..."
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
      />
      <button onClick={sendChat}>Ask</button>

      {chatResponse && <p><b>AI:</b> {chatResponse}</p>}
    </div>
  );
}

export default App;
