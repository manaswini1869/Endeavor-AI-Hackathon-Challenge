import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const handleUpload = async () => {
    setConfirmed(false);
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.status === "success") {
        setMatches(response.data.matches || []);
      } else {
        alert("Extraction or matching failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ['Line Item', 'Match', 'Confidence'],
      ...matches.map(item => [item.line, item.match, item.confidence])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "sales_order_matches.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateMatch = (index, newMatch) => {
    const updated = [...matches];
    updated[index].match = newMatch;
    setMatches(updated);
    setConfirmed(false); // Reset confirmation if any edit is made
  };

  const confirmMatches = () => {
    setConfirmed(true);
    alert("Matches confirmed. You can now export.");
  };

  return React.createElement('div', { className: 'p-4 max-w-2xl mx-auto' },
    React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, 'Sales Order Uploader'),

    React.createElement('input', {
      type: 'file',
      onChange: (e) => setFile(e.target.files[0])
    }),

    React.createElement('button', {
      onClick: handleUpload,
      className: 'bg-blue-500 text-white px-4 py-2 rounded mt-2'
    }, 'Upload'),

    // 🛠️ Add buttons conditionally and correctly
    ...(matches.length > 0 ? [
      React.createElement('button', {
        key: 'confirm',
        onClick: confirmMatches,
        className: 'bg-yellow-500 text-white px-4 py-2 rounded ml-2'
      }, 'Confirm Matches'),

      React.createElement('button', {
        key: 'export',
        onClick: handleExportCSV,
        disabled: !confirmed,
        className: `px-4 py-2 rounded ml-2 ${confirmed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`
      }, 'Export CSV')
    ] : []),

    React.createElement('div', { className: 'mt-4' },
      matches.map((item, idx) =>
        React.createElement('div', { key: idx, className: 'border p-2 mb-2' },
          React.createElement('p', null,
            React.createElement('strong', null, 'Line:'), ' ', item.line
          ),
          React.createElement('label', { className: 'block mt-2' },
            React.createElement('strong', null, 'Match:'),
            React.createElement('input', {
              type: 'text',
              value: item.match,
              onChange: (e) => updateMatch(idx, e.target.value),
              className: 'ml-2 border px-2 py-1 w-full mt-1'
            })
          ),
          React.createElement('p', { className: 'mt-1' },
            React.createElement('strong', null, 'Confidence:'), ' ', (item.confidence * 100).toFixed(2), '%'
          )
        )
      )
    )
  );
}

export default App;
