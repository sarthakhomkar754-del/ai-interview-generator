package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.CategoryDTO;
import com.ai.interviewgenerator.entity.Category;
import com.ai.interviewgenerator.exception.BadRequestException;
import com.ai.interviewgenerator.exception.ResourceNotFoundException;
import com.ai.interviewgenerator.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(c ->
                CategoryDTO.builder().id(c.getId()).categoryName(c.getCategoryName()).build()
        ).toList();
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByCategoryNameIgnoreCase(dto.getCategoryName())) {
            throw new BadRequestException("Category already exists");
        }
        Category cat = categoryRepository.save(Category.builder().categoryName(dto.getCategoryName()).build());
        return CategoryDTO.builder().id(cat.getId()).categoryName(cat.getCategoryName()).build();
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
