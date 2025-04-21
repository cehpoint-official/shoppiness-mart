import { useState } from "react";
import CreateEvent from "../../../components/CreateEvent";
import AllEvents from "../../../components/AllEvents";
import EditEvent from "../../../components/EditEvent";

const Events = () => {
  const [view, setView] = useState("create"); // "create", "list", or "edit"
  const [currentEvent, setCurrentEvent] = useState(null);
  
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setView("edit");
  };
  
  const handleEditComplete = () => {
    setCurrentEvent(null);
    setView("list");
  };
  
  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen w-full overflow-x-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {view === "create" && (
          <CreateEvent onViewAllClick={() => setView("list")} />
        )}
       
        {view === "list" && (
          <AllEvents
            onBackClick={() => setView("create")}
            onEditEvent={handleEditEvent}
          />
        )}
       
        {view === "edit" && currentEvent && (
          <EditEvent
            event={currentEvent}
            onCancel={() => setView("list")}
            onComplete={handleEditComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Events;