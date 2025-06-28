package com.clothes.datn.controllers;

import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.entities.Category;
import com.clothes.datn.entities.User;
import com.clothes.datn.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/category")
@Tag(name = "Category", description = "Danh muc")
@CrossOrigin(origins = "*")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(categoryService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(categoryService.getById(id));
    }

    @PostMapping()
    public ResponseDTO createCategory(@RequestBody Category req) {
        return ResponseDTO.success(categoryService.createCategory(req));
    }

    @PutMapping()
    public ResponseDTO updateCategory(@RequestBody Category req) {
        return ResponseDTO.success(categoryService.updateCategory(req));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO deleteCategory(@PathVariable("id") Long id) {
        this.categoryService.deleteCategory(id);
        return ResponseDTO.success();
    }

    @GetMapping("/checkProductExistByCategory/{id}")
    public ResponseDTO checkProductExistByCategory(@PathVariable("id") Long id) {
        return ResponseDTO.success(categoryService.checkProductExistByCategory(id));
    }
}
