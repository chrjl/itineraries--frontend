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
  const [itinerary, setItinerary] = useState<Activity[] | null>(null);
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

        setItinerary(data);
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
        <button type="button" onClick={handleClickDelete}>
          <i>Delete itinerary</i>
        </button>
        <Link to={`create`}>
          <b>Create activity</b>
        </Link>
      </header>

      <main>
        <section>
          <header>
            <h2>Activities</h2>
          </header>

          {itinerary
            ?.filter((entry) => entry.category === 'activity')
            .map(
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
                        {' '} to
                        <br />
                        {date_end?.split('T').join(' ')}
                      </>
                    ) : null}
                  </p>
                  {cost && <p>Cost: {cost}</p>}
                </aside>
              )
            )}

          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Itinerary #</td>
                <td>Location</td>
                <td>Detail</td>
                <td>Date Start</td>
                <td>Date End</td>
                <td>Cost</td>
                <td>Notes</td>
              </tr>
            </thead>
            <tbody>
              {itinerary
                ?.filter((entry) => entry.category === 'activity')
                .map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.itinerary}</td>
                    <td>{entry['location_1']}</td>
                    <td>{entry['location_2']}</td>
                    <td>{entry['date_start']}</td>
                    <td>{entry['date_end']}</td>
                    <td>{entry.cost}</td>
                    <td>{entry.notes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        <hr />

        <section>
          <header>
            <h2>Transportation</h2>
          </header>
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Itinerary #</td>
                <td>From</td>
                <td>To</td>
                <td>Date Start</td>
                <td>Date End</td>
                <td>Cost</td>
                <td>Notes</td>
              </tr>
            </thead>
            <tbody>
              {itinerary
                ?.filter((entry) => entry.category === 'transportation')
                .map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.itinerary}</td>
                    <td>{entry['location_1']}</td>
                    <td>{entry['location_2']}</td>
                    <td>{entry['date_start']}</td>
                    <td>{entry['date_end']}</td>
                    <td>{entry.cost}</td>
                    <td>{entry.notes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        <hr />

        <section>
          <header>
            <h2>Housing</h2>
          </header>
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Itinerary #</td>
                <td>Location</td>
                <td>Detail</td>
                <td>Date Start</td>
                <td>Date End</td>
                <td>Cost</td>
                <td>Notes</td>
              </tr>
            </thead>
            <tbody>
              {itinerary
                ?.filter((entry) => entry.category === 'housing')
                .map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.itinerary}</td>
                    <td>{entry['location_1']}</td>
                    <td>{entry['location_2']}</td>
                    <td>{entry['date_start']}</td>
                    <td>{entry['date_end']}</td>
                    <td>{entry.cost}</td>
                    <td>{entry.notes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );

  async function handleClickDelete() {
    const confirmDelete = confirm(
      'Are you sure you want to delete this itinerary?'
    );

    if (confirmDelete) {
      await fetch(`/api/itineraries/${id}`, {
        method: 'DELETE',
      });

      navigate('/');
    }
  }
}
