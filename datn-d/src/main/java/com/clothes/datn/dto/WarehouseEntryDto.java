package com.clothes.datn.dto;

import com.clothes.datn.entities.User;
import com.clothes.datn.entities.WarehouseEntryDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class WarehouseEntryDto {
    private Long id;
    private Long userId;
    private List<WarehouseEntryDetailDto> warehouseEntryDetails;
}
