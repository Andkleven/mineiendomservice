import { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import AddCard from "./AddCard";
import Todo from "./Todo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export default function TodoList() {
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
        }}
      >
        <Container>
          <h5 className="text-center text-secondary">
            Click plus button to add
          </h5>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
          {addCard ? <AddCard setAddCard={setAddCard} /> : null}
          <Todo />
        </Container>
      </div>
    </div>
  );
}
