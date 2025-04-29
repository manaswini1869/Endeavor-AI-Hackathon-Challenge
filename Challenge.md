Endeavor AI Hackathon Challenge

Problem: Automating Sales Order Processing

One of the biggest bottlenecks in manufacturing and distribution is manually entering sales order documents (SOs). Your mission: build an MVP that automates this document handling process.

Background:
Today, employees manually open trade documents (like purchase orders), match the line items to products in a catalog, and key the information into a system.
We're challenging you to automate this flow end-to-end.

Context:
Here’s a video showing you how an employee at one of our clients might perform this task manually today. Our goal is to automate this task as fully as possible: Example of app

Data:
Download example purchase orders and the product catalog: Example POs and product catalog

Your Goal:
Build a web application that will:

Allow the user to upload a PDF document
Parse and extract line items from the PDF
Match each extracted line item to the most similar product in the catalog
Display matches to the user for verification/editing
Allow the user to confirm and export the structured data (e.g., CSV)

Tools We’re Giving You:
PDF Extraction API: Quickly extract text line items from provided PDFs
(Documents must keep original filenames as API is mocked: Easy-1.pdf, Medium-2.pdf, etc.)

Matching API: Match extracted items to catalog entries using a preconfigured model

For bonus points, you can build your own matching algorithm and API to showcase extra skills!


What to Submit:
Functional code in a private GitHub repo
A 1-minute demo video walking through your app running. No audio required. (We recommend using Loom)
A README file with:
Setup instructions
Any notes on extra features you built
Share the GitHub repo with:
cameron-endeavor
amil-endeavor
ryan-endeavor
Reply to the email that delivered the assignment to you with:
A link to your 1-minute video
Your GitHub handle so we can match you to your shared repo

Things We're Looking For:

✅ Core functionality workflow for SOs (upload, extract, match, verify, export)
✅ Dashboard to view all processed SOs and edit previously processed ones
✅ Human-in-the-loop experience (user can fix incorrect matches on sales orders by searching the product catalog for other options)
✅ Clean, intuitive frontend
✅ Thoughtful backend architecture and data persistence (SQL/NoSQL, local/cloud db up to you; processed SOs and edits to their data persist)
✅ Bonus: Your own matching implementation (if you choose)

Notes:
You can use any tech stack you want.
This is a hackathon — speed and functionality matter more than polish.
Creativity is encouraged. Surprise us.

