import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import firebase from "firebase/app";
import { useAuth } from "../context/auth";
import usePagination from "../hooks/usePagination";
import Spinner from "react-bootstrap/Spinner";

const ChatRoom: React.FC<{
  messagesRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
  query: firebase.firestore.Query<firebase.firestore.DocumentData>;
}> = ({ messagesRef, query }) => {
  const { user } = useAuth();
  const dummy = useRef(null);

  const [messages, loaded] = usePagination({ query });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const { uid, photoUrl } = user;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoUrl,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container
      style={{
        backgroundColor: "black",
        minHeight: "500px",
        paddingTop: "10px",
        margin: "1px",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "spaceBetween",
      }}
    >
      <Row>
        <main>
          {messages &&
            messages.map(
              (msg: {
                id: string;
                text: string;
                uid: string;
                photoUrl: string;
              }) => <ChatMessage key={msg.id} {...msg} />
            )}
          {!loaded && (
            <div
              style={{
                textAlign: "center",
              }}
            >
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          <span ref={dummy}></span>
        </main>
      </Row>
      <Row>
        <Form onSubmit={sendMessage}>
          <div
            className="h-100 justify-content-end"
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              paddingBottom: "10px",
            }}
          >
            <Form.Control
              style={{
                borderBottomRightRadius: "0px",
                borderTopRightRadius: "0px",
              }}
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Skrive en melding"
            />
            <Button
              className="btn primary"
              type="submit"
              disabled={!formValue}
              style={{
                borderBottomLeftRadius: "0px",
                borderTopLeftRadius: "0px",
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </div>
        </Form>
      </Row>
    </Container>
  );
};

function ChatMessage({
  text,
  uid,
  photoUrl,
}: {
  text: string;
  uid: string;
  photoUrl: string;
}) {
  const { user } = useAuth();
  const messageClass = uid === user.uid ? "sent" : "received";

  return (
    <>
      <div
        className={`message ${messageClass}`}
        style={{
          flexDirection: messageClass === "sent" ? "row-reverse" : "row",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            margin: "2px 5px",
          }}
          src={
            photoUrl || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p
          style={{
            color: messageClass === "sent" ? "white" : "black",
            background: messageClass === "sent" ? "#0b93f6" : "#e5e5ea",
            alignSelf: messageClass === "sent" ? "flexEnd" : undefined,
            maxWidth: "500px",
            marginBottom: "12px",
            lineHeight: "24px",
            padding: "10px 20px",
            borderRadius: "25px",
            position: "relative",
            textAlign: "center",
          }}
        >
          {text}
        </p>
      </div>
    </>
  );
}

export default ChatRoom;
