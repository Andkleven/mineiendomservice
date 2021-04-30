import React from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useData } from "../context/data.tsx";

export default function todo() {
  const { data, dispatchData } = useData();
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgb(255, 255, 255)",
      }}
    >
      {data[0] ? (
        data.map((card, index) => {
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
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    defaultChecked={card.done}
                    type="checkbox"
                    label="Done"
                    onChange={(e) =>
                      dispatchData({
                        type: "update",
                        fields: { done: e.target.checked },
                        id: card.id,
                      })
                    }
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <h3>Ingen gjøremål</h3>
      )}
    </div>
  );
}
