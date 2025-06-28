package com.clothes.datn.dto.response;

import com.clothes.datn.entities.Category;
import com.clothes.datn.entities.Supplier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ResProductDto {
    private Long id;
    private Category category;
    private Supplier supplier;
    private String description;
    private String material;
    private String name;
    private String images;
    private Long price;
}
