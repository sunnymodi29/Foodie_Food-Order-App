"use client";

import useHttp from "@/src/hooks/useHttp";
import { useEffect, useState, useRef } from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import Loader from "@/components/Loader";
import Toastify from "@/components/Toastify";
import Input from "@/components/UI/Input";
import { useAuth } from "@/src/store/AuthContext";

const requestConfig = {};

export default function AdminMenuPage() {
  const { currencyFormatter, exchangeRate } = useAuth();
  const [meals, setMeals] = useState([]);
  const [updatingMealStock, setUpdatingMealStock] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [modals, setModals] = useState({ edit: false, delete: false });

  const { data: fetchedMeals, isLoading } = useHttp("/api/meals", requestConfig, []);
  const fileInputRef = useRef();
  const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

  useEffect(() => {
    if (fetchedMeals?.length) setMeals(fetchedMeals);
  }, [fetchedMeals]);

  const updateMealStock = async (mealId, inStock) => {
    try {
      setUpdatingMealStock(mealId);
      const res = await fetch("/api/admin/meals/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealId, inStock }),
      });
      if (!res.ok) throw new Error("Failed");
      setMeals(prev => prev.map(m => m.id === mealId ? { ...m, inStock } : m));
      Toastify({ toastType: "success", message: "Stock Updated!!" });
    } catch (err) {
      Toastify({ toastType: "error", message: "Error updating stock." });
    } finally {
      setUpdatingMealStock(null);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setIsSending(true);
      const res = await fetch("/api/admin/meals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedMeal),
      });
      if (!res.ok) throw new Error("Failed");
      setMeals(prev => prev.map(m => m.id === selectedMeal.id ? selectedMeal : m));
      Toastify({ toastType: "success", message: "Meal Edited!!" });
      setModals(p => ({ ...p, edit: false }));
    } catch (err) {
      Toastify({ toastType: "error", message: "Failed to update." });
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      setShowLoader(true);
      const res = await fetch("/api/admin/meals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mealId }),
      });
      if (!res.ok) throw new Error("Failed");
      setMeals(prev => prev.filter(m => m.id !== mealId));
      Toastify({ toastType: "success", message: "Meal Deleted!!" });
    } catch (err) {
      Toastify({ toastType: "error", message: "Failed to delete." });
    } finally {
      setShowLoader(false);
    }
  };

  if (isLoading) return <p className="center">Fetching Menu...</p>;

  return (
    <div className="menu-container">
      {showLoader && <Loader>Deleting...</Loader>}
      <h1 className="admin-title">Manage Menu ({meals.length})</h1>
      <div className="orders-table-container">
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr><th>Actions</th><th>Stock</th><th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Image</th></tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal.id} className={!meal.inStock ? "out-of-stock" : ""}>
                   <td>
                    <Button textOnly onClick={() => { setSelectedMeal(meal); setModals(m => ({ ...m, edit: true })); }}>Edit</Button> | 
                    <Button textOnly onClick={() => { setMealToDelete(meal); setModals(m => ({ ...m, delete: true })); }}>Delete</Button>
                  </td>
                  <td>
                    {updatingMealStock === meal.id ? <div className="spinner-small"></div> : (
                      <select value={meal.inStock ? "available" : "not-available"} onChange={(e) => updateMealStock(meal.id, e.target.value === "available")}>
                        <option value="available">Available</option><option value="not-available">Not Available</option>
                      </select>
                    )}
                  </td>
                  <td>{meal.id}</td><td>{meal.name}</td><td>{meal.description}</td><td>{currencyFormatter(meal.price)}</td>
                  <td className="table_img"><img src={`/api/images/${meal.image}`} alt={meal.name} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modals.edit} onClose={() => setModals(p => ({ ...p, edit: false }))}>
        {selectedMeal && (
          <form className="edit-meal-form">
            <h2>Edit Meal</h2>
            <Input label="Name" value={selectedMeal.name} onChange={e => setSelectedMeal(p => ({ ...p, name: e.target.value }))} />
            <Input isTextarea label="Description" value={selectedMeal.description} onChange={e => setSelectedMeal(p => ({ ...p, description: e.target.value }))} />
            <Input type="number" label="Price" value={(selectedMeal.price * exchangeRate).toFixed()} onChange={e => setSelectedMeal(p => ({ ...p, price: parseFloat(e.target.value) / exchangeRate }))} />
            <div className="modal-actions">
              <Button type="button" onClick={() => setModals(p => ({ ...p, edit: false }))}>Cancel</Button>
              <Button type="button" onClick={handleSaveEdit}>{isSending ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={modals.delete} onClose={() => setModals(p => ({ ...p, delete: false }))}>
        {mealToDelete && (
          <div>
            <h2>Confirm Deletion</h2>
            <p>Delete {mealToDelete.name}?</p>
            <div className="modal-actions">
              <Button onClick={() => setModals(p => ({ ...p, delete: false }))}>Cancel</Button>
              <Button onClick={() => { handleDeleteMeal(mealToDelete.id); setModals(p => ({ ...p, delete: false })); }}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
