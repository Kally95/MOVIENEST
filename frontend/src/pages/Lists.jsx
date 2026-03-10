import { useQuery, useQueries } from "@tanstack/react-query";
import "./Lists.css";
import { getLists } from "../api/getLists";
import { getListItems } from "../api/getListItems";
import ListCard from "../components/ListCard";
import Button from "../components/Button";
import { useState } from "react";
import Modal from "../components/Modal";
import CreateListForm from "../components/CreateListForm";
import { useAuth } from "../contexts/AuthContext";

export default function Lists() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth } = useAuth();

  const listQuery = useQuery({
    queryKey: ["lists"],
    queryFn: getLists,
  });

  const allListItemQueries = useQueries({
    queries: (listQuery.data ?? []).map((list) => ({
      queryKey: ["listItems", list.id],
      queryFn: () => getListItems(list.id),
      enabled: !!list.id,
    })),
  });

  const handleCreateList = () => {
    setIsOpen(true);
  };

  const allListItems = allListItemQueries.map((query) => query.data);
  const allLists = listQuery.data ?? [];

  return (
    <section className="list-section list-main-title">
      <div className="list-section-header">
        <h1 className="section-title">Lists</h1>
        {!isAuth && <Button onClick={handleCreateList}>Create List</Button>}
      </div>

      <div className="lists-container">
        {allLists.map((list, i) => {
          const listItems = allListItems[i];
          return (
            <ListCard
              key={list.id}
              id={list.id}
              list={list}
              listItems={listItems}
            />
          );
        })}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreateListForm setIsOpen={setIsOpen} />
      </Modal>
    </section>
  );
}
