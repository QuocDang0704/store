package com.clothes.datn.service;

import com.clothes.datn.entities.Voucher;
import com.clothes.datn.repository.IVoucherRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class VoucherService {
    private final IVoucherRepository voucherRepository;

    public Page<Voucher> getAll(Pageable pageable) {
        return voucherRepository.findAll(pageable);
    }

    public Voucher getById(Long id) {
        return voucherRepository.findByIdOrThrow(id);
    }

    public Voucher createVoucher(Voucher res) {
        return voucherRepository.save(res);
    }

    public Voucher updateVoucher(Voucher res) {
        return voucherRepository.save(res);
    }

    public void deleteVoucher(Long id) {
        voucherRepository.deleteById(id);
    }
}
