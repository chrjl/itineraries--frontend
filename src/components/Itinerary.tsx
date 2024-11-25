import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';

interface Activity {
  category: 'activity' | 'transportation' | 'housing';
  name: string;
  itinerary?: string;
  location_1?: string;
  location_2?: string;
  date_start?: string;
  date_end?: string;
  cost: number;
  notes: string;
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
          <section>
            <header>
              <h2>Activities</h2>
            </header>

            {activities.map(
              (
                { name, location_1, location_2, cost, date_start, date_end },
                index
              ) => (
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
            )}
            <ActivitiesTable
              id={id}
              category="activities"
              activities={activities}
              setActivities={setActivities}
            />
            <hr />
          </section>

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

  async function handleDeleteItinerary() {
    if (!confirm('Delete itinerary?')) {
      return;
    }

    await fetch(`/api/itineraries/${id}`, {
      method: 'DELETE',
    });

    navigate('/');
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
  return (
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
              <a>
                <i>
                  <s>Edit</s>
                </i>
              </a>
              <a onClick={() => handleDelete(id, category, index)}>
                <b>Delete</b>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
}
