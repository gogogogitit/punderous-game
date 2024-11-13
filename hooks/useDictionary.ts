import { useState, useEffect } from 'react';

export function useDictionary() {
  const [dictionary, setDictionary] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadDictionary() {
      try {
        const response = await fetch('/compressed-dictionary.json');
        const words = await response.json();
        setDictionary(new Set(words));
      } catch (error) {
        console.error('Error loading dictionary:', error);
      }
    }

    loadDictionary();
  }, []);

  return dictionary;
}