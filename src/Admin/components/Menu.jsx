import useHttp from "../../hooks/useHttp";
import { useEffect, useState, useRef } from "react";
import Modal from "../../components/UI/Modal";
import Button from "../../components/UI/Button";
import Loader from "../../components/Loader";
import Toastify from "../../components/Toastify";
import Input from "../../components/UI/Input";
import { useAuth } from "../../store/AuthContext";

const requestConfig = {};

const Menu = () => {
  const { currencyFormatter, exchangeRate } = useAuth();

  const [meals, setMeals] = useState([]);
  const [updatingMealStock, setUpdatingMealStock] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [modals, setModals] = useState({
    edit: false,
    delete: false,
  });
  const [imageError, setImageError] = useState(false);

  const {
    data: fetchedMeals,
    isLoading,
    error,
  } = useHttp(
    "https://foodie-food-order-app.onrender.com/meals",
    requestConfig,
    []
  );

  const fileInputRef = useRef();

  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

  useEffect(() => {
    if (fetchedMeals?.length) setMeals(fetchedMeals);
  }, [fetchedMeals]);

  // const sortedMeals = useMemo(
  //   () => [...meals].sort((a, b) => a.id - b.id),
  //   [meals]
  // );

  const showToast = (message, type = "success") => {
    Toastify({ toastType: type, message });
  };

  const updateMealStock = async (mealId, inStock) => {
    try {
      setUpdatingMealStock(mealId);
      const response = await fetch(
        "https://foodie-food-order-app.onrender.com/update-meal-stock",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mealId, inStock }),
        }
      );
      if (!response.ok) throw new Error("Failed to update meal stock");

      setMeals((prev) =>
        prev.map((meal) => (meal.id === mealId ? { ...meal, inStock } : meal))
      );
      showToast("Stock Updated!!");
    } catch (err) {
      showToast("Error updating stock status.", "error");
    } finally {
      setUpdatingMealStock(null);
    }
  };

  const handleMealStock = (e, mealId) => {
    const stockValue = e.target.value === "available";
    updateMealStock(mealId, stockValue);
  };

  const openEditModal = (meal) => {
    setSelectedMeal(meal);
    setModals((prev) => ({ ...prev, edit: true }));
  };

  const closeEditModal = () => {
    setSelectedMeal(null);
    setModals((prev) => ({ ...prev, edit: false }));
  };

  const openDeleteModal = (meal) => {
    setMealToDelete(meal);
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const closeDeleteModal = () => {
    setMealToDelete(null);
    setModals((prev) => ({ ...prev, delete: false }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const basePrice = parseFloat(value) / exchangeRate;
      setSelectedMeal((prev) => ({
        ...prev,
        [name]: isNaN(basePrice) ? 0 : basePrice,
      }));
    } else {
      setSelectedMeal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        e.target.value = "";
        setImageError(true);
        setTimeout(() => {
          setImageError(false);
        }, 2000);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMeal((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setIsSending(true);
      const response = await fetch(
        "https://foodie-food-order-app.onrender.com/edit-meal",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedMeal),
        }
      );

      if (!response.ok) throw new Error("Failed to update meal");

      setMeals((prev) =>
        prev.map((meal) => (meal.id === selectedMeal.id ? selectedMeal : meal))
      );
      showToast("Meal Edited Successfully!!");
      closeEditModal();
    } catch (err) {
      showToast("Failed to update meal.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      setShowLoader(true);
      const response = await fetch(
        "https://foodie-food-order-app.onrender.com/delete-meal",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: mealId }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete meal");

      setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
      showToast("Meal Delete Successfully!!");
    } catch (err) {
      showToast("Failed to delete meal.", "error");
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
              <tr>
                <th>Actions</th>
                <th>Meal Stock</th>
                <th>Meal ID</th>
                <th>Meal Name</th>
                <th>Meal Description</th>
                <th>Price</th>
                <th>Image</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr
                  key={meal.id}
                  className={!meal.inStock ? "out-of-stock" : ""}
                >
                  <td>
                    <Button
                      textOnly
                      onClick={() => openEditModal(meal)}
                      className="edit-btn"
                    >
                      Edit
                    </Button>{" "}
                    |
                    <Button
                      textOnly
                      onClick={() => openDeleteModal(meal)}
                      className="delete-btn"
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    {updatingMealStock === meal.id ? (
                      <div className="spinner_wrap">
                        <div className="spinner-small"></div>
                      </div>
                    ) : (
                      <select
                        className="date-filter"
                        value={meal.inStock ? "available" : "not-available"}
                        onChange={(e) => handleMealStock(e, meal.id)}
                      >
                        <option value="available">Available</option>
                        <option value="not-available">Not Available</option>
                      </select>
                    )}
                  </td>
                  <td>{meal.id}</td>
                  <td>{meal.name}</td>
                  <td>
                    <span className="meal_description">{meal.description}</span>
                  </td>
                  <td>{currencyFormatter(meal.price)}</td>
                  <td className="table_img">
                    <img
                      src={
                        meal.image.startsWith("images/")
                          ? `https://foodie-food-order-app.onrender.com/${meal.image}`
                          : meal.image
                      }
                      alt={meal.name}
                    />
                  </td>
                  <td>{meal.category || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Meal Modal */}
      <Modal open={modals.edit} onClose={closeEditModal}>
        {selectedMeal && (
          <form method="dialog" className="edit-meal-form">
            <h2>Edit Meal</h2>
            <Input
              type="text"
              label="Name:"
              name="name"
              value={selectedMeal.name}
              onChange={handleEditChange}
            />
            <Input
              isTextarea="true"
              label="Description:"
              name="description"
              value={selectedMeal.description}
              onChange={handleEditChange}
            />
            <Input
              type="number"
              label="Price:"
              name="price"
              value={(selectedMeal.price * exchangeRate).toFixed()}
              onChange={handleEditChange}
            />
            <Input
              type="text"
              label="Category:"
              name="category"
              value={selectedMeal.category || ""}
              onChange={handleEditChange}
            />
            <div className="image-preview-wrapper">
              <label>Image:</label>
              <img
                src={
                  selectedMeal.image.startsWith("images/")
                    ? `https://foodie-food-order-app.onrender.com/${selectedMeal.image}`
                    : selectedMeal.image
                }
                alt={selectedMeal.name}
                className="modal-img"
              />
              <button
                type="button"
                className="change-image"
                onClick={() => fileInputRef.current.click()}
              >
                Change Image
              </button>
              <Input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleEditImageChange}
              />
            </div>
            {imageError && (
              <span className="image-error-wrapper errorText">
                Image is too large! Please select an image under 1MB.
              </span>
            )}
            <div className="modal-actions">
              <Button
                type="button"
                className="secondary-button"
                onClick={closeEditModal}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveEdit}>
                {isSending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Meal Modal */}
      <Modal open={modals.delete} onClose={closeDeleteModal}>
        {mealToDelete && (
          <div className="delete-confirmation">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{mealToDelete.name}</strong>?
            </p>
            <div className="modal-actions">
              <Button
                className="secondary-button"
                type="button"
                onClick={closeDeleteModal}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleDeleteMeal(mealToDelete.id);
                  closeDeleteModal();
                }}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Menu;
