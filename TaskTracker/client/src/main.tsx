import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import fonts
const webFontLink = document.createElement("link");
webFontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap";
webFontLink.rel = "stylesheet";
document.head.appendChild(webFontLink);

// Add font family styles
const style = document.createElement("style");
style.textContent = `
  :root {
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .font-nunito {
    font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
