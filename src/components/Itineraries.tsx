import { useEffect, useState } from 'react';
import { Link } from 'react-router';

interface Itinerary {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
}

export default function Itineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[] | null>(null);

  useEffect(() => {
    fetch('/api/itineraries')
      .then((response) => response.json())
      .then((itineraries) => setItineraries(itineraries));
  }, []);

  return (
    <>
      <header>
        <h1>Itineraries</h1>
        <Link to="new">
          <b>Create new</b>
        </Link>
      </header>

      <main>
        <section>
          <table>
            <thead>
              <tr>
                <td>Itinerary</td>
                <td>Created</td>
                <td>Modified</td>
              </tr>
            </thead>
            <tbody>
              {itineraries?.map(({ name, id, createdTime, modifiedTime }) => (
                <tr key={id}>
                  <td>{<Link to={`${id}`}>{name}</Link>}</td>
                  <td>
                    {`${createdTime?.slice(0, 10)} ${createdTime?.slice(11, 19)}`}
                  </td>
                  <td>
                    {`${modifiedTime?.slice(0, 10)} ${modifiedTime?.slice(11, 19)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
