import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/issues/${id}/status`, { status: newStatus });
      const updatedIssue = response.data.issue;
      setIssues((prevIssues) =>
        prevIssues.map((issue) => (issue._id === id ? { ...issue, status: updatedIssue.status } : issue))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };
  

  const handleFindLocation = (lat, lng) => {
    if (lat && lng) {
      navigate('/location', { state: { lat, lng } });
    } else {
      alert('Location information is missing for this issue.');
    }
  };

  if (loading) return <p>Loading issues...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
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
            </div>
            <div className="issue-actions">
              <button
                onClick={() =>
                  issue.location?.latitude && issue.location?.longitude
                    ? handleFindLocation(issue.location.latitude, issue.location.longitude)
                    : alert('Location information is missing for this issue.')
                }
              >
                Find Location
              </button>
              <button onClick={() => handleStatusUpdate(issue._id, 'Within Week')}>Mark as Within Week</button>
              <button onClick={() => handleStatusUpdate(issue._id, 'Within Month')}>Mark as Within Month</button>
               
               <button onClick={() => handleStatusUpdate(issue._id, 'Completed')}>Mark as Completed</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
