import { useState, useEffect, useContext, useRef } from 'react';

import Table from 'react-bootstrap/Table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import ActivityEditorModal from './ActivityEditorModal';
import type { Activity } from './Itinerary';

import MetadataContext from '../contexts/MetadataContext';

interface Props {
  id: string;
  category: 'activities' | 'transportation' | 'housing';
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

export default function ActivitiesTable({
  id,
  category,
  activities,
  setActivities,
}: Props) {
  const [metadata] = useContext(MetadataContext);
  const { apiBase } = metadata;

  const [showModal, setShowModal] = useState(false);
  const [focusedActivity, setFocusedActivity] = useState<Activity>(
    {} as Activity
  );
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const editActivityModal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (showModal) {
      editActivityModal.current?.showModal();
    } else {
      editActivityModal.current?.close();
    }
  }, [showModal]);

  return (
    <>
      <ActivityEditorModal
        title="Edit activity"
        open={showModal}
        onClose={handleCloseModal}
        defaultValues={focusedActivity}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
      />

      <Table hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Itinerary#</th>
            <th>{category === 'transportation' ? 'From' : 'Location'}</th>
            <th>{category === 'transportation' ? 'To' : 'Detail'}</th>
            <th>Start</th>
            <th>End</th>
            <th>Cost</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.index}>
              <th>{activity.name}</th>
              <td>{activity.itinerary}</td>
              <td>{activity['location_1']}</td>
              <td>{activity['location_2']}</td>
              <td>{activity['date_start']?.split('T').join(' ')}</td>
              <td>{activity['date_end']?.split('T').join(' ')}</td>
              <td>{activity.cost}</td>
              <td>{activity.notes}</td>
              <td>
                <ButtonGroup>
                  <Button
                    size="sm"
                    onClick={() => handleOpenModal(activity.index, activity)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(id, category, activity.index)}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  async function handleDelete(
    id: string,
    category: string,
    deletedIndex: number
  ) {
    if (!confirm('Delete activity?')) {
      return;
    }

    const response = await fetch(
      `${apiBase}/itineraries/${id}/${category}/${deletedIndex}`,
      { method: 'DELETE' }
    );

    if (response.status >= 400) {
      return alert('An error occurred.');
    }

    setActivities((activities) =>
      activities.filter((activity) => activity.index !== deletedIndex)
    );
    alert('Success!');
  }

  function handleOpenModal(index: number, activity: Activity) {
    setFocusedActivity(activity);
    setFocusedIndex(index);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  async function handleSubmit(data: Activity) {
    if (typeof focusedIndex !== 'number') {
      throw new Error('An error occurred');
    }

    const response = await fetch(
      `${apiBase}/itineraries/${id}/${category}/${focusedIndex}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return response;
  }

  function handleSuccess(data: Activity) {
    setActivities((activities) => {
      if (!focusedIndex) {
        throw new Error('Something went wrong');
      }

      const updatedActivities = activities.map((activity) =>
        activity.index === focusedIndex ? data : activity
      );

      return updatedActivities;
    });

    setShowModal(false);
  }
}
