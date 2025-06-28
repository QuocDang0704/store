package com.clothes.datn.service;

import com.clothes.datn.dto.WarehouseEntryDto;
import com.clothes.datn.dto.response.ResWarehouseEntryDto;
import com.clothes.datn.entities.*;
import com.clothes.datn.repository.IProductDetailRepository;
import com.clothes.datn.repository.IWarehouseEntryDetailRepository;
import com.clothes.datn.repository.IWarehouseEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WarehouseEntryService {
    @Autowired
    private IWarehouseEntryRepository entryRepository;
    @Autowired
    private IWarehouseEntryDetailRepository entryDetailRepository;
    @Autowired
    private IProductDetailRepository productDetailRepository;
    @Autowired
    private UserService userService;

    @Value("${kidi.uri.path}")
    private String uri;

    public Page<WarehouseEntry> getAll(Pageable pageable) {
        Page<WarehouseEntry> entries = this.entryRepository.findAll(pageable);
        Page<WarehouseEntry> entriesRes = entries.map(entry -> {
            entry.getWarehouseEntryDetails().forEach(detail -> {
                String images = detail.getProductDetail().getImages();
                if (!images.startsWith(uri)) {
                    images = uri + images;
                }
                detail.getProductDetail().setImages(images);
            });
            return entry;
        });

        return entriesRes;
    }

    public WarehouseEntry getById(Long id) {
        return entryRepository.findByIdOrThrow(id);
    }

    public WarehouseEntry createWarehouseEntry(WarehouseEntryDto entryDto) {
        User user = userService.getCurrentUser();
        WarehouseEntry entry = WarehouseEntry.builder()
                .user(User.builder().id(user.getId()).build())
                .build();
        WarehouseEntry entrySave = this.entryRepository.save(entry);
        List<WarehouseEntryDetail> details = entryDto.getWarehouseEntryDetails().stream().map(
                dto -> {
                    return WarehouseEntryDetail
                            .builder()
                            .warehouseEntry(entrySave)
                            .productDetail(ProductDetail.builder().id(dto.getProductDetailId()).build())
                            .price(dto.getPrice())
                            .quantity(dto.getQuantity())
                            .total(dto.getTotal())
                            .build();
                }
        ).collect(Collectors.toList());
        this.entryDetailRepository.saveAll(details);

        entryDto.getWarehouseEntryDetails().stream().forEach(dto -> {
            ProductDetail productDetail = this.productDetailRepository.findByIdOrThrow(dto.getProductDetailId());
            productDetail.setQuantity(productDetail.getQuantity() + dto.getQuantity());
            this.productDetailRepository.save(productDetail);
        });

        return this.entryRepository.findByIdOrThrow(entrySave.getId());
    }
}
