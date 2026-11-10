package com.project.healthyfoodsystem.config;

import lombok.Getter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class SePaySettings {
    @Value("${payment.sepay.bank:}")
    private String bank;

    @Value("${payment.sepay.account-number:}")
    private String accountNumber;

    @Value("${payment.sepay.account-name:}")
    private String accountName;

    @Value("${payment.sepay.webhook-key:}")
    private String webhookKey;

    public String getAccountNumber() {
        return accountNumber == null ? "" : accountNumber.replaceAll("\\s+", "");
    }

    public boolean enabled() {
        return !bank.isBlank()
                && getAccountNumber().matches("[A-Za-z0-9]{1,19}")
                && !accountName.isBlank()
                && !webhookKey.isBlank();
    }
}
