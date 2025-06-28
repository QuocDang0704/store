package com.clothes.datn.controllers;

import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.entities.Size;
import com.clothes.datn.service.SizeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/Size")
@Tag(name = "Size", description = "Kích cỡ")
@CrossOrigin(origins = "*")
public class SizeController {
    private final SizeService sizeService;

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(sizeService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(sizeService.getById(id));
    }

    @PostMapping()
    public ResponseDTO createSize(@RequestBody Size req) {
        return ResponseDTO.success(sizeService.createSize(req));
    }

    @PutMapping()
    public ResponseDTO updateSize(@RequestBody Size req) {
        return ResponseDTO.success(sizeService.updateSize(req));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO deleteSize(@PathVariable("id") Long id) {
        this.sizeService.deleteSize(id);
        return ResponseDTO.success();
    }

    @GetMapping("/checkProductDetailExistBySize/{id}")
    public ResponseDTO checkProductDetailExistBySize(@PathVariable("id") Long id) {
        return ResponseDTO.success(sizeService.checkProductDetailExistBySize(id));
    }
}
