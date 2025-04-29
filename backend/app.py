from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import httpx, os

UPLOAD_URL = "https://plankton-app-qajlk.ondigitalocean.app/extraction_api"
MATCHING_URL = "https://endeavor-interview-api-gzwki.ondigitalocean.app/match/batch?limit=5"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    file_location = file.filename
    with open(file_location, "wb") as f:
        f.write(await file.read())

    async with httpx.AsyncClient() as client:
        # Step 1: Extraction
        with open(file_location, "rb") as pdf_file:
            extract_response = await client.post(
                UPLOAD_URL,
                files={"file": (file.filename, pdf_file, "application/pdf")},
                headers={"accept": "application/json"},
            )

    os.remove(file_location)

    if extract_response.status_code != 200:
        return {"status": "error", "details": extract_response.text}

    extracted_items = extract_response.json()
    queries = [item.get("Request Item", "") for item in extracted_items if "Request Item" in item]
    # Step 2: Matching
    async with httpx.AsyncClient() as client:
        match_response = await client.post(MATCHING_URL, json={"queries": queries})

    if match_response.status_code != 200:
        return {"status": "error", "details": match_response.text}
    matches_raw = match_response.json()
    matches_raw_result = matches_raw.get('results', [])
    matches = []
    for query in queries:
        for match in matches_raw_result[query]:
            print(match)
            # print(matches_raw_result[query], "\n")
            matches.append({
                "line": query,
                "match": match.get("match", ""),
                "confidence": match.get("score", 0.0),
            })
    print(matches)

    return {"status": "success", "matches": matches}
