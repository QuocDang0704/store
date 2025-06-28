package com.clothes.datn.repository;

import com.clothes.datn.entities.Role;
import com.clothes.datn.entities.User;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IRoleRepository extends IBaseRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
