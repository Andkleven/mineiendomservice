import { FC } from "react";
import Card from "react-bootstrap/Card";
import { residentQuery, residentRef } from "../fetchData/getData";
import usePagination from "../hooks/usePagination";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { Resident } from "../types/types";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "../context/auth";

const Residents: FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [residents, loaded] = usePagination({
    query: residentQuery,
    limit: 15,
  });
  const handelSubmit = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await residentRef
      .doc(id)
      .set({ active: e.target.checked }, { merge: true });
  };
  return (
    <>
      {residents?.map((resident: Resident, index: number) => {
        return (
          <Card
            key={index}
            bg="primary"
            text="dark"
            style={{ width: "18rem" }}
            className="mb-2 text-center"
          >
            <Card.Header>
              <Card.Title>
                <Button
                  variant="outline-dark"
                  type="submit"
                  style={{
                    marginTop: "10px",
                    width: "100%",
                  }}
                  onClick={() =>
                    router.push(`janitorAssignment/${resident.id}`)
                  }
                >
                  {resident.name}
                </Button>
              </Card.Title>
              {(resident.address ||
                resident.municipality ||
                resident.zipCode) && (
                <Card.Body>
                  {resident.address && (
                    <Card.Title>Adresse {resident.address}</Card.Title>
                  )}
                  {resident.municipality && (
                    <Card.Title>Kommune {resident.municipality}</Card.Title>
                  )}
                  {resident.zipCode && (
                    <Card.Title>Postnummer {resident.zipCode}</Card.Title>
                  )}
                </Card.Body>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Form.Check
                  defaultChecked={
                    resident.active === undefined ? true : resident.active
                  }
                  type="checkbox"
                  label="Aktiv"
                  onChange={(e) => handelSubmit(resident.id, e)}
                />
              </div>
            </Card.Header>
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

export default Residents;
