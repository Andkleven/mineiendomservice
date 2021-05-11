import { useEffect } from "react";
import { usePaginationData } from "react-firebase-pagination-hooks";
import firebase from "../firebase/clientApp";

export default function usePagination({
  limit = 15,
  query,  
}: {
  query: firebase.firestore.Query<firebase.firestore.DocumentData>;
  limit?: number;
}): [unknown[], boolean] {
  const [assignments, { loaded, hasMore, loadingMore, loadMore }, error] =
    usePaginationData(query, {
      idField: "id",
      limit,
    });
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loadingMore]);
  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom && hasMore && !loadingMore) {
      loadMore();
    }
  };
  return [assignments, loaded];
}
