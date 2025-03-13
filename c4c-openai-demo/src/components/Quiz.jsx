import React, { useState, useRef } from 'react';
import {
  Container,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  styled,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Question from './Question';

// Mock data
const MOCK_QUESTIONS = [
  {
    text: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  }
];

const StyledUploadZone = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  padding: theme.spacing(8),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)'
  }
}));

const Quiz = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsProcessing(true);
    // Simulate file processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setUploadComplete(true);
      setQuestions(MOCK_QUESTIONS);
    }, 2000);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = () => {
    const correctCount = questions.reduce((acc, question, index) => {
      return acc + (userAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    setScore((correctCount / questions.length) * 100);
  };

  const allAnswered = Object.keys(userAnswers).length === questions.length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" gutterBottom>
          Document Quiz Generator
        </Typography>
        <Typography color="text.secondary">
          Upload your document to generate a personalized quiz
        </Typography>
      </Box>

      {/* Hidden file input */}
      <input
        accept=".txt,.pdf,.doc,.docx"
        style={{ display: 'none' }}
        id="upload-document"
        type="file"
        onChange={handleFileUpload}
        ref={fileInputRef}
      />

      {/* Upload Section - Only shows when no questions */}
      {!uploadComplete && (
        <Box mb={6}>
          <StyledUploadZone 
            variant="outlined" 
            onClick={() => fileInputRef.current.click()}
          >
            <Box>
              <CloudUploadIcon fontSize="large" color="primary" />
              <Typography variant="h6" gutterBottom>
                {isProcessing ? 'Processing Document...' : 'Click to Upload Document'}
              </Typography>
              <Typography color="text.secondary">
                Supported formats: .txt, .pdf, .doc, .docx
              </Typography>
              {isProcessing && (
                <Box mt={2}>
                  <CircularProgress size={24} />
                  <Typography variant="body2">
                    Analyzing document content...
                  </Typography>
                </Box>
              )}
            </Box>
          </StyledUploadZone>
        </Box>
      )}

      {/* Questions Section - Only shows after upload */}
      {uploadComplete && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Generated Quiz
          </Typography>

          {questions.map((question, index) => (
            <Question
              key={index}
              question={question.text}
              options={question.options}
              selectedAnswer={userAnswers[index]}
              onAnswerSelect={(answer) => handleAnswerSelect(index, answer)}
            />
          ))}

          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!allAnswered}
              sx={{ px: 6, py: 1.5 }}
            >
              Submit Answers
            </Button>
          </Box>
        </Box>
      )}

      {/* Results Section */}
      {score !== null && (
        <Box mt={4} textAlign="center">
          <Alert
            severity={score >= 70 ? 'success' : 'error'}
            sx={{ py: 3, fontSize: '1.25rem' }}
          >
            Your Score: <strong>{score.toFixed(1)}%</strong>
          </Alert>
          <Box mt={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setScore(null);
                setUserAnswers({});
                setQuestions([]);
                setUploadComplete(false);
              }}
            >
              Start Over
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Quiz;