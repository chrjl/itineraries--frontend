import { Link, useNavigate } from 'react-router';

export default function CreateItinerary() {
  const navigate = useNavigate();

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/itineraries">itineraries</Link> &gt;
            </li>
            <li>new</li>
          </ul>
        </nav>

        <h1>Create new itinerary</h1>
      </header>
      <section>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Itinerary title:</label>
          <input type="text" id="name" name="name" />
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" />
          <button type="submit">Submit</button>
        </form>
      </section>
    </>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const response = await fetch('/api/itineraries', {
      method: 'POST',
      body: JSON.stringify(data),
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

    const file = await response.json();
    navigate(`/itineraries/${file.id}`);
  }
}
