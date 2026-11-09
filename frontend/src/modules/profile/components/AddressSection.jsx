import { useState } from "react";
import { Alert, Button, Card, Modal, Spinner } from "react-bootstrap";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { MapPinIcon, PlusIcon } from "../../../shared/components/Icons";
import { useAddresses } from "../hooks/useAddresses";
import { formatAddress } from "../utils/addressMapping";
import { AddressForm } from "./AddressForm";
import { AddressList } from "./AddressList";

export function AddressSection() {
  const state = useAddresses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [removingAddress, setRemovingAddress] = useState(null);
  const [notice, setNotice] = useState("");

  function openCreateModal() {
    setNotice("");
    setEditingAddress(null);
    setIsModalOpen(true);
  }

  function openEditModal(address) {
    setNotice("");
    setEditingAddress(address);
    setIsModalOpen(true);
  }

  async function handleSave(values) {
    const isEditing = Boolean(editingAddress);
    const result = isEditing
      ? await state.update(editingAddress.id, values)
      : await state.add(values);

    if (result.error) return;

    setIsModalOpen(false);
    setNotice(isEditing ? "Đã cập nhật địa chỉ thành công." : "Đã thêm địa chỉ mới thành công.");
  }

  async function handleConfirmRemove() {
    const result = await state.remove(removingAddress.id);
    setRemovingAddress(null);
    if (!result.error) setNotice("Đã xóa địa chỉ thành công.");
  }

  async function handleMakeDefault(address) {
    setNotice("");
    const result = await state.makeDefault(address.id);
    if (!result.error) setNotice("Đã đặt làm địa chỉ mặc định thành công.");
  }

  return (
    <Card className="profile-content-card">
      <Card.Body className="p-4 p-sm-5">
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
              <h2 className="h5 mb-1 fw-bold text-dark">Sổ địa chỉ nhận hàng</h2>
              <p className="text-muted small mb-0">
                Quản lý địa chỉ giao nhận thực phẩm dinh dưỡng của bạn.
              </p>
            </div>
          </div>

          {state.addresses && state.addresses.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              className="rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1"
              onClick={openCreateModal}
              style={{
                backgroundColor: "var(--hf-primary)",
                borderColor: "var(--hf-primary)",
              }}
            >
              <PlusIcon size={16} />
              <span>Thêm địa chỉ mới</span>
            </Button>
          )}
        </div>

        {notice && (
          <Alert variant="success" className="py-2 small mb-3">
            {notice}
          </Alert>
        )}
        {state.actionError && (
          <Alert variant="danger" className="py-2 small mb-3">
            {state.actionError}
          </Alert>
        )}
        {state.loadError && (
          <Alert variant="danger" className="py-2 small mb-3">
            {state.loadError}
          </Alert>
        )}

        {!state.addresses && !state.loadError && (
          <div className="text-center py-5">
            <Spinner animation="border" size="sm" role="status" variant="success">
              <span className="visually-hidden">Đang tải...</span>
            </Spinner>
          </div>
        )}

        {state.addresses && state.addresses.length === 0 && (
          <div className="text-center py-5 px-3 border rounded-4 bg-light-subtle">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 56,
                height: 56,
                backgroundColor: "#f0fdf4",
                color: "var(--hf-primary)",
              }}
            >
              <MapPinIcon size={28} />
            </div>
            <h3 className="h6 fw-bold text-dark mb-1">Chưa có địa chỉ giao hàng</h3>
            <p
              className="text-muted small mb-3"
              style={{ maxWidth: 360, margin: "0 auto" }}
            >
              Lưu địa chỉ nhận hàng để thuận tiện đặt thực phẩm sạch và dinh dưỡng giao tận nhà.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
              onClick={openCreateModal}
              style={{
                backgroundColor: "var(--hf-primary)",
                borderColor: "var(--hf-primary)",
              }}
            >
              <PlusIcon size={16} />
              <span>Thêm địa chỉ ngay</span>
            </Button>
          </div>
        )}

        {state.addresses && state.addresses.length > 0 && (
          <AddressList
            addresses={state.addresses}
            isBusy={state.isBusy}
            onEdit={openEditModal}
            onRemove={setRemovingAddress}
            onMakeDefault={handleMakeDefault}
          />
        )}

        <Modal
          show={isModalOpen}
          onHide={() => setIsModalOpen(false)}
          centered
          size="lg"
          backdrop="static"
        >
          <Modal.Header closeButton className="border-bottom pb-3">
            <Modal.Title className="h6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <MapPinIcon size={20} className="text-success" />
              <span>
                {editingAddress ? "Cập nhật địa chỉ nhận hàng" : "Thêm địa chỉ nhận hàng mới"}
              </span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <AddressForm
              key={editingAddress ? editingAddress.id : "new-address"}
              address={editingAddress}
              onSubmit={handleSave}
              onCancel={() => setIsModalOpen(false)}
              isSubmitting={state.isBusy}
            />
          </Modal.Body>
        </Modal>

        <ConfirmDialog
          show={Boolean(removingAddress)}
          title="Xóa địa chỉ"
          message={
            removingAddress
              ? `Bạn có chắc muốn xóa địa chỉ ${formatAddress(removingAddress)}?`
              : ""
          }
          confirmLabel="Xóa địa chỉ"
          isBusy={state.isBusy}
          onConfirm={handleConfirmRemove}
          onCancel={() => setRemovingAddress(null)}
        />
      </Card.Body>
    </Card>
  );
}
