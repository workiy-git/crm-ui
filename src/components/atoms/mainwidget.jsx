import React, { createContext, useState, useEffect, useContext } from 'react';

const FeatureContext = createContext();

export const FeatureProvider = ({ children }) => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    const storedFeatures = JSON.parse(localStorage.getItem('selectedTexts')) || [];
    setSelectedFeatures(storedFeatures);
  }, []);

  const handleSaveSelectedText = (selectedTexts) => {
    setSelectedFeatures(selectedTexts);
    localStorage.setItem('selectedTexts', JSON.stringify(selectedTexts));
  };

  return (
    <FeatureContext.Provider value={{ selectedFeatures, handleSaveSelectedText }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatureContext = () => useContext(FeatureContext);
