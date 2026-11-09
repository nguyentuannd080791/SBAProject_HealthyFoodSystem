package com.project.healthyfoodsystem.module.profile.controller;

import com.project.healthyfoodsystem.module.profile.dto.request.AddressRequest;
import com.project.healthyfoodsystem.module.profile.dto.response.AddressDto;
import com.project.healthyfoodsystem.module.profile.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/addresses", "/addresses"})
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressDto>> listAddresses(Principal principal) {
        return ResponseEntity.ok(addressService.listAddresses(principal.getName()));
    }

    @PostMapping
    public ResponseEntity<AddressDto> createAddress(
            Principal principal,
            @Valid @RequestBody AddressRequest request
    ) {
        AddressDto created = addressService.createAddress(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AddressDto> updateAddressPatch(
            Principal principal,
            @PathVariable("id") Integer id,
            @Valid @RequestBody AddressRequest request
    ) {
        return ResponseEntity.ok(addressService.updateAddress(principal.getName(), id, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDto> updateAddressPut(
            Principal principal,
            @PathVariable("id") Integer id,
            @Valid @RequestBody AddressRequest request
    ) {
        return ResponseEntity.ok(addressService.updateAddress(principal.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteAddress(
            Principal principal,
            @PathVariable("id") Integer id
    ) {
        addressService.deleteAddress(principal.getName(), id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/{id}/default")
    public ResponseEntity<AddressDto> makeDefault(
            Principal principal,
            @PathVariable("id") Integer id
    ) {
        return ResponseEntity.ok(addressService.makeDefaultAddress(principal.getName(), id));
    }
}

