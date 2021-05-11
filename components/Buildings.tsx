import { FC } from "react";
import Card from "react-bootstrap/Card";
import { buildingQuery, buildingRef } from "../fetchData/getData";
import usePagination from "../hooks/usePagination";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { Building } from "../types/types";
import Spinner from "react-bootstrap/Spinner";

const Buildings: FC = () => {
  const router = useRouter();
  const [buildings, loaded] = usePagination({
    query: buildingQuery,
    limit: 15,
  });
  const handelSubmit = async (id: string, e) => {
    await buildingRef
      .doc(id)
      .set({ active: e.target.checked }, { merge: true });
  };
  return (
    <>
      {buildings?.map((building: Building, index: number) => {
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
                    router.push(`buildingAssignment/${building.id}`)
                  }
                >
                  {building.name}
                </Button>
              </Card.Title>
              {(building.address ||
                building.municipality ||
                building.zipCode) && (
                <Card.Body>
                  {building.address && (
                    <Card.Title>Adresse {building.address}</Card.Title>
                  )}
                  {building.municipality && (
                    <Card.Title>Kommune {building.municipality}</Card.Title>
                  )}
                  {building.zipCode && (
                    <Card.Title>Postnummer {building.zipCode}</Card.Title>
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
                    building.active === undefined ? true : building.active
                  }
                  type="checkbox"
                  label="Aktiv"
                  onChange={(e) => handelSubmit(building.id, e)}
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

export default Buildings;
