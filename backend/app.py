from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from extract import extract_line_items
from match import match_items
from database import init_db, save_po

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # Save the file locally
    filename = f"uploads/{file.filename}"
    with open(filename, "wb") as f:
        f.write(await file.read())

    items = extract_line_items(file.filename)
    matches = match_items(items)

    po_id = save_po(file.filename, items, matches)
    return {"po_id": po_id, "items": matches}