package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();
    CategoryDTO createCategory(CategoryDTO dto);
    void deleteCategory(Long id);
}
