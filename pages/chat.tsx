import ChatRoom from "../components/ChatRoom";
import { chatRef, chatQuery } from "../fetchData/getData";
import usePagination from "../hooks/usePagination";
import { chatsRef, chatsQuery } from "../fetchData/getData";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

type Chat = {
  id: string;
  [userId: string]: string;
};

export default function chat() {
  const [chats, loaded] = usePagination({
    query: chatsQuery,
  });
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
        <div>
          {chats.map((chat: Chat) => (
            <Alert key={chat.id} variant="primary">
              This
            </Alert>
          ))}
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
        <ChatRoom messagesRef={chatRef("df")} query={chatQuery("df")} />
      </div>
    </div>
  );
}
