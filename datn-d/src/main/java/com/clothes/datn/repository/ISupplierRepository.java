package com.clothes.datn.repository;

import com.clothes.datn.entities.Supplier;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISupplierRepository extends IBaseRepository<Supplier, Long> {
}
