import React, { useEffect, useState } from 'react';

function IssueReported() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');

  useEffect(() => {
    // Fetch all issues
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/issues'); // Fetch sorted issues
        if (response.ok) {
          const data = await response.json();
          setIssues(data); // Set issues in state
          setFilteredIssues(data); // Set filtered issues initially to all issues
        } else {
          console.error('Failed to fetch issues');
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    fetchIssues();
  }, []);

  const handleVote = async (id) => {
    console.log('Voting for issue ID:', id); // Add this log to see the ID being sent

    try {
      const response = await fetch(`http://localhost:5000/api/issues/${id}/vote`, {
        method: 'PATCH',
      });

      if (response.ok) {
        const updatedIssue = await response.json();
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue._id === updatedIssue.issue._id
              ? { ...issue, votes: updatedIssue.issue.votes }
              : issue
          )
        );
      } else {
        console.error('Failed to vote:', response.statusText);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();  // Clean the search query
    
    console.log('Search Query:', query); // Log search query for debugging
  
    // Filter issues based on locationName (case-insensitive and substring search)
    const filtered = issues.filter((issue) => {
      const locationName = issue.location?.locationName || '';  // Get the locationName (fallback to empty string)
      
      console.log('Location Name:', locationName);  // Log the location name for debugging
      
      return locationName.toLowerCase().includes(query);  // Case-insensitive substring match
    });
  
    setFilteredIssues(filtered);  // Update filtered issues state
  };
  

  // Priority filter function
  const handlePriorityFilter = (e) => {
    const priority = e.target.value;
    setSelectedPriority(priority);

    // Filter issues based on selected priority
    const filtered = issues.filter((issue) =>
      priority === 'All' || issue.priority === priority
    );

    setFilteredIssues(filtered);
  };

  return (
    <div className="issue-reported">
      <h2>Issues Reported</h2>

      {/* Search Bar and Button */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by location..."
          className="search-bar"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {/* Priority Filter */}
      <div>
        <select
          onChange={handlePriorityFilter}
          value={selectedPriority}
          className="priority-filter"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <ul>
        {filteredIssues.map((issue) => (
          <li key={issue._id}>
            {Object.entries(issue).map(([key, value]) => {
              if (key === 'location') {
                return value?.locationName ? (
                  <p key={key}>
                    <strong>Location Name:</strong> {value.locationName}
                  </p>
                ) : null;
              }

              if (key === 'latitude' || key === 'longitude') return null;

              return (
                <p key={key}>
                  <strong>{key}:</strong> {value?.toString()}
                </p>
              );
            })}
            <button onClick={() => handleVote(issue._id)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IssueReported;
