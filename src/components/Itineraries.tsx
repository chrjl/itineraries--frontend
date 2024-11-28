import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

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
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand>Itineraries</Navbar.Brand>

            {/* @ts-expect-error bootstrap bug */}
            <Button as={Link} to="new" size="sm" variant="success">
              Create new
            </Button>
          </Container>
        </Navbar>
      </header>

      <main>
        <section>
          <Container>
            <Table hover>
              <thead>
                <tr>
                  <th>Itinerary</th>
                  <th>Created</th>
                  <th>Modified</th>
                </tr>
              </thead>
              <tbody>
                {itineraries?.map(({ name, id, createdTime, modifiedTime }) => (
                  <tr key={id}>
                    <th>{<Link to={`${id}`}>{name}</Link>}</th>
                    <td>
                      {`${createdTime?.slice(0, 10)} ${createdTime?.slice(11, 19)}`}
                    </td>
                    <td>
                      {`${modifiedTime?.slice(0, 10)} ${modifiedTime?.slice(11, 19)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </section>
      </main>
    </>
  );
}
