package com.project.healthyfoodsystem.module.screening.config;

import com.project.healthyfoodsystem.module.screening.entity.MedicalCondition;
import com.project.healthyfoodsystem.module.screening.repository.MedicalConditionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class MedicalConditionDataInitializer implements CommandLineRunner {

    private final MedicalConditionRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        List<MedicalCondition> conditions = List.of(
                create("HYPERTENSION", "Hypertension", "Tăng huyết áp",
                        "Huyết áp cao mạn tính, cần chế độ ăn DASH giảm muối tối đa.",
                        null, null, null, new BigDecimal("15.0"), null, new BigDecimal("400.0"), null,
                        "muối,cá khô,mắm tôm,mắm tép,dưa muối,cà muối,thịt xông khói,xúc xích"),

                create("DIABETES_T2", "Type 2 Diabetes", "Đái tháo đường Type 2",
                        "Bệnh rối loạn chuyển hóa đường huyết mạn tính, cần kiểm soát nghiêm ngặt lượng đường.",
                        null, null, new BigDecimal("45.0"), null, new BigDecimal("5.0"), null, null,
                        "đường tinh luyện,nước ngọt,bánh kẹo,mật ong,siro,sữa đặc,gạo nếp,chè"),

                create("GOUT", "Gout", "Bệnh Gout (Tăng acid uric)",
                        "Lắng đọng tinh thể urat tại khớp, tuyệt đối tránh purin cao từ thịt đỏ, nội tạng, hải sản.",
                        null, new BigDecimal("22.0"), null, null, null, null, null,
                        "thịt bò,thịt dê,nội tạng,gan,cật,lòng,tôm,cua,mực,cá trích,măng tây,nấm đông cô,nước hầm xương"),

                create("CHRONIC_KIDNEY_DISEASE", "Chronic Kidney Disease", "Bệnh Thận mạn tính",
                        "Chức năng lọc của thận suy giảm, cần hạn chế natri, kali và đạm.",
                        null, new BigDecimal("15.0"), null, null, null, new BigDecimal("300.0"), new BigDecimal("300.0"),
                        "nội tạng,nước mắm mặn,chuối tiêu,sầu riêng,đậu nành,khoai tây chiên"),

                create("DYSLIPIDEMIA", "Dyslipidemia", "Rối loạn Lipid máu (Máu nhiễm mỡ)",
                        "Tăng cholesterol và triglyceride máu, hạn chế chất béo bão hòa và cholesterol.",
                        500, null, null, new BigDecimal("10.0"), null, null, null,
                        "mỡ lợn,bơ động vật,nội tạng,da gà,da vịt,đồ chiên ngập dầu,lòng đỏ trứng"),

                create("FATTY_LIVER", "Fatty Liver Disease", "Gan nhiễm mỡ",
                        "Tích tụ mỡ quá mức trong gan, kiêng tuyệt đối cồn, giảm chất béo và đường đơn.",
                        500, null, null, new BigDecimal("12.0"), new BigDecimal("5.0"), null, null,
                        "rượu bia,cồn,mỡ động vật,thịt mỡ,bánh kem,nước ngọt có ga"),

                create("CORONARY_HEART_DISEASE", "Coronary Heart Disease", "Bệnh Mạch vành / Tim mạch",
                        "Bệnh tim thiếu máu cục bộ, xơ vữa mạch vành, giảm tối đa natri và chất béo chuyển hóa.",
                        null, null, null, new BigDecimal("10.0"), null, new BigDecimal("350.0"), null,
                        "mỡ động vật,bơ thực vật,thịt xông khói,lạp xưởng,xúc xích,đồ ướp muối mặn"),

                create("PEPTIC_ULCER", "Peptic Ulcer", "Viêm loét dạ dày - tá tràng",
                        "Tổn thương niêm mạc dạ dày, tránh các chất kích thích: gia vị cay nồng, đồ chua gắt, caffeine.",
                        null, null, null, null, null, new BigDecimal("500.0"), null,
                        "ớt,tiêu,mù tạt,giấm,chanh,cóc,xoài xanh,rượu bia,cà phê,nước ngọt có ga"),

                create("GERD", "GERD", "Trào ngược dạ dày thực quản",
                        "Axit dạ dày trào ngược lên thực quản, hạn chế chất béo cao và các thực phẩm gây giãn cơ thắt.",
                        null, null, null, new BigDecimal("12.0"), null, null, null,
                        "bạc hà,sô cô la,ớt,hành sống,tỏi sống,cà chua,cà phê,nước có ga,đồ chiên béo"),

                create("HEART_FAILURE", "Heart Failure", "Suy tim",
                        "Tim giảm khả năng bơm máu, cần hạn chế tối đa natri để tránh giữ nước và phù nề.",
                        500, null, null, null, null, new BigDecimal("250.0"), null,
                        "mắm tôm,nước mắm,cá khô,thịt nguội,mì tôm,đồ đóng hộp,thực phẩm muối chua"),

                create("OBESITY", "Obesity", "Béo phì / Thừa cân",
                        "Chỉ số BMI cao, kiểm soát calo nghiêm ngặt, hạn chế đường tinh chế và dầu mỡ.",
                        450, null, null, new BigDecimal("10.0"), new BigDecimal("5.0"), null, null,
                        "mỡ lợn,sữa đặc,đồ chiên giòn,bánh ngọt,nước ngọt,trà sữa,thức ăn nhanh"),

                create("HYPERTHYROIDISM", "Hyperthyroidism", "Cường giáp",
                        "Tuyến giáp hoạt động quá mức, tránh thực phẩm giàu I-ốt và chất kích thích chuyển hóa.",
                        null, null, null, null, null, null, null,
                        "rong biển,tảo bẹ,muối i-ốt,hải sản đậm muối,cà phê đặc,nước tăng lực"),

                create("IBS", "Irritable Bowel Syndrome", "Hội chứng Ruột kích thích",
                        "Rối loạn tiêu hóa mạn tính, giảm nhóm thực phẩm FODMAP cao gây đầy hơi, co thắt.",
                        null, null, null, null, new BigDecimal("8.0"), null, null,
                        "hành tây,tỏi sống,đậu nành,sữa bò,lúa mì,chất tạo ngọt nhân tạo"),

                create("CHRONIC_PANCREATITIS", "Chronic Pancreatitis", "Viêm tụy mạn tính",
                        "Tụy ngoại tiết suy giảm, cần chế độ ăn cực kỳ ít béo để tránh kích hoạt viêm tụy cấp.",
                        null, null, null, new BigDecimal("6.0"), null, null, null,
                        "mỡ động vật,thịt mỡ,nước cốt dừa,bơ,dầu mỡ chiên rán,rượu bia"),

                create("OSTEOPOROSIS", "Osteoporosis", "Loãng xương",
                        "Suy giảm mật độ khoáng của xương, hạn chế muối natri và nước ngọt có ga.",
                        null, null, null, null, null, new BigDecimal("400.0"), null,
                        "nước ngọt có ga,cà phê đặc,rượu bia,muối mặn,trà đặc")
        );

        repository.saveAll(conditions);
    }

    private MedicalCondition create(String code, String name, String vietnameseName, String desc,
                                   Integer cal, BigDecimal protein, BigDecimal carb, BigDecimal fat,
                                   BigDecimal sugar, BigDecimal sodium, BigDecimal potassium, String forbidden) {
        MedicalCondition m = new MedicalCondition();
        m.setCode(code);
        m.setName(name);
        m.setVietnameseName(vietnameseName);
        m.setDescription(desc);
        m.setMaxCaloriesKcal(cal);
        m.setMaxProteinG(protein);
        m.setMaxCarbohydrateG(carb);
        m.setMaxFatG(fat);
        m.setMaxSugarG(sugar);
        m.setMaxSodiumMg(sodium);
        m.setMaxPotassiumMg(potassium);
        m.setForbiddenKeywords(forbidden);
        m.setActive(true);
        return m;
    }
}

