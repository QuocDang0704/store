package com.clothes.datn.controllers;

import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.dto.WarehouseEntryDto;
import com.clothes.datn.service.WarehouseEntryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/warehouse-entry")
@Tag(name = "WarehouseEntry", description = "Nhập kho")
@CrossOrigin(origins = "*")
public class WarehouseEntryController {
    private final WarehouseEntryService warehouseEntryService;

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(this.warehouseEntryService.getAll(pageable));
    }
    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(this.warehouseEntryService.getById(id));
    }

    @PostMapping()
    public ResponseDTO createWarehouseEntry(@RequestBody WarehouseEntryDto entry) {
        return ResponseDTO.success(this.warehouseEntryService.createWarehouseEntry(entry));
    }

}
