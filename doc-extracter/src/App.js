import React, { useState } from 'react';
import axios from 'axios';

// Import the CSS file (make sure the path is correct)
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setConfirmed(false);
    setMatches([]);
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.status === "success") {
        setMatches(response.data.matches.map((match, index) => ({ ...match, id: index })) || []);
      } else {
        alert(`Extraction or matching failed: ${response.data.message || 'Unknown error'}`);
        setMatches([]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.response?.data?.message || error.message || 'Please try again.'}`);
      setMatches([]);
    } finally {
      setUploading(false);
    }
  };

  const handleExportCSV = () => {
    const formatConfidence = (conf) => {
        const numConf = parseFloat(conf);
        return isNaN(numConf) ? 'N/A' : numConf.toFixed(2);
    }
    const csvRows = [
      ['Line Item', 'Match', 'Confidence'],
      ...matches.map(item => [
        `"${item.line.replace(/"/g, '""')}"`,
        `"${item.match.replace(/"/g, '""')}"`,
        formatConfidence(item.confidence)
      ])
    ];
    const csvString = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sales_order_matches.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const updateMatch = (id, newMatch) => {
    const updated = matches.map(item =>
      item.id === id ? { ...item, match: newMatch } : item
    );
    setMatches(updated);
    setConfirmed(false);
  };

  const confirmMatches = () => {
    setConfirmed(true);
  };

  // Function now returns CSS class names
  const getConfidenceClass = (conf) => {
    const numConf = parseFloat(conf);
    if (isNaN(numConf)) return 'confidence-unknown'; // Handle cases where confidence might not be a number
    if (numConf >= 98) return 'confidence-high';
    if (numConf >= 90) return 'confidence-medium';
    return 'confidence-low';
  };

  const displayConfidence = (conf) => {
    const numConf = parseFloat(conf);
    return isNaN(numConf) ? 'N/A' : `${numConf.toFixed(2)}%`;
  }

  // Helper for dynamic button classes
  const getUploadButtonClasses = () => {
      let classes = "button button-upload";
      if (uploading) classes += " uploading";
      if (!file) classes += " no-file";
      return classes;
  }

  const getConfirmButtonClasses = () => {
      let classes = "button button-confirm";
      if (confirmed) classes += " confirmed";
      return classes;
  }

    const getExportButtonClasses = () => {
      let classes = "button button-export";
      if (confirmed) classes += " enabled";
      return classes;
  }


  return (
    <div className="app-wrapper"> {/* Replaced Tailwind classes */}
      <div className="main-card"> {/* Replaced Tailwind classes */}
        <div className="card-content"> {/* Replaced Tailwind classes */}
          <h1 className="main-heading"> {/* Replaced Tailwind classes */}
            Sales Order Matcher
          </h1>

          <div className="upload-section"> {/* Replaced Tailwind classes */}
            {/* Removed sr-only label as default browser styling might handle it */}
            <input
              id="file-upload"
              type="file"
              className="file-input" // Replaced Tailwind classes
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className={getUploadButtonClasses()} // Use helper for dynamic classes
            >
              {uploading ? 'Uploading...' : 'Upload & Match'}
            </button>
          </div>

          {matches.length > 0 && (
            <div className="button-section"> {/* Replaced Tailwind classes */}
              <button
                onClick={confirmMatches}
                className={getConfirmButtonClasses()} // Use helper for dynamic classes
                disabled={confirmed}
              >
                {confirmed ? 'Matches Confirmed' : 'Confirm Matches'}
              </button>
              <button
                onClick={handleExportCSV}
                disabled={!confirmed}
                className={getExportButtonClasses()} // Use helper for dynamic classes
              >
                Export CSV
              </button>
            </div>
          )}

          {matches.length > 0 && ( // This is line 160 in the original error message context
              <h2 className="section-heading">Matched Items</h2>
          )}
          <div className="matches-list"> {/* Replaced Tailwind classes */}
            {matches.map((item) => (
              <div key={item.id} className="match-item"> {/* Replaced Tailwind classes */}
                <div className="match-item-grid"> {/* Replaced Tailwind classes */}

                  <div className="match-column-line"> {/* Added structural class */}
                    <label htmlFor={`line-${item.id}`} className="match-label">Original Line:</label> {/* Added label class */}
                    <p id={`line-${item.id}`} className="match-text">{item.line}</p> {/* Added text class */}
                  </div>

                   <div className="match-column-input"> {/* Added structural class */}
                    <label htmlFor={`match-${item.id}`} className="match-label"> {/* Added label class */}
                      Suggested Match:
                    </label>
                    <input
                      id={`match-${item.id}`}
                      type="text"
                      value={item.match}
                      onChange={(e) => updateMatch(item.id, e.target.value)}
                      className="match-input" // Replaced Tailwind classes
                    />
                  </div>

                  <div className="match-column-confidence"> {/* Added structural class */}
                    <p className={`confidence-display ${getConfidenceClass(item.confidence)}`}> {/* Use confidence class */}
                      {displayConfidence(item.confidence)}
                    </p>
                    <p className="confidence-label">Confidence</p> {/* Added label class */}
                  </div>
                </div>
              </div>
            ))}
             {!uploading && file && matches.length === 0 && (
                <p className="no-matches-message">No matches found for the uploaded file.</p>
             )}
          </div>
        </div>
      </div>
      <footer className="footer"> {/* Replaced Tailwind classes */}
          Sales Order Matching Tool &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;