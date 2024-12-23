import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import type { Metadata } from '../contexts/MetadataContext';

interface Props {
  metadata: Metadata;
  setMetadata: React.Dispatch<React.SetStateAction<Metadata>>;
}

export default function MetadataModal({ metadata, setMetadata }: Props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMetadata({
      apiBase: e.currentTarget.apiBase.value,
    });

    handleClose();
  };

  return (
    <>
      <Button size="sm" variant="primary" onClick={handleShow}>
        Settings
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>App settings</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>API base URL</Form.Label>
              <Form.Control
                type="text"
                name="apiBase"
                defaultValue={metadata.apiBase}
                autoFocus
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
