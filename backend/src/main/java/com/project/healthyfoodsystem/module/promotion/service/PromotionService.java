package com.project.healthyfoodsystem.module.promotion.service;

import com.project.healthyfoodsystem.module.exception.ProductInputException;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import com.project.healthyfoodsystem.module.promotion.dto.PromotionRequest;
import com.project.healthyfoodsystem.module.promotion.dto.PromotionResponse;
import com.project.healthyfoodsystem.module.promotion.entity.Promotion;
import com.project.healthyfoodsystem.module.promotion.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PromotionService {
    private final PromotionRepository promotions;
    private final ProductRepository products;

    @Transactional(readOnly = true)
    public List<PromotionResponse> list() {
        return promotions.findAllByOrderByIdDesc().stream().map(this::response).toList();
    }

    @Transactional
    public PromotionResponse create(PromotionRequest request) {
        Promotion promotion = new Promotion();
        apply(promotion, request);
        if (promotion.getProducts().stream()
                .anyMatch(product -> !Boolean.TRUE.equals(product.getCategory().getIsActive()))) {
            throw new ProductInputException("productIds", "Không thể chọn sản phẩm thuộc danh mục ngừng hoạt động.");
        }
        return response(promotions.saveAndFlush(promotion));
    }

    @Transactional
    public PromotionResponse update(Integer id, PromotionRequest request) {
        Promotion promotion = find(id);
        apply(promotion, request);
        return response(promotions.saveAndFlush(promotion));
    }

    @Transactional
    public PromotionResponse setEnabled(Integer id, boolean enabled) {
        Promotion promotion = find(id);
        promotion.setEnabled(enabled);
        return response(promotions.saveAndFlush(promotion));
    }

    private Promotion find(Integer id) {
        return promotions.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khuyến mãi."));
    }

    private void apply(Promotion promotion, PromotionRequest request) {
        String name = request.name().trim();
        if (name.isEmpty() || name.length() > 120)
            throw new ProductInputException("name", "Tên chương trình cần từ 1 đến 120 ký tự.");
        if (!"percentage".equals(request.type()) && !"fixed".equals(request.type()))
            throw new ProductInputException("type", "Loại giảm giá không hợp lệ.");
        BigDecimal value = request.value();
        if (value.signum() <= 0 || ("percentage".equals(request.type())
                && (value.compareTo(BigDecimal.valueOf(100)) > 0 || value.scale() > 2))
                || ("fixed".equals(request.type()) && (value.scale() > 0 && value.stripTrailingZeros().scale() > 0)))
            throw new ProductInputException("value", "Mức giảm không hợp lệ.");
        if (request.endsAt().compareTo(request.startsAt()) <= 0)
            throw new ProductInputException("endsAt", "Thời gian kết thúc phải sau thời gian bắt đầu.");
        Set<Integer> ids = new LinkedHashSet<>(request.productIds());
        if (ids.size() != request.productIds().size())
            throw new ProductInputException("productIds", "Sản phẩm không được chọn trùng.");
        List<Product> selected = products.findAllById(ids);
        if (selected.size() != ids.size())
            throw new ProductInputException("productIds", "Có sản phẩm không tồn tại.");
        if ("fixed".equals(request.type()) && selected.stream()
                .anyMatch(product -> value.compareTo(product.getPrice()) > 0))
            throw new ProductInputException("value", "Số tiền giảm không được vượt giá sản phẩm.");
        promotion.setName(name);
        promotion.setType(request.type());
        promotion.setValue(value);
        promotion.setStartsAt(request.startsAt());
        promotion.setEndsAt(request.endsAt());
        promotion.setEnabled(request.enabled());
        promotion.setProducts(new LinkedHashSet<>(selected));
    }

    private PromotionResponse response(Promotion promotion) {
        return new PromotionResponse(promotion.getId(), promotion.getName(), promotion.getType(),
                promotion.getValue(), promotion.getProducts().stream().map(Product::getId).sorted().toList(),
                promotion.getStartsAt(), promotion.getEndsAt(), promotion.isEnabled(), promotion.getUpdatedAt());
    }
}
