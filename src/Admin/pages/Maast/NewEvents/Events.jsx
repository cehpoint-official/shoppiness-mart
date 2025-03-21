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
    <div className="p-6 min-h-screen">
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
  );
};

export default Events;