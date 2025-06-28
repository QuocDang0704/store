package com.clothes.datn.repository;

import com.clothes.datn.entities.Order;
import com.clothes.datn.repository.custom.IBaseRepository;
import com.clothes.datn.utils.Constant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IOrderRepository extends IBaseRepository<Order, Long> {
    Page<Order> findAllByUserIdAndStatus(Long userId, Constant.OderStatus status, Pageable pageable);

    Page<Order> findAllByStatus(Constant.OderStatus status, Pageable pageable);

    @Query(value = "SELECT months.month AS 'MONTH', COALESCE(SUM(o.total), 0) AS totalAmount " +
            "FROM ( " +
            "    SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 " +
            "    UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 " +
            ") AS months " +
            "LEFT JOIN `order` o ON MONTH(o.created_date) = months.month AND YEAR(o.created_date) = :year AND o.status != 4 " +
            "GROUP BY months.month", nativeQuery = true)
    List<Object[]> findTotalAmountByMonth(@Param("year") String year);

    @Query(value = "SELECT months.month AS 'MONTH', COALESCE(SUM(wd.total), 0) AS totalAmount " +
            "FROM ( " +
            "    SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 " +
            "    UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 " +
            ") AS months " +
            "LEFT JOIN `warehouse_entry` o  ON MONTH(o.created_date) = months.month AND YEAR(o.created_date) = :year " +
            "LEFT JOIN `warehouse_entry_detail` wd ON o.id = wd.warehouse_entry_id " +
            "GROUP BY months.month", nativeQuery = true)
    List<Object[]> findTotalImportAmountByMonth(@Param("year") String year);

    @Query(value = "SELECT YEAR(o.created_date) AS YEAR from `order` o GROUP BY YEAR(o.created_date)", nativeQuery = true)
    List<Object[]> findListYear();
}
