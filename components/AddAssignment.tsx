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
import { assignmentRef } from "../fetchData/getData";
import { useAuth } from "../context/auth";
const uuid = require("uuid/v1");

const AddAssignment: FC<{
  setAddCard: Dispatch<SetStateAction<boolean>>;
  buildingId: string;
}> = ({ setAddCard, buildingId }) => {
  const {
    user: { uid },
  } = useAuth();
  const formRef: any = useRef();
  const [image, setImage] = useState(null);
  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      const { title, about, place } = event.target.elements;
      const data = {
        title: title.value,
        about: about.value,
        place: place.value,
        creator: uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      if (image !== null) {
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
            console.log(error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              assignmentRef(buildingId).add({
                ...data,
                imageUrl: url,
              });
              setImage(null);
            });
          }
        );
      } else {
        assignmentRef(buildingId).add(data);
      }
      setAddCard(false);
      formRef.reset;
    },
    [image, setAddCard, formRef]
  );
  return (
    <Card bg="primary" text="white" style={{ width: "18rem" }} className="mb-2">
      <Form onSubmit={submit} ref={formRef} id="card-form">
        <Card.Header>
          <Form.Group controlId="title">
            <Form.Control
              type="text"
              name="title"
              placeholder="Title"
              required={true}
            />
          </Form.Group>
        </Card.Header>
        <Card.Body>
          <Card.Title>
            <Form.Group controlId="image">
              <Form.Control
                type="file"
                onChange={(e) =>
                  setImage((e.target as HTMLInputElement)?.files?.[0])
                }
              />
            </Form.Group>
          </Card.Title>
          <Form.Group controlId="place">
            <Form.Control
              type="text"
              name="place"
              placeholder="Hvor skal jobben utføres"
            />
          </Form.Group>
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
};

export default AddAssignment;
