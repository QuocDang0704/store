package com.clothes.datn.service;

import com.clothes.datn.entities.Color;
import com.clothes.datn.repository.IColorRepository;
import com.clothes.datn.repository.IProductDetailRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ColorService {
    private final IColorRepository colorRepository;
    private final IProductDetailRepository productDetailRepository;

    public Page<Color> getAll(Pageable pageable) {
        return colorRepository.findAll(pageable);
    }

    public Color getById(Long id) {
        return colorRepository.findByIdOrThrow(id);
    }

    public Color createColor(Color res) {
        return colorRepository.save(res);
    }

    public Color updateColor(Color res) {
        return colorRepository.save(res);
    }

    public void deleteColor(Long id) {
        colorRepository.deleteById(id);
    }

    public boolean checkProductDetailExistByColor(Long id) {
        return productDetailRepository.findProductDetailByColorId(id).size() > 0;
    }
}
