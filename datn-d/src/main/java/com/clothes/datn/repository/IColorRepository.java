package com.clothes.datn.repository;

import com.clothes.datn.entities.Color;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IColorRepository extends IBaseRepository<Color, Long> {
}
