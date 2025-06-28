package com.clothes.datn.controllers;

import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.entities.Role;
import com.clothes.datn.service.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/role")
@Tag(name = "Role", description = "Chức vụ")
@CrossOrigin(origins = "*")
public class RoleController {
    private final RoleService roleService;

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(this.roleService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(this.roleService.getById(id));
    }

    @PostMapping()
    public ResponseDTO createUser(@RequestBody Role req) {
        return ResponseDTO.success(this.roleService.createRole(req));
    }

    @PutMapping()
    public ResponseDTO updateUser(@RequestBody Role req) {
        return ResponseDTO.success(this.roleService.updateRole(req));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO deleteUser(@PathVariable("id") Long id) {
        this.roleService.deleteRole(id);
        return ResponseDTO.success();
    }
}
