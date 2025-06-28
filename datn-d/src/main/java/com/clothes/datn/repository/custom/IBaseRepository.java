package com.clothes.datn.repository.custom;

import com.clothes.datn.config.exception.NotFoundException;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface IBaseRepository<T, ID> extends JpaRepository<T, ID> {
    default T findByIdOrThrow(@NotNull ID id, String message) {
        return findById(id).orElseThrow(() -> new NotFoundException(message));
    }

    default T findByIdOrThrow(@NotNull ID id) {
        return findByIdOrThrow(id, "Không tìm thấy bản ghi. ");
    }

    boolean existsById(ID id);
}
