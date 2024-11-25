import { useState } from 'react';

import type { Activity } from './Itinerary';

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  defaultValues?: Activity;
  category?: Activity['category'];
}

export default function EditActivityForm({
  onSubmit,
  defaultValues,
  category,
}: Props) {
  const [isTransportation, setIsTransportation] = useState(false);

  const defaultStartDate = defaultValues?.date_start?.slice(0, 10);
  const defaultStartTime = defaultValues?.date_start?.slice(11);
  const defaultEndDate = defaultValues?.date_end?.slice(0, 10);
  const defaultEndTime = defaultValues?.date_end?.slice(11);

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="category">Category:</label>
      <select
        id="category"
        name="category"
        onChange={handleChange}
        value={category}
        disabled={Boolean(category)}
      >
        <option value="activity">Activity</option>
        <option value="transportation">Transportation</option>
        <option value="housing">Housing</option>
      </select>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        defaultValue={defaultValues?.name}
        required
      />
      <label htmlFor="itinerary">Itinerary #:</label>
      <input
        type="text"
        id="itinerary"
        name="itinerary"
        defaultValue={defaultValues?.itinerary}
      />
      <label htmlFor="location_1">
        {isTransportation ? 'From' : 'Location'}:
      </label>
      <input
        type="text"
        id="location_1"
        name="location_1"
        defaultValue={defaultValues?.location_1}
      />
      <label htmlFor="location_2">
        {isTransportation ? 'To' : 'Location detail'}:
      </label>
      <input
        type="text"
        id="location_2"
        name="location_2"
        defaultValue={defaultValues?.location_2}
      />
      <label htmlFor="date_start">Start date:</label>
      <input
        type="date"
        id="date_start"
        name="date_start"
        defaultValue={defaultStartDate}
      />
      <input
        type="time"
        id="time_start"
        name="time_start"
        defaultValue={defaultStartTime}
      />
      <label htmlFor="date_end">End date:</label>
      <input
        type="date"
        id="date_end"
        name="date_end"
        defaultValue={defaultEndDate}
      />
      <input
        type="time"
        id="time_end"
        name="time_end"
        defaultValue={defaultEndTime}
      />
      <label htmlFor="cost">Cost</label>
      <input
        type="number"
        id="cost"
        name="cost"
        defaultValue={defaultValues?.cost}
      />
      <label htmlFor="notes">Notes:</label>
      <textarea id="notes" name="notes" defaultValue={defaultValues?.notes} />
      <button type="submit" formMethod="dialog" formNoValidate>
        Submit
      </button>
    </form>
  );

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setIsTransportation(e.currentTarget.value === 'transportation');
  }
}
