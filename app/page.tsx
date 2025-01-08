'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

export default function FileUpload() {
  const [selectedOption, setSelectedOption] = useState<null | 'immediate' | 'pipeline'>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTableIndex, setCurrentTableIndex] = useState(0);
  const [isTableReview, setIsTableReview] = useState(false);
  const [isTableReviewDone, setIsTableReviewDone] = useState(false);
  const [tableStatus, setTableStatus] = useState<Record<number, 'confirmed' | 'rejected' | null>>(
    {}
  );

  const tableImages = [
    '/path/to/table1.png', 
    '/path/to/table2.png',
    '/path/to/table3.png',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file before submitting.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsTableReview(true); 
    }, 1000);
  };

  const handleConfirmTable = () => {
    setTableStatus((prev) => ({ ...prev, [currentTableIndex]: 'confirmed' }));
    handleNextTable();
  };

  const handleRejectTable = () => {
    setTableStatus((prev) => ({ ...prev, [currentTableIndex]: 'rejected' }));
    handleNextTable();
  };

  const handleNextTable = () => {
    if (currentTableIndex < tableImages.length - 1) {
      setCurrentTableIndex((prev) => prev + 1);
    }
  };

  const handlePreviousTable = () => {
    if (currentTableIndex > 0) {
      setCurrentTableIndex((prev) => prev - 1);
    }
  };

  const handleDoneReview = () => {
    setIsTableReview(false);
    setIsTableReviewDone(true); 
  };

  const handleBack = () => {
    setSelectedOption(null);
    setSelectedFile(null);
    setIsSubmitting(false);
    setIsTableReview(false);
    setIsTableReviewDone(false);
    setTableStatus({});
    setCurrentTableIndex(0);
  };

  const handleDownloadCSV = () => {
    alert('CSV Download initiated!');
    // TODO: add logic
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={3}
    >
      {/* Title */}
      <Typography variant="h3" gutterBottom align="center" sx={{ marginBottom: 4 }}>
        COINS PDF EXTRACTOR
      </Typography>

      {/* Option Selection Screen */}
      {!selectedOption && !isTableReview && !isTableReviewDone && (
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Select an Option
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedOption('immediate')}
              >
                Upload Well-Formatted PDF
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setSelectedOption('pipeline')}
              >
                Upload PDF Through Full Pipeline
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* File Upload and Submit Screen */}
      {selectedOption && !isTableReview && !isTableReviewDone && (
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              {selectedOption === 'immediate'
                ? 'Upload PDF'
                : 'Upload PDF'}
            </Typography>
            <form onSubmit={handleSubmit}>
              {/* File Selector */}
              <Box mb={2}>
                <Typography variant="body1" gutterBottom>
                  Select a PDF file:
                </Typography>
                <TextField
                  type="file"
                  fullWidth
                  inputProps={{ accept: '.pdf' }}
                  onChange={handleFileChange}
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

              {/* Submit and Back Buttons */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Button
                  variant="outlined"
                  color="default"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table Review Screen */}
      {isTableReview && (
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Review Detected Tables
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center">
              <img
                src={tableImages[currentTableIndex]}
                alt={`Table ${currentTableIndex + 1}`}
                style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '20px' }}
              />
              <Typography variant="body2" gutterBottom>
                Table {currentTableIndex + 1} of {tableImages.length}
              </Typography>

              {/* Confirm and Reject Buttons */}
              <Box display="flex" justifyContent="center" gap={2} mt={2}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleRejectTable}
                  sx={{
                    opacity: 0.7,
                    transform: 'scale(1)',
                    '&:hover': {
                      opacity: 1,
                      transform: 'scale(1.1)',
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                    },
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleConfirmTable}
                  sx={{
                    opacity: 0.7,
                    transform: 'scale(1)',
                    '&:hover': {
                      opacity: 1,
                      transform: 'scale(1.1)',
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                    },
                  }}
                >
                  Confirm
                </Button>
              </Box>

              {/* Navigation Buttons */}
              <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
                <Button
                  variant="outlined"
                  onClick={handlePreviousTable}
                  disabled={currentTableIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleNextTable}
                  disabled={currentTableIndex === tableImages.length - 1}
                >
                  Next
                </Button>
              </Box>

              {/* Done Button */}
              {currentTableIndex === tableImages.length - 1 && (
                <Box mt={2}>
                  <Button variant="contained" color="primary" onClick={handleDoneReview}>
                    Done
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}


      {/* CSV Download Screen */}
      {isTableReviewDone && (
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
                onClick={handleBack}
              >
                Back to Start
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
