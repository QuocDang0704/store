package com.clothes.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ProductDto {
    private Long id;
    private Long categoryId;
    private Long supplierId;
    private String description;
    private String material;
    private String name;
    private String images;
    private Long price;
    private MultipartFile imagesFile;
}
