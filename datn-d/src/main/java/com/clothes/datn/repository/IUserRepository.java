package com.clothes.datn.repository;

import com.clothes.datn.entities.User;
import com.clothes.datn.repository.custom.IBaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends IBaseRepository<User, Long> {
    Optional<User> findByUserName(String userName);

}
