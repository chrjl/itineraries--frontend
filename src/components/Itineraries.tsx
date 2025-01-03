import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

import MetadataContext from '../contexts/MetadataContext';
import MetadataModal from './MetadataModal';

interface Itinerary {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
}

export default function Itineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[] | null>(null);
  const [metadata, setMetadata] = useContext(MetadataContext);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const { apiBase } = metadata;

  useEffect(() => {
    setLoadingStatus(true);

    fetch(`${apiBase}/itineraries`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(response.statusText);
        }
        
        return response.json();
      })
      .then((itineraries) => {
        setItineraries(itineraries);
      })
      .catch((err) => {
        console.error(err);
        alert(err);
      })
      .finally(() => setLoadingStatus(false));
  }, [apiBase]);

  return (
    <>
      <header>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand>Itineraries</Navbar.Brand>

            <span>
              <MetadataModal metadata={metadata} setMetadata={setMetadata} />
              {/* @ts-expect-error bootstrap bug */}
              <Button as={Link} to="new" size="sm" variant="success">
                Create new
              </Button>
            </span>
          </Container>
        </Navbar>
      </header>

      <main>
        <section>
          <Container>
            {loadingStatus ? (
              <Spinner
                animation="border"
                className="position-absolute top-50 start-50"
              />
            ) : (
              <Table hover>
                <thead>
                  <tr>
                    <th>Itinerary</th>
                    <th>Created</th>
                    <th>Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {itineraries?.map(
                    ({ name, id, createdTime, modifiedTime }) => (
                      <tr key={id}>
                        <th>{<Link to={`${id}`}>{name}</Link>}</th>
                        <td>
                          {`${createdTime?.slice(0, 10)} ${createdTime?.slice(11, 19)}`}
                        </td>
                        <td>
                          {`${modifiedTime?.slice(0, 10)} ${modifiedTime?.slice(11, 19)}`}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            )}
          </Container>
        </section>
      </main>
    </>
  );
}
