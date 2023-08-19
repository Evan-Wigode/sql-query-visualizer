import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [executedQuery, setExecutedQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/execute', { query });
      setResults(response.data);
      setExecutedQuery(query);  // store the executed query
      setQuery('');
    } catch (error) {
      console.error("There was an error executing the query:", error);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', overflow: 'auto' }}>
      <Container maxWidth="md" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '30px', boxShadow: '0 3px 10px rgba(0,0,0,0.2)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            SQL Query Visualizer
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => setOpenDialog(true)}>
            Instructions & Samples
          </Button>
          </Box>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Instructions & Sample SQL Commands</DialogTitle>
              <DialogContent>
                <Typography gutterBottom>
                  Here's how to use the SQL Query Visualizer: 
                  <br />
                  1. Type your SQL query in the provided box.
                  <br /> 
                  2. Click on the "Execute" button to run the query.
                  <br /> 
                  3. View the results or errors below.
                  <br /><br />
                </Typography>
                <Typography gutterBottom>
                  Sample SQL Commands:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="SELECT * FROM SAMPLE;" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="INSERT INTO SAMPLE (NAME, age) VALUES ('John Doe', 30);" />
                  </ListItem>
                    {/* add more samples here */}
                </List>
              </DialogContent>
              <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Close
              </Button>
              </DialogActions>
          </Dialog>

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
            {executedQuery && (
              <Paper elevation={3} style={{ marginTop: '20px', padding: '20px' }}>
                <Typography variant="h6" gutterBottom>
                  Executed Query:
                </Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                  {executedQuery}
                </Typography>
              </Paper>
            )}
          </Paper>

          {results && results.status === 'success' && (
            <Paper elevation={3} style={{ marginTop: '20px', padding: '20px' }}>
              <Typography variant="h6" gutterBottom>
                Results:
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    {results.data.columns.map((col, idx) => (
                      <TableCell key={idx}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.data.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIdx) => (
                        <TableCell key={cellIdx}>{cell}</TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

          {results && results.status === 'error' && (
            <Paper elevation={3} style={{ marginTop: '20px', padding: '20px', backgroundColor: '#ffebee' }}>
              <Typography variant="h6" gutterBottom>
                Error:
              </Typography>
              <Typography variant="body1">
                {results.message}
              </Typography>
            </Paper>
          )}
      </Container>
    </div>
  );
}

export default App;