import { useState, FC } from "react";
import Button from "react-bootstrap/Button";
import Residents from "../components/Residents";
import AddResident from "../components/AddResident";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const Resident: FC = () => {
  const [addCard, setAddCard] = useState(false);
  return (
    <div
      style={{
        paddingTop: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h5 className="text-center text-secondary">Click plus button to add</h5>
        <div
          style={{
            paddingBottom: "10px",
          }}
        >
          <Button
            variant="outline-primary"
            type="button"
            className="btn-circle btn-xl"
            onClick={() => setAddCard(!addCard)}
          >
            <FontAwesomeIcon icon={addCard ? faMinus : faPlus} />
          </Button>
        </div>
        {addCard ? <AddResident setAddCard={setAddCard} /> : null}
        <Residents />
      </div>
    </div>
  );
};

export default Resident;
