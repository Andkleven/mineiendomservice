import { useCallback, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import firebase from "../firebase/clientApp";
import { useData } from "../context/data.tsx";
const uuid = require("uuid/v1");

export default function AddCard({ setAddCard }) {
  const formRef = useRef();
  const { dispatchData } = useData();
  const [image, setImage] = useState(null);
  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      const { title, about } = event.target.elements;
      const uploadTask = firebase
        .storage()
        .ref(`images/${image.name}${uuid()}`)
        .put(image);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          console.log(error.code);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            dispatchData({
              type: "add",
              fields: {
                title: title.value,
                imageUrl: url,
                about: about.value,
                time: firebase.firestore.FieldValue.serverTimestamp(),
              },
            });
            setAddCard(false);
            formRef.reset;
          });
        }
      );
    },
    [image]
  );
  return (
    <Card bg="primary" text="white" style={{ width: "18rem" }} className="mb-2">
      <Form onSubmit={submit} ref={formRef} id="card-form">
        <Card.Header>
          <Form.Group controlId="title">
            <Form.Control type="text" name="title" placeholder="Title" />
          </Form.Group>
        </Card.Header>
        <Card.Body>
          <Card.Title>
            <Form.Group controlId="image">
              <Form.Control
                required={true}
                type="file"
                onChange={(e) => setImage(e?.target?.files[0])}
              />
            </Form.Group>
          </Card.Title>
          <Form.Group controlId="about">
            <Form.Control
              as="textarea"
              rows={3}
              name="about"
              placeholder="About"
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
      </Form>
    </Card>
  );
}
