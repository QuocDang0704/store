package com.clothes.datn.controllers;

import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.entities.Color;
import com.clothes.datn.service.ColorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/Color")
@Tag(name = "Color", description = "Màu sắc")
@CrossOrigin(origins = "*")
public class ColorController {
    private final ColorService colorService;

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(colorService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(colorService.getById(id));
    }

    @PostMapping()
    public ResponseDTO createColor(@RequestBody Color req) {
        return ResponseDTO.success(colorService.createColor(req));
    }

    @PutMapping()
    public ResponseDTO updateColor(@RequestBody Color req) {
        return ResponseDTO.success(colorService.updateColor(req));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO deleteColor(@PathVariable("id") Long id) {
        this.colorService.deleteColor(id);
        return ResponseDTO.success();
    }

    @GetMapping("/checkProductDetailExistByColor/{id}")
    public ResponseDTO checkProductDetailExistByColor(@PathVariable("id") Long id) {
        return ResponseDTO.success(colorService.checkProductDetailExistByColor(id));
    }
}
