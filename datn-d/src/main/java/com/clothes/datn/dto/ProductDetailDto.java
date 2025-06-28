package com.clothes.datn.dto;

import com.clothes.datn.entities.Color;
import com.clothes.datn.entities.Product;
import com.clothes.datn.entities.Size;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ProductDetailDto {
    private Long id;
    private Long productId;
    private String productName;
    private Long colorId;
    private Long sizeId;
    private Long quantity;
    private MultipartFile imagesFile;
}
