import { useState } from 'react';

import type { Activity } from './Itinerary';

interface Props {
  defaultValues?: Activity;
  category?: Activity['category'];
  onSuccess: (data: Activity) => void;
  onSubmit: (data: Activity) => Promise<Response>;
}

export default function EditActivityForm({
  defaultValues,
  category,
  onSubmit,
  onSuccess,
}: Props) {
  const [isTransportation, setIsTransportation] = useState(false);

  const defaultStartDate = defaultValues?.date_start?.slice(0, 10);
  const defaultStartTime = defaultValues?.date_start?.slice(11);
  const defaultEndDate = defaultValues?.date_end?.slice(0, 10);
  const defaultEndTime = defaultValues?.date_end?.slice(11);

  return (
    <form onSubmit={handleSubmit}>
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;

    const data = Object.fromEntries(
      [...new FormData(form)].filter(([, v]) => v && v !== undefined)
    );

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

    const response = await onSubmit(data as unknown as Activity);

    if (response.status >= 400) {
      alert('Error, check console for details');
      const err = await response.json();
      console.error(err);
      return;
    }

    if (onSuccess) {
      onSuccess(data as unknown as Activity);
    }

    alert('Success!');
    form.reset();
  }
}
