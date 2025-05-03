// API service for making requests to the backend
import axios from 'axios';

// Update the API_URL to use the relative path for Netlify redirects
const API_URL = '/api';

const apiService = {
  // TTS endpoints
  getTtsEngines: async () => {
    try {
      const response = await axios.get(`${API_URL}/tts/engines`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TTS engines:', error);
      throw error;
    }
  },
  
  generateTts: async (data) => {
    try {
      const formData = new FormData();
      
      // Add text and voice parameters
      formData.append('text', data.text);
      formData.append('voice', data.voice);
      
      // Add optional parameters if they exist
      if (data.speed) formData.append('speed', data.speed);
      if (data.pitch) formData.append('pitch', data.pitch);
      
      // Add reference audio if provided for voice cloning
      if (data.referenceAudio) {
        formData.append('reference_audio', data.referenceAudio);
      }
      
      const response = await axios.post(`${API_URL}/tts/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating TTS:', error);
      throw error;
    }
  },
  
  cloneVoice: async (audioFile, name) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      if (name) formData.append('name', name);
      
      const response = await axios.post(`${API_URL}/tts/clone`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error cloning voice:', error);
      throw error;
    }
  },
  
  // Video endpoints
  getBackgrounds: async () => {
    try {
      const response = await axios.get(`${API_URL}/video/backgrounds`);
      return response.data;
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
      throw error;
    }
  },
  
  getMusicOptions: async () => {
    try {
      const response = await axios.get(`${API_URL}/video/music`);
      return response.data;
    } catch (error) {
      console.error('Error fetching music options:', error);
      throw error;
    }
  },
  
  generateVideo: async (data) => {
    try {
      const formData = new FormData();
      
      // Add required parameters
      formData.append('script', data.script);
      formData.append('voice', data.voice);
      formData.append('background', data.background);
      
      // Add optional parameters
      if (data.music) formData.append('music', data.music);
      if (data.format) formData.append('format', data.format);
      
      // Add custom background if provided
      if (data.customBackground) {
        formData.append('custom_background', data.customBackground);
      }
      
      const response = await axios.post(`${API_URL}/video/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  },
  
  generateSplitScreen: async (data) => {
    try {
      const formData = new FormData();
      
      // Add required parameters
      formData.append('script', data.script);
      formData.append('voice', data.voice);
      
      // Add videos
      if (data.leftVideo) formData.append('left_video', data.leftVideo);
      if (data.rightVideo) formData.append('right_video', data.rightVideo);
      
      // Add optional parameters
      if (data.music) formData.append('music', data.music);
      if (data.format) formData.append('format', data.format);
      
      const response = await axios.post(`${API_URL}/video/split-screen`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating split-screen video:', error);
      throw error;
    }
  }
};

export default apiService;
