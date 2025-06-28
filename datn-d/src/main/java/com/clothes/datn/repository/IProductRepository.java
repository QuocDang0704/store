package com.clothes.datn.repository;

import com.clothes.datn.entities.Product;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductRepository extends IBaseRepository<Product, Long> {
    @Query("select p from Product p where p.category.id = ?1")
    List<Product> findByCategoryId(Long categoryId);

    Page<Product> findAllByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Product> findAllByPriceBetween(Long minPrice, Long maxPrice, Pageable pageable);

    Page<Product> findAllByPriceBetweenAndNameContainingIgnoreCase(Long minPrice, Long maxPrice, String name, Pageable pageable);

    // New methods for filtering by category and supplier
    Page<Product> findAllByCategoryId(Long categoryId, Pageable pageable);
    
    Page<Product> findAllBySupplierId(Long supplierId, Pageable pageable);
    
    Page<Product> findAllByCategoryIdAndSupplierId(Long categoryId, Long supplierId, Pageable pageable);
    
    Page<Product> findAllByNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId, Pageable pageable);
    
    Page<Product> findAllByNameContainingIgnoreCaseAndSupplierId(String name, Long supplierId, Pageable pageable);
    
    Page<Product> findAllByNameContainingIgnoreCaseAndCategoryIdAndSupplierId(String name, Long categoryId, Long supplierId, Pageable pageable);
    
    Page<Product> findAllByPriceBetweenAndCategoryId(Long minPrice, Long maxPrice, Long categoryId, Pageable pageable);
    
    Page<Product> findAllByPriceBetweenAndSupplierId(Long minPrice, Long maxPrice, Long supplierId, Pageable pageable);
    
    Page<Product> findAllByPriceBetweenAndCategoryIdAndSupplierId(Long minPrice, Long maxPrice, Long categoryId, Long supplierId, Pageable pageable);
    
    Page<Product> findAllByPriceBetweenAndNameContainingIgnoreCaseAndCategoryId(Long minPrice, Long maxPrice, String name, Long categoryId, Pageable pageable);
    
    Page<Product> findAllByPriceBetweenAndNameContainingIgnoreCaseAndSupplierId(Long minPrice, Long maxPrice, String name, Long supplierId, Pageable pageable);
    
    Page<Product> findAllByPriceBetweenAndNameContainingIgnoreCaseAndCategoryIdAndSupplierId(Long minPrice, Long maxPrice, String name, Long categoryId, Long supplierId, Pageable pageable);

    default Page<Product> findProductInCustomer(Long minPrice, Long maxPrice, String name, Long categoryId, Long supplierId, Pageable pageable) {
        // Check if we need to filter by category and supplier
        boolean hasCategoryFilter = categoryId != null;
        boolean hasSupplierFilter = supplierId != null;
        boolean hasPriceFilter = (minPrice != null && maxPrice != null && maxPrice > 0);
        boolean hasNameFilter = name != null && !name.trim().isEmpty();
        
        // If no category or supplier filter, use the original logic
        if (!hasCategoryFilter && !hasSupplierFilter) {
            if (!hasPriceFilter) {
                if (!hasNameFilter) {
                    return findAll(pageable);
                } else {
                    return findAllByNameContainingIgnoreCase(name, pageable);
                }
            } else {
                if (!hasNameFilter) {
                    return findAllByPriceBetween(minPrice, maxPrice, pageable);
                } else {
                    return findAllByPriceBetweenAndNameContainingIgnoreCase(minPrice, maxPrice, name, pageable);
                }
            }
        }
        
        // With category and/or supplier filters
        if (!hasPriceFilter) {
            if (!hasNameFilter) {
                if (hasCategoryFilter && hasSupplierFilter) {
                    return findAllByCategoryIdAndSupplierId(categoryId, supplierId, pageable);
                } else if (hasCategoryFilter) {
                    return findAllByCategoryId(categoryId, pageable);
                } else {
                    return findAllBySupplierId(supplierId, pageable);
                }
            } else {
                if (hasCategoryFilter && hasSupplierFilter) {
                    return findAllByNameContainingIgnoreCaseAndCategoryIdAndSupplierId(name, categoryId, supplierId, pageable);
                } else if (hasCategoryFilter) {
                    return findAllByNameContainingIgnoreCaseAndCategoryId(name, categoryId, pageable);
                } else {
                    return findAllByNameContainingIgnoreCaseAndSupplierId(name, supplierId, pageable);
                }
            }
        } else {
            if (!hasNameFilter) {
                if (hasCategoryFilter && hasSupplierFilter) {
                    return findAllByPriceBetweenAndCategoryIdAndSupplierId(minPrice, maxPrice, categoryId, supplierId, pageable);
                } else if (hasCategoryFilter) {
                    return findAllByPriceBetweenAndCategoryId(minPrice, maxPrice, categoryId, pageable);
                } else {
                    return findAllByPriceBetweenAndSupplierId(minPrice, maxPrice, supplierId, pageable);
                }
            } else {
                if (hasCategoryFilter && hasSupplierFilter) {
                    return findAllByPriceBetweenAndNameContainingIgnoreCaseAndCategoryIdAndSupplierId(minPrice, maxPrice, name, categoryId, supplierId, pageable);
                } else if (hasCategoryFilter) {
                    return findAllByPriceBetweenAndNameContainingIgnoreCaseAndCategoryId(minPrice, maxPrice, name, categoryId, pageable);
                } else {
                    return findAllByPriceBetweenAndNameContainingIgnoreCaseAndSupplierId(minPrice, maxPrice, name, supplierId, pageable);
                }
            }
        }
    }
}
