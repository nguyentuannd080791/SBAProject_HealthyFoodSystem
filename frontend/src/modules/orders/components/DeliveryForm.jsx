import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FormField } from "../../../shared/components/FormField";
import { useForm } from "../../../shared/hooks/useForm";
import { addressApi } from "../../profile/api/addressApi";
import { formatAddress } from "../../profile/utils/addressMapping";
import { validateAddressValues } from "../../profile/utils/addressValidators";

const fieldList = [
  ["recipientName", "Tên người nhận", "text"],
  ["recipientPhone", "Số điện thoại", "tel"],
  ["street", "Số nhà, tên đường", "text"],
  ["ward", "Phường/Xã", "text"],
  ["district", "Quận/Huyện", "text"],
  ["city", "Tỉnh/Thành phố", "text"],
];

function addressToValues(addr) {
  return {
    recipientName: addr.recipientName || "",
    recipientPhone: addr.recipientPhone || "",
    street: addr.street || "",
    ward: addr.ward || "",
    district: addr.district || "",
    city: addr.city || "",
  };
}

export function DeliveryForm({ initialValues, onSubmit, isSubmitting }) {
  const form = useForm(initialValues, validateAddressValues);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  useEffect(() => {
    let active = true;
    addressApi.list().then((result) => {
      if (!active || !result.data || result.data.length === 0) return;
      const list = result.data;
      setSavedAddresses(list);
      const defaultAddr = list.find((a) => a.isDefault) || list[0];
      if (defaultAddr) {
        setSelectedAddressId(String(defaultAddr.id));
        form.setValues(addressToValues(defaultAddr));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  function handleSelectSavedAddress(e) {
    const value = e.target.value;
    setSelectedAddressId(value);
    if (value === "custom") {
      form.setValues({
        recipientName: initialValues.recipientName || "",
        recipientPhone: "",
        street: "",
        ward: "",
        district: "",
        city: "",
      });
      return;
    }
    const target = savedAddresses.find((a) => String(a.id) === value);
    if (target) {
      form.setValues(addressToValues(target));
    }
  }

  return (
    <Form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      {savedAddresses.length > 0 && (
        <Form.Group className="mb-3" controlId="savedAddressSelector">
          <Form.Label className="small fw-semibold text-secondary">
            Sổ địa chỉ đã lưu
          </Form.Label>
          <Form.Select
            value={selectedAddressId}
            onChange={handleSelectSavedAddress}
            className="form-select-sm py-2"
          >
            {savedAddresses.map((addr) => (
              <option key={addr.id} value={String(addr.id)}>
                {addr.recipientName} - {addr.recipientPhone} (
                {formatAddress(addr)}) {addr.isDefault ? "[Mặc định]" : ""}
              </option>
            ))}
            <option value="custom">+ Nhập địa chỉ nhận hàng khác</option>
          </Form.Select>
        </Form.Group>
      )}

      <div className="row g-3">
        {fieldList.map(([name, label, type]) => (
          <div
            className={name === "street" ? "col-12" : "col-md-6"}
            key={name}
          >
            <FormField
              label={label}
              name={name}
              type={type}
              value={form.values[name]}
              error={form.errors[name]}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </div>
        ))}
      </div>
      <Button type="submit" className="w-100 mt-3" disabled={isSubmitting}>
        {isSubmitting ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
      </Button>
    </Form>
  );
}
