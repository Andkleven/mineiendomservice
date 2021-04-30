import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useData } from "../context/data.tsx";

export default function Todo() {
  const { data, dispatchData } = useData();

  return (
    <>
      {data?.map((card, index) => {
        return (
          <Card
            key={index}
            bg="primary"
            text="white"
            style={{ width: "18rem" }}
            className="mb-2"
          >
            <Card.Img variant="top" src={card.imageUrl} />
            <Card.Body>
              <Card.Title>{card.title}</Card.Title>
              <Card.Text>{card.about}</Card.Text>
              <Card.Title
                className={card.done ? "text-success" : "text-warning"}
              >
                {card.done ? "Done" : "Not done"}
              </Card.Title>
            </Card.Body>
            <Button
              variant="danger"
              style={{
                marginBottom: "16px",
                marginLeft: "16px",
                marginRight: "16px",
              }}
              onClick={() => dispatchData({ type: "delete", id: card.id })}
            >
              Delete <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </Card>
        );
      })}
    </>
  );
}
