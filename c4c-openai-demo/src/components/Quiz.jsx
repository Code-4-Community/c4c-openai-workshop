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
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import pdfToText from 'react-pdftotext'


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




  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPEN_AI_KEY,
    dangerouslyAllowBrowser: true
  });
  

  const QuestionObject = z.object({
    text: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
  });
  
  
  const QuizObject = z.object({
    questions: z.array(QuestionObject)
  });
  
  
  

const generateQuiz = async (content) => {
  console.log("Generating quiz...");
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: "Generate a quiz given the contents of a document. The quiz will be a list of question json objects. Each question will consist of text, 4 options, and a correect answer." },
        { role: "user", content: `Generate a quiz based on this document: ${content}`},
      ],
      response_format: zodResponseFormat(QuizObject, "quiz"),
    });
    console.log("Quiz generated!");
    const quiz = completion.choices[0].message.parsed;
    setQuestions(quiz.questions);
  }
  catch (error) {
    console.error("Error generating quiz:", error);
  }
};
  




  const handleFileUpload = (event) => {
    setIsProcessing(true);
    const file = event.target.files[0];
    if (!file) return;

    console.log("File selected:", file);
    pdfToText(file)
      .then(async text => {
        console.log("Extracted text:", text);
        await generateQuiz(text);
        setUploadComplete(true);
      })
      .catch(error => {
        console.error("pdfToText error:", error);
      })
      .finally(() => {
        setIsProcessing(false);
      });
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