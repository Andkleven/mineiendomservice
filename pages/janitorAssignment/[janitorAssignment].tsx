import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import {
  assignmentQuery,
  assignmentRef,
  buildingRef,
} from "../../fetchData/getData";
import Container from "react-bootstrap/Container";
import usePagination from "../../hooks/usePagination";
import { Assignment } from "../types/types";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import Spinner from "react-bootstrap/Spinner";

const JanitorAssignment: React.FC<{
  buildingId: string;
}> = ({ buildingId }) => {
  const [janitorAssignments, loaded] = usePagination({
    query: assignmentQuery(buildingId),
    limit: 5,
  });
  const [snapshot, loading, error] = useDocumentOnce(
    buildingRef.doc(buildingId)
  );

  const handelSubmit = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await assignmentRef(buildingId)
      .doc(id)
      .set({ done: e.target.checked }, { merge: true });
  };
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
        <h2 className="text-center">Gjøremål</h2>
        {janitorAssignments?.map(
          (janitorAssignment: Assignment, index: number) => {
            return (
              <Card
                key={index}
                bg="primary"
                text="white"
                style={{ width: "18rem" }}
                className="mb-2"
              >
                <Card.Img variant="top" src={janitorAssignment.imageUrl} />
                <Card.Body>
                  <Card.Title>{janitorAssignment.title}</Card.Title>
                  <Card.Text>{janitorAssignment.about}</Card.Text>
                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check
                      defaultChecked={janitorAssignment.done}
                      type="checkbox"
                      label="Done"
                      onChange={(e) => handelSubmit(janitorAssignment.id, e)}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            );
          }
        ) ?? <h4>Ingen gjøremål</h4>}
        {!loaded && (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        )}
      </div>
    </div>
  );
};
export default JanitorAssignment;

export async function getServerSideProps({ query }) {
  return {
    props: {
      buildingId: query.janitorAssignment,
    },
  };
}
