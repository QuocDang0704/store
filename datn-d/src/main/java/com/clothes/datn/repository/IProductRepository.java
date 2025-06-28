package com.clothes.datn.repository;

import com.clothes.datn.entities.Product;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductRepository extends IBaseRepository<Product, Long> {
    @Query("select p from Product p where p.category.id = ?1")
    List<Product> findByCategoryId(Long categoryId);

    Page<Product> findAllByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Product> findAllByPriceBetween(Long minPrice, Long maxPrice, Pageable pageable);

    Page<Product> findAllByPriceBetweenAndNameContainingIgnoreCase(Long minPrice, Long maxPrice, String name, Pageable pageable);

    default Page<Product> findProductInCustomer(Long minPrice, Long maxPrice, String name, Pageable pageable) {
        if ((minPrice == null && maxPrice == null) || maxPrice==0) {
            if (name == null) {
                return findAll(pageable);
            } else {
                return findAllByNameContainingIgnoreCase(name, pageable);
            }
        } else {
            if (name == null) {
                return findAllByPriceBetween(minPrice, maxPrice, pageable);
            } else {
                return findAllByPriceBetweenAndNameContainingIgnoreCase(minPrice, maxPrice, name, pageable);
            }
        }
    }


}
