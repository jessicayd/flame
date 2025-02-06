from flask import Flask, request, Response, jsonify
import pandas as pd
from gmft.pdf_bindings import PyPDFium2Document
from gmft.auto import AutoTableDetector, AutoTableFormatter
import tempfile
import os

app = Flask(__name__)

@app.route('/api/help', methods=['GET'])
def hello_world():
    return jsonify({"message": "Hello, World!"})

detector = AutoTableDetector()
formatter = AutoTableFormatter()

def ingest_pdf(pdf_path):
    doc = PyPDFium2Document(pdf_path)
    tables = []
    for page in doc:
        tables += detector.extract(page)
    return tables, doc

@app.route('/api/extract-tables', methods=['POST'])
def extract_tables_with_gmft():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided."}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file."}), 400

    with tempfile.TemporaryDirectory() as temp_dir:
        pdf_path = os.path.join(temp_dir, file.filename)
        file.save(pdf_path)

        try:
            tables, doc = ingest_pdf(pdf_path)

            if tables:
                ft = formatter.extract(tables[0])
                return jsonify({"message": f"{len(tables)} \n {ft.df()}"})
            else:
                print("No tables found in the PDF.")
                return jsonify({"message": "No tables found in the PDF."})
        except Exception as e:
            return jsonify({"error": f"Failed to extract tables: {str(e)}"}), 500
    
    doc.close()

if __name__ == '__main__':
    app.run(port=5328)