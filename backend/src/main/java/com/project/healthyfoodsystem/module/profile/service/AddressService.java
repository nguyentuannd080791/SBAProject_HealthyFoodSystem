package com.project.healthyfoodsystem.module.profile.service;

import com.project.healthyfoodsystem.module.profile.dto.request.AddressRequest;
import com.project.healthyfoodsystem.module.profile.dto.response.AddressDto;

import java.util.List;

public interface AddressService {

    List<AddressDto> listAddresses(String email);

    AddressDto createAddress(String email, AddressRequest request);

    AddressDto updateAddress(String email, Integer addressId, AddressRequest request);

    void deleteAddress(String email, Integer addressId);

    AddressDto makeDefaultAddress(String email, Integer addressId);
}

