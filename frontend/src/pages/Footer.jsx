import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h3 className="section-title">🛠️ Built by Ali Kalkanel 🛠️</h3>

        <p className="footer-text">
          MovieNest is a web app for discovering and saving your favorite films.
          Each movie page displays key details like ratings, summaries, and cast
          information. The focus is on a clean, responsive interface with
          dynamic data integration.
        </p>

        <div className="footer-socials">
          <a
            href="https://github.com/kally95"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-github"></i>
          </a>

          <a
            href="https://linkedin.com/in/ali-kalkanel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
