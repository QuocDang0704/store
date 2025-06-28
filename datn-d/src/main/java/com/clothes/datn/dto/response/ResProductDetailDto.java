package com.clothes.datn.dto.response;

import com.clothes.datn.dto.ProductDto;
import com.clothes.datn.entities.Color;
import com.clothes.datn.entities.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ResProductDetailDto {
    private Long id;
    private ResProductDto product;
    private Color color;
    private Size size;
    private Long quantity;
    private String images;
}
