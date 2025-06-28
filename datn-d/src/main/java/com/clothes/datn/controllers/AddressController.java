package com.clothes.datn.controllers;

import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.entities.Address;
import com.clothes.datn.service.AddressService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/address")
@Tag(name = "Address", description = "Địa chỉ")
@CrossOrigin(origins = "*")
public class AddressController {
    private final AddressService addressService;

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(addressService.getAll(pageable));
    }
    @GetMapping("/user")
    public ResponseDTO getAllUser(Pageable pageable) {
        return ResponseDTO.success(addressService.getAllUser(pageable));
    }

    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(addressService.getById(id));
    }

    @PostMapping()
    public ResponseDTO createAddress(@RequestBody Address req) {
        return ResponseDTO.success(addressService.createAddress(req));
    }

    @PutMapping()
    public ResponseDTO updateAddress(@RequestBody Address req) {
        return ResponseDTO.success(addressService.updateAddress(req));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO deleteAddress(@PathVariable("id") Long id) {
        this.addressService.deleteAddress(id);
        return ResponseDTO.success();
    }
}
