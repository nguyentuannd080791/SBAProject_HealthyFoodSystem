import { Button, Col, Form, Row } from "react-bootstrap";
import { useAuth } from "../../../app/provider/useAuth";
import { FormField } from "../../../shared/components/FormField";
import { useForm } from "../../../shared/hooks/useForm";
import { validateAddressValues } from "../utils/addressValidators";

const emptyValues = {
  recipientName: "",
  recipientPhone: "",
  street: "",
  ward: "",
  district: "",
  city: "",
};

export function AddressForm({
  address,
  defaultRecipientName,
  defaultRecipientPhone,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const { user } = useAuth();
  const initialName =
    defaultRecipientName !== undefined
      ? defaultRecipientName
      : user?.fullName || "";
  const initialPhone =
    defaultRecipientPhone !== undefined
      ? defaultRecipientPhone
      : user?.phone || "";

  const initialValues = address
    ? pickFields(address)
    : {
        ...emptyValues,
        recipientName: initialName,
        recipientPhone: initialPhone,
      };
  const form = useForm(initialValues, validateAddressValues);

  return (
    <Form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <Row className="g-3">
        <Col xs={12} sm={6}>
          <FormField
            label="Tên người nhận"
            name="recipientName"
            placeholder="Ví dụ: Nguyễn Văn A"
            autoComplete="name"
            value={form.values.recipientName}
            error={form.errors.recipientName}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>

        <Col xs={12} sm={6}>
          <FormField
            label="Số điện thoại nhận hàng"
            name="recipientPhone"
            type="tel"
            placeholder="0912345678"
            autoComplete="tel"
            value={form.values.recipientPhone}
            error={form.errors.recipientPhone}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>

        <Col xs={12}>
          <FormField
            label="Số nhà, tên đường / Tòa nhà"
            name="street"
            placeholder="Ví dụ: Số 123 Đường Lê Lợi"
            autoComplete="address-line1"
            value={form.values.street}
            error={form.errors.street}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>

        <Col xs={12} sm={4}>
          <FormField
            label="Phường / Xã"
            name="ward"
            placeholder="Phường Bến Nghé"
            value={form.values.ward}
            error={form.errors.ward}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>

        <Col xs={12} sm={4}>
          <FormField
            label="Quận / Huyện"
            name="district"
            placeholder="Quận 1"
            value={form.values.district}
            error={form.errors.district}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>

        <Col xs={12} sm={4}>
          <FormField
            label="Tỉnh / Thành phố"
            name="city"
            placeholder="TP. Hồ Chí Minh"
            autoComplete="address-level1"
            value={form.values.city}
            error={form.errors.city}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
        <Button
          type="button"
          variant="outline-secondary"
          className="px-4 rounded-pill"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="px-4 fw-semibold rounded-pill"
          disabled={isSubmitting}
          style={{
            backgroundColor: "var(--hf-primary)",
            borderColor: "var(--hf-primary)",
          }}
        >
          {isSubmitting ? "Đang lưu..." : address ? "Cập nhật địa chỉ" : "Lưu địa chỉ mới"}
        </Button>
      </div>
    </Form>
  );
}

function pickFields(address) {
  return {
    recipientName: address.recipientName,
    recipientPhone: address.recipientPhone,
    street: address.street,
    ward: address.ward,
    district: address.district,
    city: address.city,
  };
}
