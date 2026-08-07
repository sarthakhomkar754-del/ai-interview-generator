import React from 'react';
import CategoryPracticePage from './CategoryPracticePage';

const TechnicalPractice = () => (
  <CategoryPracticePage
    categoryName="Technical"
    icon="⚙️"
    gradient="bg-gradient-to-r from-slate-700 via-blue-800 to-indigo-800"
    description="Deep-dive into framework concepts, system design, architecture, and technology-specific theory questions."
    accentClass="from-slate-800 to-indigo-800"
  />
);

export default TechnicalPractice;
