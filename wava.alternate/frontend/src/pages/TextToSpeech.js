import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  Alert
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import apiService from '../services/api'; // Import the updated API service

function TextToSpeech() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('');
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [voiceOptions, setVoiceOptions] = useState([]);

  // Fetch available voices on component mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const engines = await apiService.getTtsEngines();
        const options = [];
        for (const engineKey in engines) {
          engines[engineKey].voices.forEach(v => {
            options.push({ 
              id: v.id, 
              name: `${v.name} (${engines[engineKey].name})`, 
              engine: engineKey 
            });
          });
        }
        setVoiceOptions(options);
      } catch (err) {
        setError('Failed to load voice options. Please try again later.');
        console.error(err);
      }
    };
    fetchVoices();
  }, []);

  const handleGenerate = async () => {
    setError(null);
    setAudioUrl(null);
    setIsGenerating(true);
    
    try {
      const data = { text, voice, speed, pitch };
      const result = await apiService.generateTts(data);
      
      if (result.success && result.file) {
        // In a real deployment, result.file would be a URL to the generated audio
        // For simulation/local, we might need to adjust this based on how files are served
        // For Netlify Functions, the file path might not be directly accessible.
        // We'll simulate success for now.
        setAudioUrl(`/placeholder-audio.mp3`); // Placeholder URL
        alert(`Simulated Success! Audio would be available at: ${result.file}`);
      } else {
        setError(result.error || 'Failed to generate voiceover.');
      }
    } catch (err) {
      setError('An error occurred during generation. Please check the console.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      // In a real app, this would trigger a download of the actual file
      alert(`Download requested for: ${audioUrl}`);
      // const link = document.createElement('a');
      // link.href = audioUrl; 
      // link.setAttribute('download', `voiceover_${Date.now()}.mp3`);
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          AI Voice Generator
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Create high-quality AI voiceovers for free using open-source technology
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Enter Your Text
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder="Type or paste your script here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                sx={{ mb: 3 }}
              />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select Voice</InputLabel>
                    <Select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      label="Select Voice"
                      disabled={voiceOptions.length === 0}
                    >
                      {voiceOptions.length === 0 && <MenuItem disabled>Loading voices...</MenuItem>}
                      {voiceOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography gutterBottom>Speed</Typography>
                    <Slider
                      value={speed}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onChange={(e, newValue) => setSpeed(newValue)}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  
                  <Box>
                    <Typography gutterBottom>Pitch</Typography>
                    <Slider
                      value={pitch}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onChange={(e, newValue) => setPitch(newValue)}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={isGenerating ? <CircularProgress size={24} color="inherit" /> : <MicIcon />}
                  onClick={handleGenerate}
                  disabled={!text || !voice || isGenerating || voiceOptions.length === 0}
                  sx={{ minWidth: 200 }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Voice'}
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Preview & Download
              </Typography>
              
              {audioUrl ? (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Replace with a functional audio player if possible */}
                  <audio controls style={{ width: '100%', marginBottom: '16px' }} src={audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {/* Preview button might just replay the audio element */}
                    <Button
                      variant="outlined"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => {
                        const audio = document.querySelector('audio');
                        if (audio) audio.play();
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownload}
                    >
                      Download
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '80%',
                  color: 'text.secondary'
                }}>
                  <Typography variant="body2" align="center">
                    {isGenerating ? 'Generating audio...' : 'Generate a voice to preview and download your audio'}
                  </Typography>
                  {isGenerating && <CircularProgress sx={{ mt: 2 }} />}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default TextToSpeech;

