package com.clothes.datn.service;

import com.clothes.datn.entities.Supplier;
import com.clothes.datn.repository.ISupplierRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class SupplierService {
    private final ISupplierRepository supplierRepository;

    public Page<Supplier> getAll(Pageable pageable) {
        return supplierRepository.findAll(pageable);
    }

    public Supplier getById(Long id) {
        return supplierRepository.findByIdOrThrow(id);
    }

    public Supplier createSupplier(Supplier res) {
        return supplierRepository.save(res);
    }

    public Supplier updateSupplier(Supplier res) {
        return supplierRepository.save(res);
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}
