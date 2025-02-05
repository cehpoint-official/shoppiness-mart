import { useState } from "react";
import CreateEvent from "../../../components/CreateEvent";
import AllEvents from "../../../components/AllEvents";

const Events = () => {
  const [showAllEvents, setShowAllEvents] = useState(false);

  return (
    <div className="p-6 min-h-screen">
      {!showAllEvents ? (
        <CreateEvent onViewAllClick={() => setShowAllEvents(true)} />
      ) : (
        <AllEvents onBackClick={() => setShowAllEvents(false)} />
      )}
    </div>
  );
};

export default Events;
