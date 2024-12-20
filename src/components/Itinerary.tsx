import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

import ActivitiesTable from './ActivitiesTable';
import ActivitiesCards from './ActivitiesCards';
import ActivityEditorModal from './ActivityEditorModal';

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [housing, setHousing] = useState<Activity[]>([]);
  const [transportation, setTransportation] = useState<Activity[]>([]);
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);

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
        <Navbar bg="black" data-bs-theme="dark">
          <Container>
            <Navbar.Brand>{name}</Navbar.Brand>
            <Button variant="danger" size="sm" onClick={handleDeleteItinerary}>
              Delete
            </Button>
          </Container>
        </Navbar>

        <Container>
          <Breadcrumb>
            <Breadcrumb.Item active>
              <Link to="..">Itineraries</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{id}</Breadcrumb.Item>
          </Breadcrumb>
        </Container>

        <Container className="text-center py-4">
          <Button type="button" variant="success" onClick={handleOpenDialog}>
            Create activity
          </Button>
        </Container>
      </header>

      <main>
        <ActivityEditorModal
          title="Create Activity"
          open={showModal}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
        />

        {activities && (
          <section className="pb-4">
            <Container>
              <header>
                <h2>Activities</h2>
              </header>

              <div id="activities-cards" className="pb-4">
                <ActivitiesCards activities={activities} />
              </div>

              <ActivitiesTable
                id={id}
                category="activities"
                activities={activities}
                setActivities={setActivities}
              />
            </Container>
          </section>
        )}

        {transportation && (
          <section className="pb-4">
            <Container>
              <header>
                <h2>Transportation</h2>
              </header>
              <ActivitiesTable
                id={id}
                category="transportation"
                activities={transportation}
                setActivities={setTransportation}
              />
            </Container>
          </section>
        )}

        {housing && (
          <section className="pb-4">
            <Container>
              <header>
                <h2>Housing</h2>
              </header>
              <ActivitiesTable
                id={id}
                category="housing"
                activities={housing}
                setActivities={setHousing}
              />
            </Container>
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

  function handleOpenDialog() {
    setShowModal(true);
  }

  function handleCloseDialog() {
    setShowModal(false);
  }

  async function handleSubmit(data: Activity) {
    const response = await fetch(`/api/itineraries/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  }

  function handleSuccess(data: Activity) {
    if (data.category === 'housing') {
      setHousing((housing) => [...housing, data]);
    } else if (data.category === 'transportation') {
      setHousing((housing) => [...housing, data]);
    } else {
      setActivities((activities) => [...activities, data]);
    }

    setShowModal(false);
  }
}
