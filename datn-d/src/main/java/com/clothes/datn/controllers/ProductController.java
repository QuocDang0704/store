package com.clothes.datn.controllers;

import com.clothes.datn.dto.ProductDetailDto;
import com.clothes.datn.dto.ProductDto;
import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.entities.Product;
import com.clothes.datn.entities.ProductDetail;
import com.clothes.datn.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/product")
@Tag(name = "Product", description = "Sản phẩm")
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;

    @GetMapping("/customer")
    public ResponseDTO getAllInCustomer(
            Pageable pageable,
            @RequestParam(value = "minPrice", required = false) Long minPrice,
            @RequestParam(value = "maxPrice", required = false) Long maxPrice,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "supplierId", required = false) Long supplierId
    ) {
        return ResponseDTO.success(productService.getAllInCustomer(minPrice, maxPrice, name, categoryId, supplierId, pageable));
    }

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(productService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(productService.getById(id));
    }

    @PostMapping()
    public ResponseDTO createProduct(
            @ModelAttribute ProductDto productDto
    ) {

        return ResponseDTO.success(productService.createProduct(productDto));
    }

    @PutMapping()
    public ResponseDTO updateProduct(
            @ModelAttribute ProductDto productDto
    ) {

        return ResponseDTO.success(productService.updateProduct(productDto));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO deleteProduct(@PathVariable("id") Long id) {
        this.productService.deleteProduct(id);
        return ResponseDTO.success();
    }

    @GetMapping("/product-details/{id}")
    public ResponseDTO getProductDetailById(@PathVariable("id") Long id) {
        return ResponseDTO.success(productService.getProductDetailById(id));
    }

    @PostMapping("/product-details")
    public ResponseDTO createProductDetail(
            @ModelAttribute ProductDetailDto req
    ) {
        return ResponseDTO.success(productService.createProductDetail(req));
    }

    @PutMapping("/product-details")
    public ResponseDTO updateProductDetail(
            @ModelAttribute ProductDetailDto req
    ) {
        return ResponseDTO.success(productService.updateProductDetail(req));
    }

    @DeleteMapping("/product-details/{id}")
    public ResponseDTO deleteProductDetail(@PathVariable("id") Long id) {
        this.productService.deleteProductDetail(id);
        return ResponseDTO.success();
    }

    @GetMapping("/product-details")
    public ResponseDTO getAllProductDetail(Pageable pageable, String name) {
        return ResponseDTO.success(productService.getAllProductDetail(pageable, name));
    }
}
