import { useState, useEffect, useRef } from 'react';

import EditActivityForm from './EditActivityForm';
import type { Activity } from './Itinerary';

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
      <dialog
        ref={editActivityModal}
        onClose={handleCloseModal}
        style={{ width: 'auto' }}
      >
        <header>
          <h1>Edit activity</h1>
          <button type="button" onClick={handleCloseModal}>
            Close
          </button>
        </header>
        <EditActivityForm
          category={focusedActivity?.category}
          defaultValues={focusedActivity}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
        />
      </dialog>

      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Itinerary#</td>
            <td>{category === 'transportation' ? 'From' : 'Location'}</td>
            <td>{category === 'transportation' ? 'To' : 'Detail'}</td>
            <td>Date Start</td>
            <td>Date End</td>
            <td>Cost</td>
            <td>Notes</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.name}</td>
              <td>{activity.itinerary}</td>
              <td>{activity['location_1']}</td>
              <td>{activity['location_2']}</td>
              <td>{activity['date_start']}</td>
              <td>{activity['date_end']}</td>
              <td>{activity.cost}</td>
              <td>{activity.notes}</td>
              <td>
                <button onClick={() => handleOpenModal(index, activity)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(id, category, index)}>
                  <b>Delete</b>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  }
}
