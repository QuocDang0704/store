package com.clothes.datn.repository;

import com.clothes.datn.entities.Size;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISizeRepository extends IBaseRepository<Size, Long> {
}
