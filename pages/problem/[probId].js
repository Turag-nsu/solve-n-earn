import { useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, TextField, Button, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProblemContainer = styled(Box)({
  width: '90%',
  margin: 'auto',
  marginTop: '2rem',
  '@media (min-width: 600px)': {
    width: '70%',
  },
});

const SolutionForm = styled('form')({
  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const SolutionInput = styled(TextField)({
  marginBottom: '1rem',
  width: '100%',
  '@media (min-width: 600px)': {
    width: '50%',
  },
});

const SubmitButton = styled(Button)({
  width: '100%',
  '@media (min-width: 600px)': {
    width: 'auto',
  },
});

const SolutionContainer = styled(Box)({
  marginTop: '2rem',
});

const SolutionItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
});

const SolutionText = styled(Typography)({
  flexGrow: 1,
});

const SolutionUpvoteButton = styled(Button)({
  marginLeft: '1rem',
});

export async function getStaticPaths() {
  // Fetch the list of problem IDs
  const response = await fetch('http://localhost:3000/api/api');
  const data = await response.json();
  const paths = data.map((problem) => ({
    params: { probId: problem.probId },
  }));

  return {
    paths,
    fallback: true, // Enable fallback for paths not generated at build time
  };
}

export async function getStaticProps({ params }) {
  // Fetch the problem data based on the probId
  const response = await fetch(`http://localhost:3000/api/api/${params.probId}`);
  const data = await response.json();

  return {
    props: {
      problemData: data,
    },
    revalidate: 120, // Revalidate the page every 2 minutes (120 seconds)
  };
}

export default function ProblemPage({ problemData }) {
  const router = useRouter();
  const { probId } = router.query;

  // State for the solution input
  const [solution, setSolution] = useState('');

  // Function to handle submitting the solution
  const handleSubmitSolution = (e) => {
    e.preventDefault();
    // Perform the necessary logic to submit the solution
    // You can use the `solution` state value for the solution input
    // Example: Call an API endpoint to submit the solution
    console.log('Submitted solution:', solution);
    // Clear the solution input
    setSolution('');
  };

  // Function to handle upvoting a solution
  const handleSolutionUpvote = (solutionId) => {
    console.log('Upvoted solution:', solutionId);
    // Update the total upvotes for the solution
    const updatedProblemData = { ...problemData };
    const solutionIndex = updatedProblemData.solutions.findIndex(
      (solution) => solution.id === solutionId
    );
    if (solutionIndex !== -1) {
      updatedProblemData.solutions[solutionIndex].totalUpvotes += 1;
    }
    // Update the problem data state
    setProblemData(updatedProblemData);
  };

  if (router.isFallback) {
    return <div>Loading problem...</div>;
  }

  return (
    <Paper elevation={3}>
      <ProblemContainer>
        <Typography variant="h4">{problemData.title}</Typography>
        <Typography variant="subtitle1">Type: {problemData.type}</Typography>
        <Typography variant="subtitle1">Tag: {problemData.tag}</Typography>
        <Typography variant="body1" paragraph>
          {problemData.body}
        </Typography>

        <SolutionForm onSubmit={handleSubmitSolution}>
          <SolutionInput
            label="Solution"
            variant="outlined"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            fullWidth
          />
          <SubmitButton variant="contained" color="primary" type="submit">
            Submit Solution
          </SubmitButton>
        </SolutionForm>

        <SolutionContainer>
          <Typography variant="h6">Existing Solutions:</Typography>
          {problemData.solutions.map((solution) => (
            <SolutionItem key={solution.id}>
              <SolutionText>{solution.text}</SolutionText>
              <Typography variant="subtitle1" color="text.secondary">
                Upvotes: {solution.totalUpvotes}
              </Typography>
              <SolutionUpvoteButton
                variant="contained"
                color="primary"
                onClick={() => handleSolutionUpvote(solution.id)}
              >
                Upvote
              </SolutionUpvoteButton>
            </SolutionItem>
          ))}
        </SolutionContainer>
      </ProblemContainer>
    </Paper>
  );
}
