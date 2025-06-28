package com.clothes.datn.dto.response;

import com.clothes.datn.entities.User;
import com.clothes.datn.entities.WarehouseEntryDetail;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ResWarehouseEntryDto {
    private Long id;
    private User user;
    private List<ResWarehouseEntryDetailDto> warehouseEntryDetails;
    private Instant createdDate;
    private Instant updatedDate;
}
