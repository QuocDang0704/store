package com.clothes.datn.controllers;

import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.entities.Voucher;
import com.clothes.datn.service.VoucherService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/voucher")
@Tag(name = "Voucher", description = "Khuyến mãi")
@CrossOrigin(origins = "*")
public class VoucherController {
    private final VoucherService voucherService;

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(voucherService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(voucherService.getById(id));
    }

    @PostMapping()
    public ResponseDTO createVoucher(@RequestBody Voucher req) {
        return ResponseDTO.success(voucherService.createVoucher(req));
    }

    @PutMapping()
    public ResponseDTO updateVoucher(@RequestBody Voucher req) {
        return ResponseDTO.success(voucherService.updateVoucher(req));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO deleteVoucher(@PathVariable("id") Long id) {
        this.voucherService.deleteVoucher(id);
        return ResponseDTO.success();
    }
}
