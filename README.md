# Endeavor-AI-Hackathon-Challenge# Sales Order Automation App

## Setup Instructions

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
uvicorn app:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Features
- Upload PDFs
- Extract and match line items to catalog
- View and verify matches
- Export data as CSV