import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router';

import ActivitiesTable from './ActivitiesTable';
import ActivitiesCards from './ActivitiesCards';
import EditActivityForm from './EditActivityForm';

export interface Activity {
  category: 'activity' | 'transportation' | 'housing';
  name: string;
  itinerary?: string;
  location_1?: string;
  location_2?: string;
  date_start?: string;
  date_end?: string;
  cost?: number;
  notes?: string;
}

export default function Itinerary() {
  const { id } = useParams();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [housing, setHousing] = useState<Activity[]>([]);
  const [transportation, setTransportation] = useState<Activity[]>([]);
  const [name, setName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/itineraries/${id}`)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((itinerary) => {
        setName(itinerary.name);

        const data = itinerary.data;
        data.sort((a: Activity, b: Activity) =>
          (a['date_start'] || 'Z') < (b['date_start'] || 'Z') ? -1 : 1
        );

        setActivities(
          data?.filter((entry: Activity) => entry.category === 'activity')
        );
        setHousing(
          data?.filter((entry: Activity) => entry.category === 'housing')
        );
        setTransportation(
          data?.filter((entry: Activity) => entry.category === 'transportation')
        );
      })
      .catch((err) => {
        console.error(err);
        alert('There was an error. Redirecting...');
        navigate('/');
      });
  }, [id, navigate]);

  if (!id) {
    return null;
  }

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="..">itineraries</Link> &gt;
            </li>
            <li> {id}</li>
          </ul>
        </nav>
        <h1>{name}</h1>
        <button type="button" onClick={handleDeleteItinerary}>
          <i>Delete itinerary</i>
        </button>{' '}
        <button type="button" onClick={handleOpenDialog}>
          Create activity
        </button>
      </header>

      <main>
        <CreateActivityDialog
          open={showCreateModal}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
        />

        {activities && (
          <section>
            <header>
              <h2>Activities</h2>
            </header>

            <div id="activities-cards">
              <ActivitiesCards activities={activities} />
            </div>

            <ActivitiesTable
              id={id}
              category="activities"
              activities={activities}
              setActivities={setActivities}
            />
            <hr />
          </section>
        )}

        {transportation && (
          <section>
            <header>
              <h2>Transportation</h2>
            </header>
            <ActivitiesTable
              id={id}
              category="transportation"
              activities={transportation}
              setActivities={setTransportation}
            />
            <hr />
          </section>
        )}

        {housing && (
          <section>
            <header>
              <h2>Housing</h2>
            </header>
            <ActivitiesTable
              id={id}
              category="housing"
              activities={housing}
              setActivities={setHousing}
            />
            <hr />
          </section>
        )}
      </main>
    </>
  );

  async function handleDeleteItinerary() {
    if (!confirm('Delete itinerary?')) {
      return;
    }

    await fetch(`/api/itineraries/${id}`, {
      method: 'DELETE',
    });

    navigate('/');
  }

  function handleOpenDialog() {
    setShowCreateModal(true);
  }

  function handleCloseDialog() {
    setShowCreateModal(false);
  }

  async function handleSubmit(data: Activity) {
    const response = await fetch(`/api/itineraries/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  }

  function handleSuccess(data: Activity) {
    if (data.category === 'housing') {
      setHousing((housing) => [...housing, data]);
    } else if (data.category === 'transportation') {
      setHousing((housing) => [...housing, data]);
    } else {
      setActivities((activities) => [...activities, data]);
    }
  }
}

interface CreateActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Activity) => Promise<Response>;
  onSuccess: (data: Activity) => void;
}

function CreateActivityDialog({
  open,
  onClose,
  onSubmit,
  onSuccess,
}: CreateActivityDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open, onClose]);

  return (
    <dialog ref={dialog} onClose={onClose} style={{ width: 'auto' }}>
      <header>
        <h1>Create activity</h1>
        <button onClick={onClose} type="button">
          Close
        </button>
      </header>

      <EditActivityForm onSubmit={onSubmit} onSuccess={onSuccess} />
    </dialog>
  );
}
