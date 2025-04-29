import pdfplumber
import re

def extract_line_items(filename):
    line_items = []
    with pdfplumber.open(filename) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue

            lines = text.split('\n')
            buffer = []
            for line in lines:
                # Clean line of excessive whitespace
                line = line.strip()

                # If the line contains mostly product info, keep collecting
                if re.search(r'\b(?:Nut|Stud|Screw|Washer)\b', line, re.IGNORECASE):
                    if buffer:
                        line_items.append(" ".join(buffer))
                        buffer = []
                    buffer.append(line)
                elif re.match(r'^\d+$', line):  # Likely the quantity or total
                    buffer.append(line)
                elif buffer:
                    # Likely continuation of previous product description
                    buffer.append(line)

            # Catch any remaining buffer
            if buffer:
                line_items.append(" ".join(buffer))

    return line_items
