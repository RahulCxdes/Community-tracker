// Tracker.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Tracker() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/issues');
        setIssues(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to fetch issues.');
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) return <p>Loading issues...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tracker-container">
      <h1>Tracker Page</h1>
      <p>Track ongoing issues and monitor their resolution status here.</p>

      {issues.length === 0 ? (
        <p>No issues reported yet.</p>
      ) : (
        issues.map((issue) => (
          <div className="issue-card" key={issue._id}>
            <img
              src={issue.image ? `http://localhost:5000${issue.image}` : 'https://via.placeholder.com/120'}
              alt="Issue"
            />
            <div className="issue-details">
              <h3>{issue.description}</h3>
              <p>Type: {issue.issueType}</p>
              <p className="priority">Priority: {issue.priority}</p>
              <p>Contact: {issue.contactInfo || 'N/A'}</p>
              <p>Created At: {new Date(issue.createdAt).toLocaleString()}</p>
              <p>Status: <strong>{issue.status}</strong></p>
              {/* Display message based on status */}
              <p>
                {issue.status === 'pending' && <span>Stay Safe! Issue is pending resolution.</span>}
                {issue.status === 'Within Week' && <span>This issue should be resolved within a week.</span>}
                {issue.status === 'Within Month' && <span>This issue should be resolved within a month.</span>}
                {issue.status === 'Completed' && <span>This issue has been resolved.</span>} {/* New Completed Message */}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Tracker;
