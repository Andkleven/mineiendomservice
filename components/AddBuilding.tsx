import {
  useCallback,
  useState,
  useRef,
  FC,
  SetStateAction,
  Dispatch,
} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import firebase from "../firebase/clientApp";
import { buildingRef } from "../fetchData/getData";

const AddAssignment: FC<{
  setAddCard: Dispatch<SetStateAction<boolean>>;
}> = ({ setAddCard }) => {
  const formRef: any = useRef();
  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      const { name, address, municipality, zipCode } = event.target.elements;
      buildingRef.add({
        name: name.value,
        address: address.value,
        municipality: municipality.value,
        zipCode: zipCode.value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setAddCard(false);
      formRef.reset;
    },
    [setAddCard, formRef]
  );
  return (
    <Card bg="primary" text="white" style={{ width: "18rem" }} className="mb-2">
      <Form onSubmit={submit} ref={formRef} id="card-form">
        <Card.Header>
          <Form.Group>
            <Form.Control
              type="text"
              name="name"
              placeholder="Building navn"
              required={true}
            />
          </Form.Group>
          <Card.Body>
            <Form.Group>
              <Form.Control
                type="text"
                name="address"
                placeholder="Adresse"
                required={true}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                name="municipality"
                placeholder="Kommune"
                required={true}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="number"
                name="zipCode"
                placeholder="Postnummer"
                required={true}
              />
            </Form.Group>
            <div>
              <Button
                variant="outline-success"
                type="submit"
                style={{
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                Submit
              </Button>
            </div>
          </Card.Body>
        </Card.Header>
      </Form>
    </Card>
  );
};

export default AddAssignment;
