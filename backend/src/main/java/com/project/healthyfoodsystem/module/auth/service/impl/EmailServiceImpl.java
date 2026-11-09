package com.project.healthyfoodsystem.module.auth.service.impl;

import com.project.healthyfoodsystem.module.auth.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final String mailUsername;
    private final String fromName;

    public EmailServiceImpl(
            @Autowired(required = false) JavaMailSender mailSender,
            @Value("${MAIL_USERNAME:}") String mailUsername,
            @Value("${MAIL_FROM_NAME:Healthy Food System}") String fromName
    ) {
        this.mailSender = mailSender;
        this.mailUsername = mailUsername;
        this.fromName = fromName;
    }

    @Override
    public void sendPasswordResetOtp(String toEmail, String otpCode) {
        log.info("==========================================================");
        log.info("[OTP RESET PASSWORD] Gửi tới: {} | Mã OTP: {}", toEmail, otpCode);
        log.info("==========================================================");

        if (mailSender == null || mailUsername == null || mailUsername.isBlank()) {
            log.warn("Chưa cấu hình MAIL_USERNAME trong .env. Bỏ qua gửi email thật, sử dụng OTP từ console.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromName + " <" + mailUsername + ">");
            message.setTo(toEmail);
            message.setSubject("[" + fromName + "] Mã xác nhận đặt lại mật khẩu");
            message.setText("Xin chào,\n\n"
                    + "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Healthy Food System.\n"
                    + "Mã xác thực OTP của bạn là: " + otpCode + "\n\n"
                    + "Mã này có hiệu lực trong vòng 15 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\n"
                    + "Trân trọng,\n" + fromName);

            mailSender.send(message);
            log.info("Đã gửi email OTP thành công tới: {}", toEmail);
        } catch (Exception ex) {
            log.error("Lỗi khi gửi email qua SMTP: {}. Bạn vẫn có thể dùng mã OTP đã in ở console để tiếp tục.", ex.getMessage());
        }
    }
}

