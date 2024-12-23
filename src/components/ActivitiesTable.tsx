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
            <th>Date Start</th>
            <th>Date End</th>
            <th>Cost</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
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
                    onClick={() => handleOpenModal(index, activity)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(id, category, index)}
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

    const filteredActivities = activities.filter(
      (_, index) => index !== deletedIndex
    );

    const response = await fetch(`/api/itineraries/${id}/${category}`, {
      method: 'PUT',
      body: JSON.stringify(filteredActivities),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status >= 400) {
      return alert('An error occurred.');
    }

    setActivities(filteredActivities);
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

    const updatedActivities = [...activities];

    updatedActivities[focusedIndex] = data as unknown as Activity;

    const response = await fetch(`/api/itineraries/${id}/${category}`, {
      method: 'PUT',
      body: JSON.stringify(updatedActivities),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  }

  function handleSuccess(data: Activity) {
    setActivities((activities) => {
      if (!focusedIndex) {
        throw new Error('Something went wrong');
      }

      const updatedActivities = [...activities];
      updatedActivities[focusedIndex] = data;

      return updatedActivities;
    });

    setShowModal(false);
  }
}
