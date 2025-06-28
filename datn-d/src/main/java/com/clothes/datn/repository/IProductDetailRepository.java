package com.clothes.datn.repository;

import com.clothes.datn.entities.Product;
import com.clothes.datn.entities.ProductDetail;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductDetailRepository extends IBaseRepository<ProductDetail, Long> {
    @Query("Select p from Product p join ProductDetail pd on p.id = pd.product.id where pd.id = ?1")
    Product findProductByProductDetailId(Long id);

    @Query("Select pd from Product p join ProductDetail pd on p.id = pd.product.id where p.name like %?1%")
    Page<ProductDetail> findProductDetailByName(String name, org.springframework.data.domain.Pageable pageable);

    @Query("select p from ProductDetail p where p.size.id = ?1")
    List<ProductDetail> findProductDetailBySizeId(Long id);

    @Query("select p from ProductDetail p where p.color.id = ?1")
    List<ProductDetail> findProductDetailByColorId(Long id);
}
