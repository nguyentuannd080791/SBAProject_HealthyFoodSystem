import { useState } from "react";
import { Alert, Button, Card, Spinner } from "react-bootstrap";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { MapPinIcon } from "../../../shared/components/Icons";
import { useAddresses } from "../hooks/useAddresses";
import { formatAddress } from "../utils/addressMapping";
import { AddressForm } from "./AddressForm";
import { AddressList } from "./AddressList";

export function AddressSection() {
  const state = useAddresses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [removingAddress, setRemovingAddress] = useState(null);
  const [notice, setNotice] = useState("");

  function openForm(address) {
    setNotice("");
    setEditingAddress(address);
    setIsFormOpen(true);
  }

  async function handleSave(values) {
    const isEditing = Boolean(editingAddress);
    const result = isEditing
      ? await state.update(editingAddress.id, values)
      : await state.add(values);
    if (result.error) return;
    setIsFormOpen(false);
    setNotice(isEditing ? "Đã cập nhật địa chỉ." : "Đã thêm địa chỉ.");
  }

  async function handleConfirmRemove() {
    const result = await state.remove(removingAddress.id);
    setRemovingAddress(null);
    if (!result.error) setNotice("Đã xóa địa chỉ.");
  }

  async function handleMakeDefault(address) {
    setNotice("");
    const result = await state.makeDefault(address.id);
    if (!result.error) setNotice("Đã đặt làm địa chỉ mặc định.");
  }

  return (
    <Card body className="border-0 shadow-sm rounded-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 44,
              height: 44,
              backgroundColor: "#f0fdf4",
              color: "var(--hf-primary)",
            }}
          >
            <MapPinIcon size={22} />
          </div>
          <div>
            <h2 className="h5 mb-1 fw-bold">Địa chỉ giao hàng</h2>
            <p className="text-muted small mb-0">
              Quản lý danh sách địa chỉ nhận món ăn của bạn.
            </p>
          </div>
        </div>
        {state.addresses && !isFormOpen && (
          <Button
            variant="outline-primary"
            size="sm"
            className="rounded-pill px-3"
            onClick={() => openForm(null)}
          >
            Thêm địa chỉ mới
          </Button>
        )}
      </div>

      {notice && <Alert variant="success">{notice}</Alert>}
      {state.actionError && <Alert variant="danger">{state.actionError}</Alert>}
      {state.loadError && <Alert variant="danger">{state.loadError}</Alert>}
      {!state.addresses && !state.loadError && (
        <Spinner animation="border" size="sm" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      )}

      {state.addresses && isFormOpen && (
        <>
          <h3 className="h6 mb-3">
            {editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h3>
          <AddressForm
            address={editingAddress}
            onSubmit={handleSave}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={state.isBusy}
          />
        </>
      )}
      {state.addresses && !isFormOpen && state.addresses.length === 0 && (
        <p className="mb-0">Bạn chưa có địa chỉ giao hàng nào.</p>
      )}
      {state.addresses && !isFormOpen && state.addresses.length > 0 && (
        <AddressList
          addresses={state.addresses}
          isBusy={state.isBusy}
          onEdit={openForm}
          onRemove={setRemovingAddress}
          onMakeDefault={handleMakeDefault}
        />
      )}

      <ConfirmDialog
        show={Boolean(removingAddress)}
        title="Xóa địa chỉ"
        message={
          removingAddress
            ? `Bạn có chắc muốn xóa địa chỉ ${formatAddress(removingAddress)}?`
            : ""
        }
        confirmLabel="Xóa"
        isBusy={state.isBusy}
        onConfirm={handleConfirmRemove}
        onCancel={() => setRemovingAddress(null)}
      />
    </Card>
  );
}
