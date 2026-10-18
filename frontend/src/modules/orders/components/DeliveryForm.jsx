import { Button, Form } from "react-bootstrap";
import { FormField } from "../../../shared/components/FormField";
import { useForm } from "../../../shared/hooks/useForm";
import { validateAddressValues } from "../../profile/utils/addressValidators";

const fieldList = [
  ["recipientName", "Tên người nhận", "text"],
  ["recipientPhone", "Số điện thoại", "tel"],
  ["street", "Số nhà, tên đường", "text"],
  ["ward", "Phường/Xã", "text"],
  ["district", "Quận/Huyện", "text"],
  ["city", "Tỉnh/Thành phố", "text"],
];

export function DeliveryForm({ initialValues, onSubmit, isSubmitting }) {
  const form = useForm(initialValues, validateAddressValues);

  return (
    <Form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <div className="row g-2">
        {fieldList.map(([name, label, type]) => (
          <div className={name === "street" ? "col-12" : "col-md-6"} key={name}>
            <FormField label={label} name={name} type={type}
              value={form.values[name]} error={form.errors[name]}
              onChange={form.handleChange} onBlur={form.handleBlur} />
          </div>
        ))}
      </div>
      <Button type="submit" className="w-100 mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
      </Button>
    </Form>
  );
}
