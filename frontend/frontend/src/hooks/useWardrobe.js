import { useState, useEffect } from 'react';

export const useWardrobe = () => {
  const [wardrobe, setWardrobe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWardrobe = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.token) {
      setError('Not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/wardrobe', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json.error);
      }
      
      setWardrobe(json);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const addItem = async (itemData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/wardrobe/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(itemData)
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error);
    }

    // Refresh wardrobe data
    await fetchWardrobe();
    return json;
  };

  useEffect(() => {
    fetchWardrobe();
  }, []);

  return { wardrobe, isLoading, error, addItem, refreshWardrobe: fetchWardrobe };
};