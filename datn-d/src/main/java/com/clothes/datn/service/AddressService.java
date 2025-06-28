package com.clothes.datn.service;

import com.clothes.datn.entities.Address;
import com.clothes.datn.entities.User;
import com.clothes.datn.repository.IAddressRepository;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class AddressService {
    private final IAddressRepository addressRepository;
    private final UserService userService;

    public Page<Address> getAllUser(Pageable pageable) {
        User user = userService.getCurrentUser();
        return addressRepository.findAllByUserId(user.getId(), pageable);
    }

    public Page<Address> getAll(Pageable pageable) {
        return addressRepository.findAll(pageable);
    }

    public Address getById(Long id) {
        return addressRepository.findByIdOrThrow(id);
    }

    public Address createAddress(Address res) {
        User user = userService.getCurrentUser();
        res.setUser(user);
        return addressRepository.save(res);
    }

    public Address updateAddress(Address res) {
        User user = userService.getCurrentUser();
        res.setUser(user);
        return addressRepository.save(res);
    }

    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }
}
