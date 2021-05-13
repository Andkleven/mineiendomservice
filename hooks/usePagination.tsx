import { useEffect } from "react";
import { usePaginationData } from "react-firebase-pagination-hooks";
import firebase from "../firebase/clientApp";

export default function usePagination({
  limit = 15,
  query,
}: {
  query: firebase.firestore.Query<firebase.firestore.DocumentData> | null;
  limit?: number;
}): [unknown[], boolean] {
  const [data, { loaded, hasMore, loadingMore, loadMore }, error] = query
    ? usePaginationData(query, {
        idField: "id",
        limit,
      })
    : [
        [],
        {
          loaded: true,
          hasMore: false,
          loadingMore: false,
          loadMore: () => {},
        },
        null,
      ];
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
  return [data, loaded];
}
