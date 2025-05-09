import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import { useAuth } from "../store/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-description">
          The page you are looking for is not unavailable.
        </p>
        <div className="not-found-actions">
          <Button
            className=""
            onClick={() => navigate(user?.admin ? "/admin/dashboard" : "/")}
          >
            Go to Homepage
          </Button>
          <Button
            textOnly
            onClick={() => window.history.back()}
            className="secondary-button"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
