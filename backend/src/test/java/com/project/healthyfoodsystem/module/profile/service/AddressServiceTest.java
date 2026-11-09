package com.project.healthyfoodsystem.module.profile.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import com.project.healthyfoodsystem.module.profile.dto.request.AddressRequest;
import com.project.healthyfoodsystem.module.profile.dto.response.AddressDto;
import com.project.healthyfoodsystem.module.profile.entity.DeliveryAddress;
import com.project.healthyfoodsystem.module.profile.repository.AddressRepository;
import com.project.healthyfoodsystem.module.profile.service.impl.AddressServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

class AddressServiceTest {

    private AddressRepository addressRepository;
    private UserRepository userRepository;
    private AddressService addressService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        addressRepository = mock(AddressRepository.class);
        userRepository = mock(UserRepository.class);
        addressService = new AddressServiceImpl(addressRepository, userRepository);

        sampleUser = User.builder()
                .id(1)
                .email("test@example.com")
                .fullName("Nguyen Van A")
                .build();
    }

    @Test
    void listAddresses_success() {
        DeliveryAddress addr = DeliveryAddress.builder()
                .id(10)
                .user(sampleUser)
                .recipientName("Nguyen Van A")
                .recipientPhone("0912345678")
                .street("123 Le Loi")
                .ward("Ben Nghe")
                .district("Quan 1")
                .city("TP. HCM")
                .isDefault(true)
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(addressRepository.findByUserIdOrderByDefaultAndUpdatedAt(1)).thenReturn(List.of(addr));

        List<AddressDto> result = addressService.listAddresses("test@example.com");

        assertEquals(1, result.size());
        assertEquals("123 Le Loi", result.get(0).getStreet());
        assertTrue(result.get(0).isDefault());
    }

    @Test
    void createAddress_firstAddress_becomesDefault() {
        AddressRequest request = AddressRequest.builder()
                .recipientName("Nguyen Van A")
                .recipientPhone("0912345678")
                .street("123 Le Loi")
                .ward("Ben Nghe")
                .district("Quan 1")
                .city("TP. HCM")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(addressRepository.countByUserId(1)).thenReturn(0L);
        when(addressRepository.save(any(DeliveryAddress.class))).thenAnswer(invocation -> {
            DeliveryAddress saved = invocation.getArgument(0);
            saved.setId(100);
            return saved;
        });

        AddressDto result = addressService.createAddress("test@example.com", request);

        assertNotNull(result);
        assertEquals(100, result.getId());
        assertTrue(result.isDefault(), "First address should be set as default");
    }

    @Test
    void updateAddress_success() {
        DeliveryAddress existing = DeliveryAddress.builder()
                .id(10)
                .user(sampleUser)
                .recipientName("Old Name")
                .recipientPhone("0912345678")
                .street("Old Street")
                .ward("Ben Nghe")
                .district("Quan 1")
                .city("TP. HCM")
                .isDefault(false)
                .build();

        AddressRequest request = AddressRequest.builder()
                .recipientName("New Name")
                .recipientPhone("0987654321")
                .street("New Street")
                .ward("Ben Nghe")
                .district("Quan 1")
                .city("TP. HCM")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(addressRepository.findByIdAndUserId(10, 1)).thenReturn(Optional.of(existing));
        when(addressRepository.save(any(DeliveryAddress.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AddressDto result = addressService.updateAddress("test@example.com", 10, request);

        assertEquals("New Name", result.getRecipientName());
        assertEquals("New Street", result.getStreet());
    }

    @Test
    void deleteAddress_whenDefault_promotesAnotherAddressToDefault() {
        DeliveryAddress defaultAddr = DeliveryAddress.builder()
                .id(10)
                .user(sampleUser)
                .isDefault(true)
                .build();

        DeliveryAddress remainingAddr = DeliveryAddress.builder()
                .id(11)
                .user(sampleUser)
                .isDefault(false)
                .updatedAt(Instant.now())
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(addressRepository.findByIdAndUserId(10, 1)).thenReturn(Optional.of(defaultAddr));
        when(addressRepository.findFirstByUserIdOrderByUpdatedAtDesc(1)).thenReturn(Optional.of(remainingAddr));

        addressService.deleteAddress("test@example.com", 10);

        verify(addressRepository, times(1)).delete(defaultAddr);
        assertTrue(remainingAddr.isDefault());
        verify(addressRepository, times(1)).save(remainingAddr);
    }

    @Test
    void makeDefaultAddress_success() {
        DeliveryAddress addr = DeliveryAddress.builder()
                .id(10)
                .user(sampleUser)
                .isDefault(false)
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(addressRepository.findByIdAndUserId(10, 1)).thenReturn(Optional.of(addr));
        when(addressRepository.save(any(DeliveryAddress.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AddressDto result = addressService.makeDefaultAddress("test@example.com", 10);

        verify(addressRepository, times(1)).resetDefaultByUserId(1);
        assertTrue(result.isDefault());
    }

    @Test
    void addressNotFound_throwsResourceNotFoundException() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(addressRepository.findByIdAndUserId(999, 1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                addressService.makeDefaultAddress("test@example.com", 999));
    }
}

