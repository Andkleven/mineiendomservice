import { FC, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import {
  assignmentQuery,
  assignmentRef,
  assignmentChatRef,
  assignmentChatQuery,
} from "../fetchData/getData";
import Spinner from "react-bootstrap/Spinner";
import usePagination from "../hooks/usePagination";
import { Assignment } from "../types/types";
import ChatRoom from "../components/ChatRoom";

const Todo: FC<{ buildingId: string }> = ({ buildingId }) => {
  const [chat, setChat] = useState(false);
  const [assignments, loaded] = usePagination({
    query: assignmentQuery(buildingId),
  });
  const handelDelete = async (id: string) => {
    await assignmentRef(buildingId).doc(id).delete();
  };
  return (
    <>
      {assignments?.map((assignment: Assignment, index: number) => {
        return (
          <Card
            key={index}
            bg="primary"
            text="white"
            style={{ width: "18rem" }}
            className="mb-2"
          >
            <Card.Img variant="top" src={assignment.imageUrl} />
            <Card.Body>
              <Card.Title>{assignment.title}</Card.Title>
              {assignment.place && (
                <Card.Text>
                  Hvor skal jobben utføres: {assignment.place}
                </Card.Text>
              )}
              <Card.Text>{assignment.about}</Card.Text>
              <Card.Text
                className={assignment.done ? "text-success" : "text-warning"}
              >
                {assignment.done ? "Done" : "Not done"}
              </Card.Text>
            </Card.Body>
            <Button
              variant="danger"
              style={{
                marginBottom: "16px",
                marginLeft: "16px",
                marginRight: "16px",
              }}
              onClick={() => handelDelete(assignment.id)}
            >
              Delete <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
            <Button
              variant="success"
              style={{
                marginBottom: "16px",
                marginLeft: "16px",
                marginRight: "16px",
              }}
              onClick={() => setChat(!chat)}
            >
              {chat ? "Hide Chat" : "Chat"}{" "}
              <FontAwesomeIcon icon={faCommentDots} />
            </Button>
            {chat ? (
              <ChatRoom
                messagesRef={assignmentChatRef(buildingId, assignment.id)}
                query={assignmentChatQuery(buildingId, assignment.id)}
              />
            ) : null}
          </Card>
        );
      }) ?? null}
      {!loaded && (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    </>
  );
};

export default Todo;
