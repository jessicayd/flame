from gmft.auto import AutoTableDetector, AutoTableFormatter
from gmft.pdf_bindings import PyPDFium2Document

detector = AutoTableDetector()
formatter = AutoTableFormatter()

def ingest_pdf(pdf_path): # produces list[CroppedTable]
    doc = PyPDFium2Document(pdf_path)
    tables = []
    for page in doc:
        tables += detector.extract(page)
    return tables, doc

tables, doc = ingest_pdf("Ilam copy.pdf")
print(len(tables))

if tables:
    ft = formatter.extract(tables[0])
    print(ft.df())
else:
    print("No tables found in the PDF.")

doc.close()