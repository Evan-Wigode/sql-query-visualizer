import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Paper, Typography, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/execute', { query });
      setResults(response.data);
    } catch (error) {
      console.error("There was an error executing the query:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          SQL Query Visualizer
        </Typography>

        <Paper elevation={3} style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your SQL query here..."
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              type="submit"
            >
              Execute
            </Button>
          </form>
        </Paper>

        {results && (
          <Paper elevation={3} style={{ marginTop: '20px', padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Results:
            </Typography>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default App;