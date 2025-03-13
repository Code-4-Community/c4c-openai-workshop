import React from 'react';
import {
  Radio,
  FormControlLabel,
  Typography,
  Box,
  Paper,
  styled
} from '@mui/material';

const OptionCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: `2px solid ${selected ? theme.palette.primary.main : '#e0e0e0'}`,
  backgroundColor: selected ? theme.palette.primary.light : '#fff',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3]
  }
}));

const Question = ({ question, options, selectedAnswer, onAnswerSelect }) => {
  return (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>
        {question}
      </Typography>
      <Box>
        {options.map((option, index) => (
          <OptionCard
            key={index}
            selected={selectedAnswer === option}
            onClick={() => onAnswerSelect(option)}
            elevation={0}
          >
            <FormControlLabel
              value={option}
              control={<Radio sx={{ display: 'none' }} />}
              label={option}
              checked={selectedAnswer === option}
            />
          </OptionCard>
        ))}
      </Box>
    </Box>
  );
};

export default Question;