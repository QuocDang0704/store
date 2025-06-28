package com.clothes.datn.service;

import com.clothes.datn.entities.Role;
import com.clothes.datn.repository.IRoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class RoleService {
    private final IRoleRepository roleRepository;

    public Page<Role> getAll(Pageable pageable) {
        return this.roleRepository.findAll(pageable);
    }

    public Role getById(Long id) {
        return this.roleRepository.findByIdOrThrow(id);
    }

    public Role createRole(Role req) {
        return this.roleRepository.save(req);
    }

    public Role updateRole(Role req) {
        return this.roleRepository.save(req);
    }

    public void deleteRole(Long id) {
        this.roleRepository.deleteById(id);
    }

}
