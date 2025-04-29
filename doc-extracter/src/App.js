import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [matches, setMatches] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("http://localhost:8000/upload", formData);
    setMatches(res.data.items);
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

  return (
    React.createElement('div', { className: 'p-4 max-w-2xl mx-auto' },
      React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, 'Sales Order Uploader'),
      React.createElement('input', {
        type: 'file',
        onChange: (e) => setFile(e.target.files[0])
      }),
      React.createElement('button', {
        onClick: handleUpload,
        className: 'bg-blue-500 text-white px-4 py-2 rounded mt-2'
      }, 'Upload'),
      matches.length > 0 && React.createElement('button', {
        onClick: handleExportCSV,
        className: 'bg-green-500 text-white px-4 py-2 rounded ml-2'
      }, 'Export CSV'),
      React.createElement('div', { className: 'mt-4' },
        matches.map((item, idx) =>
          React.createElement('div', { key: idx, className: 'border p-2 mb-2' },
            React.createElement('p', null,
              React.createElement('strong', null, 'Line:'), ' ', item.line
            ),
            React.createElement('p', null,
              React.createElement('strong', null, 'Match:'), ' ', item.match, ' (', item.confidence * 100, '%)'
            )
          )
        )
      )
    )
  );
}

export default App;
