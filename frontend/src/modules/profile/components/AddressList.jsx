import { Badge, Button } from "react-bootstrap";
import { formatAddress } from "../utils/addressMapping";
import {
  CheckIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
} from "../../../shared/components/Icons";

export function AddressList({
  addresses,
  isBusy,
  onEdit,
  onRemove,
  onMakeDefault,
}) {
  return (
    <div className="d-flex flex-column gap-3">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`address-item-card ${address.isDefault ? "is-default" : ""}`}
        >
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{
                  backgroundColor: address.isDefault ? "#dcfce7" : "#f1f5f9",
                  color: address.isDefault ? "var(--hf-primary)" : "#64748b",
                }}
              >
                <MapPinIcon size={18} />
              </div>
              <span className="fw-bold text-dark fs-6">
                {address.recipientName}
              </span>
              <span className="text-muted small">· {address.recipientPhone}</span>
              {address.isDefault && (
                <Badge
                  bg="success-subtle"
                  className="text-success border border-success-subtle px-2 py-1 small fw-normal"
                >
                  <CheckIcon size={12} className="me-1" />
                  Mặc định
                </Badge>
              )}
            </div>

            <div className="d-flex align-items-center gap-1">
              {!address.isDefault && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-pill px-3 py-1 small me-1"
                  disabled={isBusy}
                  onClick={() => onMakeDefault(address)}
                >
                  Đặt làm mặc định
                </Button>
              )}
              <Button
                variant="light"
                size="sm"
                className="rounded-3 p-2 text-secondary"
                title="Sửa địa chỉ"
                aria-label={`Sửa địa chỉ ${address.recipientName}`}
                disabled={isBusy}
                onClick={() => onEdit(address)}
              >
                <PencilIcon size={16} />
              </Button>
              <Button
                variant="light"
                size="sm"
                className="rounded-3 p-2 text-danger"
                title="Xóa địa chỉ"
                aria-label={`Xóa địa chỉ ${address.recipientName}`}
                disabled={isBusy}
                onClick={() => onRemove(address)}
              >
                <TrashIcon size={16} />
              </Button>
            </div>
          </div>

          <div className="text-secondary small ps-md-4 ms-md-3">
            {formatAddress(address)}
          </div>
        </div>
      ))}
    </div>
  );
}
