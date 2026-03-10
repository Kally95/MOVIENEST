import Button from "./Button";
import Form from "./Form";
import FormField from "./FormField";
import "./EditListForm.css";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editListById } from "../api/editListById";

export default function EditListForm({
  listName,
  listId,
  visibility,
  setIsOpen,
}) {
  const [formData, setFormData] = useState({
    name: listName,
    visibility: visibility,
  });
  const queryClient = useQueryClient();

  const editListMutation = useMutation({
    mutationFn: editListById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      setIsOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();

    editListMutation.mutate({
      id: listId,
      name: formData.name,
      visibility: formData.visibility,
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="section-title">Edit List</h1>

      <FormField
        className="edit-list-formfield"
        value={formData.name}
        name="name"
        onChange={handleChange}
        required
      />

      <div className="create-list-form-actions">
        <select
          className="visibility-select"
          name="visibility"
          id="visibility"
          value={formData.visibility}
          onChange={handleChange}
        >
          <option value="PRIVATE">Private</option>
          <option value="PUBLIC">Public</option>
        </select>
      </div>

      <Button type="submit" disabled={editListMutation.isPending}>
        {editListMutation.isPending ? "Saving..." : "Save"}
      </Button>
      {editListMutation.isError && (
        <p className="edit-list-form-error">{editListMutation.error.message}</p>
      )}
    </Form>
  );
}
