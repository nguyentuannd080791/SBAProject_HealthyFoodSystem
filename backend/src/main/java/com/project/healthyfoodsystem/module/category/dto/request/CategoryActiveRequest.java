package com.project.healthyfoodsystem.module.category.dto.request;

import jakarta.validation.constraints.NotNull;

public record CategoryActiveRequest(@NotNull Boolean active) { }
