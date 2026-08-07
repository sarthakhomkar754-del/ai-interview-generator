import React from 'react';
import CategoryPracticePage from './CategoryPracticePage';

const CodingPractice = () => (
  <CategoryPracticePage
    categoryName="Coding"
    icon="💻"
    gradient="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"
    description="Practice DSA, algorithms and code implementation questions asked in top tech company interviews."
    accentClass="from-violet-600 to-indigo-600"
  />
);

export default CodingPractice;
