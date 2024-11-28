import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import type { Activity } from './Itinerary';

interface ActivitiesCardsProps {
  activities: Activity[];
}

export default function ActivitiesCards({ activities }: ActivitiesCardsProps) {
  return (
    <Row xs={1} md={2} lg={3} xl={4} className="g-2 justify-content-center">
      {activities.map(
        (
          { name, location_1, location_2, cost, date_start, date_end },
          index
        ) => (
          <Col key={index}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle className="mb-4 text-muted">
                  {location_2 ? (
                    <>
                      {location_2}
                      <br />
                    </>
                  ) : null}
                  <small>{location_1}</small>
                </Card.Subtitle>
                <Card.Text>
                  <small>
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
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )
      )}
    </Row>
  );
}
