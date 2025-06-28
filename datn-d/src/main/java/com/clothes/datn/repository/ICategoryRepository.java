package com.clothes.datn.repository;

import com.clothes.datn.entities.Category;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ICategoryRepository extends IBaseRepository<Category, Long> {
}
