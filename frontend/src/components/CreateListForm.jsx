import { useState } from "react";
import FormField from "../components/FormField";
import Form from "../components/Form";
import Button from "../components/Button";
import { createList } from "../api/createList";
import "./CreateListForm.css";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function CreateListForm({ setIsOpen }) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    visibility: "PRIVATE",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const createListMutation = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      setIsOpen(false);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    createListMutation.mutate(formData);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="section-title">Create List</h1>

      <FormField
        label="List Name"
        name="name"
        placeholder="e.g. Horror"
        value={formData.name}
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

      <Button type="submit" disabled={createListMutation.isPending}>
        {createListMutation.isPending ? "Creating..." : "Create List"}
      </Button>
    </Form>
  );
}
