import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";

import "./Profile.css";

export default function Profile() {
  const { userEmail } = useAuth();

  return (
    <main className="profile">
      <h1 className="section-title">Profile</h1>

      <section className="profile-card">
        <h2 className="profile-card__title">Account Information</h2>

        <div className="profile-row">
          <span className="profile-row__label">Email</span>
          <span className="profile-row__value">{userEmail}</span>
        </div>
      </section>

      <section className="profile-card">
        <h2 className="profile-card__title">Security</h2>
        <div className="profile-card__actions">
          <Button>Change password</Button>
          <Button>Change Email</Button>
        </div>
      </section>
    </main>
  );
}
