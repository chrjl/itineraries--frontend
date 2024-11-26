import type { Activity } from './Itinerary';

interface ActivitiesCardsProps {
  activities: Activity[];
}

export default function ActivitiesCards({ activities }: ActivitiesCardsProps) {
  return activities.map(
    ({ name, location_1, location_2, cost, date_start, date_end }, index) => (
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
              {' '}
              to
              <br />
              {date_end?.split('T').join(' ')}
            </>
          ) : null}
        </p>
        {cost && <p>Cost: {cost}</p>}
      </aside>
    )
  );
}
