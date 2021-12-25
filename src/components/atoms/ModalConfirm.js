import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { API } from "../../config/api";
import LoadingWhite from "../../assets/images/loading-white.svg";

export default function ModalConfirm({ show, handleClose, getAllProduct, id }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id) => {
    setIsLoading(true);

    try {
      const response = await API.delete(`/products/${id}`);
      if (response.status === 200) {
        NotificationManager.success(
          response.data.message,
          response.data.status
        );

        getAllProduct();
        setIsLoading(false);
        handleClose();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="text-primary" centered>
      <Modal.Header>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">Are you sure want to delete this?</div>
        <div className="d-flex justify-content-end">
          {isLoading ? (
            <Button variant="primary" disabled>
              <img src={LoadingWhite} alt={LoadingWhite} height={20} />
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                className="btn-action me-2"
                onClick={() => handleDelete(id)}
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                className="btn-action"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
