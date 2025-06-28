package com.clothes.datn.repository;

import com.clothes.datn.entities.WarehouseEntry;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IWarehouseEntryRepository extends IBaseRepository<WarehouseEntry, Long> {

}
