import { useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import type { Activity } from './Itinerary';

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  defaultValues?: Activity;
  onSubmit: (data: Activity) => Promise<Response>;
  onSuccess: (data: Activity) => void;
}

export default function ActivityEditorModal({
  title,
  open,
  onClose,
  defaultValues,
  onSuccess,
  onSubmit,
}: Props) {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ActivityEditorForm
          defaultValues={defaultValues}
          onSuccess={onSuccess}
          onSubmit={onSubmit}
        />
      </Modal.Body>
    </Modal>
  );
}

interface ActivityEditorFormProps {
  defaultValues?: Activity;
  onSubmit: (data: Activity) => Promise<Response>;
  onSuccess: (data: Activity) => void;
}

export function ActivityEditorForm({
  defaultValues,
  onSubmit,
  onSuccess,
}: ActivityEditorFormProps) {
  const [isTransportation, setIsTransportation] = useState(false);

  const category = defaultValues?.category
  const defaultStartDate = defaultValues?.date_start?.slice(0, 10);
  const defaultStartTime = defaultValues?.date_start?.slice(11);
  const defaultEndDate = defaultValues?.date_end?.slice(0, 10);
  const defaultEndTime = defaultValues?.date_end?.slice(11);

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mt-2">
        <Form.Label htmlFor="category">Category:</Form.Label>
        <Form.Select
          id="category"
          name="category"
          onChange={handleChange}
          value={category}
          disabled={Boolean(category)}
        >
          <option value="activities">Activity</option>
          <option value="transportation">Transportation</option>
          <option value="housing">Housing</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label htmlFor="name">Name:</Form.Label>
        <Form.Control
          type="text"
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          required
        />
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label htmlFor="itinerary">Itinerary #:</Form.Label>
        <Form.Control
          type="text"
          id="itinerary"
          name="itinerary"
          defaultValue={defaultValues?.itinerary}
        />
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label htmlFor="location_1">
          {isTransportation ? 'From' : 'Location'}:
        </Form.Label>
        <Form.Control
          type="text"
          id="location_1"
          name="location_1"
          defaultValue={defaultValues?.location_1}
        />
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label htmlFor="location_2">
          {isTransportation ? 'To' : 'Location detail'}:
        </Form.Label>
        <Form.Control
          type="text"
          id="location_2"
          name="location_2"
          defaultValue={defaultValues?.location_2}
        />
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label htmlFor="date_start">Start date:</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="date"
              id="date_start"
              name="date_start"
              defaultValue={defaultStartDate}
            />
          </Col>
          <Col>
            <Form.Control
              type="time"
              id="time_start"
              name="time_start"
              defaultValue={defaultStartTime}
            />
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label htmlFor="date_end">End date:</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="date"
              id="date_end"
              name="date_end"
              defaultValue={defaultEndDate}
            />
          </Col>
          <Col>
            <Form.Control
              type="time"
              id="time_end"
              name="time_end"
              defaultValue={defaultEndTime}
            />
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label htmlFor="cost">Cost</Form.Label>
        <Form.Control
          type="number"
          id="cost"
          name="cost"
          defaultValue={defaultValues?.cost}
        />
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label htmlFor="notes">Notes:</Form.Label>
        <Form.Control
          as="textarea"
          id="notes"
          name="notes"
          defaultValue={defaultValues?.notes}
        />
      </Form.Group>

      <Button type="submit" formMethod="dialog" formNoValidate className="mt-2">
        Submit
      </Button>
    </Form>
  );

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setIsTransportation(e.currentTarget.value === 'transportation');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;

    const data = Object.fromEntries(
      [...new FormData(form)].filter(([, v]) => v && v !== undefined)
    );

    data.date_start = data.time_start
      ? `${data.date_start}T${data.time_start}`
      : data.date_start;

    data.date_end = data.date_end
      ? data.time_end
        ? `${data.date_end}T${data.time_end}`
        : data.date_end
      : data.date_start;

    delete data.time_start;
    delete data.time_end;

    const response = await onSubmit(data as unknown as Activity);

    if (response.status >= 400) {
      alert('Error, check console for details');
      const err = await response.json();
      console.error(err);
      return;
    }

    if (onSuccess) {
      onSuccess(data as unknown as Activity);
    }

    alert('Success!');
    form.reset();
  }
}
