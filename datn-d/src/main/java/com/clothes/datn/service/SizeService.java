package com.clothes.datn.service;

import com.clothes.datn.entities.Size;
import com.clothes.datn.repository.IProductDetailRepository;
import com.clothes.datn.repository.ISizeRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class SizeService {
    private final ISizeRepository sizeRepository;
    private final IProductDetailRepository productDetailRepository;

    public Page<Size> getAll(Pageable pageable) {
        return sizeRepository.findAll(pageable);
    }

    public Size getById(Long id) {
        return sizeRepository.findByIdOrThrow(id);
    }

    public Size createSize(Size res) {
        return sizeRepository.save(res);
    }

    public Size updateSize(Size res) {
        return sizeRepository.save(res);
    }

    public void deleteSize(Long id) {
        sizeRepository.deleteById(id);
    }

    public boolean checkProductDetailExistBySize(Long id) {
        return productDetailRepository.findProductDetailBySizeId(id).size() > 0;
    }
}
