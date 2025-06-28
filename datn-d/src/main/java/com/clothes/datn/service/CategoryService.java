package com.clothes.datn.service;

import com.clothes.datn.entities.Category;
import com.clothes.datn.repository.ICategoryRepository;
import com.clothes.datn.repository.IProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class CategoryService {
    private final ICategoryRepository categoryRepository;
    private final IProductRepository productRepository;

    public Page<Category> getAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Category getById(Long id) {
        return categoryRepository.findByIdOrThrow(id);
    }

    public Category createCategory(Category res) {
        return categoryRepository.save(res);
    }

    public Category updateCategory(Category res) {
        return categoryRepository.save(res);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public boolean checkProductExistByCategory(Long id) {
        return productRepository.findByCategoryId(id).size() > 0;
    }
}
