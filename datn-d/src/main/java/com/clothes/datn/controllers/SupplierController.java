package com.clothes.datn.controllers;

import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.entities.Supplier;
import com.clothes.datn.service.SupplierService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/supplier")
@Tag(name = "supplier", description = "Nhà cung cấp")
@CrossOrigin(origins = "*")
public class SupplierController {
    private final SupplierService supplierService;

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(supplierService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(supplierService.getById(id));
    }

    @PostMapping()
    public ResponseDTO createSupplier(@RequestBody Supplier req) {
        return ResponseDTO.success(supplierService.createSupplier(req));
    }

    @PutMapping()
    public ResponseDTO updateSupplier(@RequestBody Supplier req) {
        return ResponseDTO.success(supplierService.updateSupplier(req));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO deleteSupplier(@PathVariable("id") Long id) {
        this.supplierService.deleteSupplier(id);
        return ResponseDTO.success();
    }
}
