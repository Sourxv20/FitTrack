import { Flame, CalendarDays, Dumbbell, Footprints } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <span className="eyebrow">DASHBOARD</span>

          <h1>
            Good afternoon,
            <br />
            <span>Sourav 👋</span>
          </h1>

          <p>Ready to train? Let's make today count.</p>
        </div>

        <button className="activity-button">
          <CalendarDays size={17} />
          Today's Activity
        </button>
      </div>

      <div className="stats-grid">

        <div className="card calories-card">
          <div className="card-label">CALORIES BURNED</div>

          <div className="calories-value">
            540 <span>/ 800 kcal</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: "67%" }}
            />
          </div>

          <div className="progress-info">
            <span>67% of daily target</span>
            <span>260 kcal left</span>
          </div>
        </div>

        <div className="card streak-card">
          <div className="card-label">CURRENT STREAK</div>

          <div className="streak-content">
            <div className="icon-box">
              <Flame size={22} />
            </div>

            <div>
              <h2>7 Days</h2>
              <p>Keep the momentum going!</p>
            </div>
          </div>
        </div>

      </div>

      <div className="training-section">

        <div className="section-heading">
          <div>
            <span className="eyebrow">TODAY'S TRAINING</span>
            <h2>Choose your workout</h2>
          </div>

          <Link to="/gym">View plans →</Link>
        </div>

        <div className="workout-grid">

          <Link to="/gym" className="workout-card">
            <div className="workout-icon">
              <Dumbbell size={25} />
            </div>

            <div>
              <h3>Gym Workout</h3>
              <p>Strength & muscle training</p>
            </div>

            <span className="arrow">→</span>
          </Link>

          <Link to="/running" className="workout-card">
            <div className="workout-icon">
              <Footprints size={25} />
            </div>

            <div>
              <h3>Running</h3>
              <p>Track your run & improve pace</p>
            </div>

            <span className="arrow">→</span>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Home;