import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router';

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
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [housing, setHousing] = useState<Activity[] | null>(null);
  const [transportation, setTransportation] = useState<Activity[] | null>(null);
  const [name, setName] = useState('');

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
        <a type="button" onClick={handleDeleteItinerary}>
          <i>Delete itinerary</i>
        </a>
        <Link to={`create`}>
          <b>Create activity</b>
        </Link>
      </header>

      <main>
        {activities && (
          <section>
            <header>
              <h2>Activities</h2>
            </header>

            <ActivitiesCards activities={activities} />
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
}

interface ActivitiesTableProps {
  id: string;
  category: 'activities' | 'transportation' | 'housing';
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[] | null>>;
}

function ActivitiesTable({
  id,
  category,
  activities,
  setActivities,
}: ActivitiesTableProps) {
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
        />
      </dialog>

      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Itinerary #</td>
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
  }

  function handleOpenModal(index: number, activity: Activity) {
    setFocusedActivity(activity);
    setFocusedIndex(index);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (focusedIndex === null) {
      return;
    }

    const data = Object.fromEntries(
      [...new FormData(e.currentTarget)].filter(([, value]) => value !== '')
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

    // <select> is not returning value in FormData. I don't know why, but this is a workaround.
    data.category = category;

    const updatedActivities = [...activities];
    updatedActivities[focusedIndex] = data as unknown as Activity;

    const response = await fetch(`/api/itineraries/${id}/${category}`, {
      method: 'PUT',
      body: JSON.stringify(updatedActivities),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status >= 400) {
      alert('Error, check console for details');
      const err = await response.json();
      console.error(err);
      return;
    }

    setActivities(updatedActivities);
  }
}

interface ActivitiesCardsProps {
  activities: Activity[];
}

function ActivitiesCards({ activities }: ActivitiesCardsProps) {
  return activities.map(
    ({ name, location_1, location_2, cost, date_start, date_end }, index) => (
      <aside key={index}>
        <h3>{name}</h3>
        <p>
          {location_2}
          <br />
          <small>{location_1}</small>
        </p>
        <p>
          {date_start?.split('T').join(' ')}
          {date_end !== date_start ? (
            <>
              {' '}
              to
              <br />
              {date_end?.split('T').join(' ')}
            </>
          ) : null}
        </p>
        {cost && <p>Cost: {cost}</p>}
      </aside>
    )
  );
}
