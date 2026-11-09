package com.project.healthyfoodsystem.module.profile.service.impl;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import com.project.healthyfoodsystem.module.profile.dto.request.AddressRequest;
import com.project.healthyfoodsystem.module.profile.dto.response.AddressDto;
import com.project.healthyfoodsystem.module.profile.entity.DeliveryAddress;
import com.project.healthyfoodsystem.module.profile.repository.AddressRepository;
import com.project.healthyfoodsystem.module.profile.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AddressDto> listAddresses(String email) {
        User user = findUserByEmail(email);
        return addressRepository.findByUserIdOrderByDefaultAndUpdatedAt(user.getId())
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    @Transactional
    public AddressDto createAddress(String email, AddressRequest request) {
        User user = findUserByEmail(email);
        boolean isFirstAddress = addressRepository.countByUserId(user.getId()) == 0;

        DeliveryAddress address = DeliveryAddress.builder()
                .user(user)
                .recipientName(request.getRecipientName().trim())
                .recipientPhone(request.getRecipientPhone().trim())
                .street(request.getStreet().trim())
                .ward(request.getWard().trim())
                .district(request.getDistrict().trim())
                .city(request.getCity().trim())
                .isDefault(isFirstAddress)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        DeliveryAddress saved = addressRepository.save(address);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public AddressDto updateAddress(String email, Integer addressId, AddressRequest request) {
        User user = findUserByEmail(email);
        DeliveryAddress address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ với ID: " + addressId));

        address.setRecipientName(request.getRecipientName().trim());
        address.setRecipientPhone(request.getRecipientPhone().trim());
        address.setStreet(request.getStreet().trim());
        address.setWard(request.getWard().trim());
        address.setDistrict(request.getDistrict().trim());
        address.setCity(request.getCity().trim());
        address.setUpdatedAt(Instant.now());

        DeliveryAddress updated = addressRepository.save(address);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteAddress(String email, Integer addressId) {
        User user = findUserByEmail(email);
        DeliveryAddress address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ với ID: " + addressId));

        boolean wasDefault = address.isDefault();
        addressRepository.delete(address);

        if (wasDefault) {
            addressRepository.findFirstByUserIdOrderByUpdatedAtDesc(user.getId())
                    .ifPresent(remaining -> {
                        remaining.setDefault(true);
                        addressRepository.save(remaining);
                    });
        }
    }

    @Override
    @Transactional
    public AddressDto makeDefaultAddress(String email, Integer addressId) {
        User user = findUserByEmail(email);
        DeliveryAddress address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ với ID: " + addressId));

        addressRepository.resetDefaultByUserId(user.getId());
        address.setDefault(true);
        address.setUpdatedAt(Instant.now());

        DeliveryAddress updated = addressRepository.save(address);
        return mapToDto(updated);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
    }

    private AddressDto mapToDto(DeliveryAddress address) {
        return AddressDto.builder()
                .id(address.getId())
                .recipientName(address.getRecipientName())
                .recipientPhone(address.getRecipientPhone())
                .street(address.getStreet())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .isDefault(address.isDefault())
                .build();
    }
}

