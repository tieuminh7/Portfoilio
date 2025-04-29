import React from "react";

function Contact({ language }) {
  return (
    <section id="contact">
      <h2>{language === "en" ? "Contact Me" : "Liên hệ"}</h2>
      <p>
        {language === "en"
          ? "You can reach me at: "
          : "Bạn có thể liên hệ với tôi tại: "}
        <a href="mailto:minh@example.com">minh@example.com</a>
      </p>
    </section>
  );
}

export default Contact;
