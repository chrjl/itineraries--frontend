import { Link, useParams, useNavigate } from 'react-router';

import EditActivityForm from './EditActivityForm';

export default function CreateActivity() {
  const { id } = useParams();
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
          <EditActivityForm onSubmit={handleSubmit} />
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
}
