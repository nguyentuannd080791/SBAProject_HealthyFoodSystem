package com.project.healthyfoodsystem.module.nutrition.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Gender {
    MALE("Nam"),
    FEMALE("Nữ");

    private final String vietnameseLabel;
}

