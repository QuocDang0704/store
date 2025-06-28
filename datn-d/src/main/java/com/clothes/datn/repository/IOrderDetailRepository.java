package com.clothes.datn.repository;

import com.clothes.datn.entities.OrderDetail;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IOrderDetailRepository extends IBaseRepository<OrderDetail, Long> {
}
