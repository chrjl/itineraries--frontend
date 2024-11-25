import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';

export default function CreateActivity() {
  const { id } = useParams();
  const [isTransportation, setIsTransportation] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="../..">itineraries</Link> &gt;
            </li>
            <li>
              <Link to={`../${id}`}>{id}</Link> &gt;
            </li>
            <li>create</li>
          </ul>
        </nav>
        <h1>Create activity</h1>
      </header>

      <main>
        <section>
          <form onSubmit={handleSubmit}>
            <label htmlFor="category">Category:</label>
            <select id="category" name="category" onChange={handleChange}>
              <option value="activity">Activity</option>
              <option value="housing">Housing</option>
              <option value="transportation">Transportation</option>
            </select>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
            <label htmlFor="itinerary">Itinerary #:</label>
            <input type="text" id="itinerary" name="itinerary" />
            <label htmlFor="location_1">
              {isTransportation ? 'From' : 'Location'}:
            </label>
            <input type="text" id="location_1" name="location_1" />
            <label htmlFor="location_2">
              {isTransportation ? 'To' : 'Location detail'}:
            </label>
            <input type="text" id="location_2" name="location_2" />
            <label htmlFor="date_start">Start date:</label>
            <input type="date" id="date_start" name="date_start" />
            <input type="time" id="time_start" name="time_start" />
            <label htmlFor="date_end">End date:</label>
            <input type="date" id="date_end" name="date_end" />
            <input type="time" id="time_end" name="time_end" />
            <label htmlFor="cost">Cost</label>
            <input type="number" id="cost" name="cost" />
            <label htmlFor="notes">Notes:</label>
            <textarea id="notes" name="notes" />
            <button type="submit">Submit</button>
          </form>
        </section>
      </main>
    </>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

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

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => Boolean(value))
    );

    const response = await fetch(`/api/itineraries/${id}`, {
      method: 'POST',
      body: JSON.stringify(filteredData),
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

    navigate(`../${id}`);
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setIsTransportation(e.currentTarget.value === 'transportation');
  }
}
