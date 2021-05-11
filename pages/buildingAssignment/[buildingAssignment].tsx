import { useState, FC } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import AddAssignment from "../../components/AddAssignment";
import Assignments from "../../components/Assignments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const BuildingAssignment: FC<{
  buildingId: string;
}> = ({ buildingId }) => {
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
        <Button
          variant="outline-primary"
          type="button"
          className="btn-circle btn-xl"
          onClick={() => setAddCard(!addCard)}
        >
          <FontAwesomeIcon icon={addCard ? faMinus : faPlus} />
        </Button>
        {addCard ? (
          <AddAssignment setAddCard={setAddCard} buildingId={buildingId} />
        ) : null}
        <Assignments buildingId={buildingId} />
      </div>
    </div>
  );
};
export default BuildingAssignment;

export async function getServerSideProps({ query }) {
  return {
    props: {
      buildingId: query.buildingAssignment,
    },
  };
}
