import React from "react";

function Footer({ language }) {
  return (
    <footer>
      <p>
        {language === "en"
          ? "© 2025 My Portfolio. All rights reserved."
          : "© 2025 Portfolio của tôi. Bảo lưu mọi quyền."}
      </p>
    </footer>
  );
}

export default Footer;
