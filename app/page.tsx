'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);
  const [error, setError] = useState(null);
  const [useOCR, setUseOCR] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file before uploading.');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('useOCR', useOCR.toString());
    
    try {
      const response = await fetch(useOCR ? '/api/extract-tables-ocr' : '/api/extract-tables', {
        method: 'POST',
        body: formData,
      });
  
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      if (!jsonResponse.success) {
        console.error(jsonResponse.error || 'Unknown error');
        alert(jsonResponse.message || 'Failed to extract tables.');
        return;
      }
      
      Object.entries(jsonResponse.tables).forEach(([filename, csvData]) => {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
      
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      
        console.log(`Downloaded ${filename}`);
      });

      setIsUploaded(true)
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setError(error.message);
    }
  };

  const handleDownloadCSV = () => {
    if (!csvUrl) {
      alert('No CSV file available for download.');
      return;
    }
  
    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = 'extracted_tables.csv'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      {/* Title */}
      <Typography variant="h3" gutterBottom align="center" sx={{ marginBottom: 4 }}>
        COINS PDF EXTRACTOR
      </Typography>

      {/* File Upload and Submit Screen */}
      {!isUploaded && (
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent>
            <form onSubmit={handleUpload}>
              {/* File Selector */}
              <Box mb={2}>
                <Typography variant="body1" gutterBottom>
                  Select a PDF file:
                </Typography>
                <TextField
                  type="file"
                  fullWidth
                  onChange={handleFileChange}
                  slotProps={{
                    htmlInput: { accept: '.pdf' }, 
                  }}
                />
              </Box>

              {/* Display Selected File */}
              {selectedFile && (
                <Box mb={2}>
                  <Typography variant="body2">
                    <strong>Selected File:</strong> {selectedFile.name}
                  </Typography>
                </Box>
              )}

              <FormControlLabel
                control={<Checkbox checked={useOCR} onChange={() => setUseOCR(!useOCR)} />}
                label="Run OCR on PDF before extraction"
              />

            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}

      {/* CSV Download Screen */}
      {isUploaded && (
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Download CSV
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadCSV}
              >
                Download CSV
              </Button>
              <Button
                variant="outlined"
                color="default"
                onClick={() => setIsUploaded(false)}
              >
                Back
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
