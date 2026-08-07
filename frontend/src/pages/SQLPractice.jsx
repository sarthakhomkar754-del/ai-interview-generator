import React from 'react';
import CategoryPracticePage from './CategoryPracticePage';

const SQLPractice = () => (
  <CategoryPracticePage
    categoryName="SQL"
    icon="🐬"
    gradient="bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-600"
    description="Sharpen your database skills with JOIN, subquery, normalization, indexing and transaction questions."
    accentClass="from-sky-600 to-blue-700"
  />
);

export default SQLPractice;
