export const getOutfitSuggestions = async (bodyScanData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/outfit-suggestions', bodyScanData);
      return response.data;
    } catch (error) {
      console.error('Error getting outfit suggestions:', error);
      throw error;
    }
  };
  