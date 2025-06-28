package com.clothes.datn.repository;

import com.clothes.datn.entities.Address;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface IAddressRepository extends IBaseRepository<Address, Long> {
    Page<Address> findAllByUserId(Long userId, Pageable pageable);
}
