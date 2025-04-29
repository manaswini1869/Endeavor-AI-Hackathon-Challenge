# Endeavor-AI-Hackathon-Challenge# Sales Order Automation App

## Loom Video Link :
[App demo link](https://www.loom.com/share/0b06cea765ee421faae6092dca196cd7?sid=15519f21-148a-44fb-84c6-9c941510d1c4)

[Same Video in Google Drive](https://drive.google.com/file/d/1hZQwoOsqp9MgNA__BnuqUP13lzCQa2Nj/view?usp=sharing)
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

## Extra Features
- Tried building the extract API myself, was getting a couple of errors (feature will be added in future)
- Used TailWind for the first time didn't go well (wrong time to try new tech I guess!)