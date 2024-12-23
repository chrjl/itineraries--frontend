import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import MetadataContext from '../contexts/MetadataContext';

export default function CreateItinerary() {
  const navigate = useNavigate();
  const [metadata] = useContext(MetadataContext);
  const { apiBase } = metadata;

  return (
    <>
      <header>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand>Create itinerary</Navbar.Brand>
          </Container>
        </Navbar>

        <Container>
          <Breadcrumb>
            <Breadcrumb.Item active>
              <Link to="..">Itineraries</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>new</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </header>

      <main>
        <section>
          <Container>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Itinerary title</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Enter itinerary title"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" placeholder="Email" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Container>
        </section>
      </main>
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
    navigate(`../${file.id}`);
  }
}
