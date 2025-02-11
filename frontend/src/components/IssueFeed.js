import React, { useState, useEffect } from 'react';
import './IssueFeed.css';

function IssueFeed() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    // Dummy data fetch logic
    const dummyIssues = [
      { id: 1, description: 'Pothole on Main St.', status: 'Reported' },
      { id: 2, description: 'Overflowing garbage bin', status: 'In Progress' },
    ];
    setIssues(dummyIssues);
  }, []);

  return (
    <div className="feed-container">
      <h2>Issue Feed</h2>
      {issues.map((issue) => (
        <div key={issue.id} className="issue-card">
          <p>{issue.description}</p>
          <span>Status: {issue.status}</span>
        </div>
      ))}
    </div>
  );
}

export default IssueFeed;