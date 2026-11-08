package com.project.healthyfoodsystem.module.profile.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDto {

    private Integer id;
    private String recipientName;
    private String recipientPhone;
    private String street;
    private String ward;
    private String district;
    private String city;

    @JsonProperty("isDefault")
    private boolean isDefault;
}

