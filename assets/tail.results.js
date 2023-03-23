defineCustomElement(
  "result-embed",
  class ResultEmbed extends HTMLElement {
    connectedCallback() {
      const resultId = localStorage.getItem("result_id");
      console.log({ resultId });
      if (resultId) {
        fetch(`/pages/${resultId}`).then((res) => {
          res.text().then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const result = doc.querySelector(`result-template[data-result="${resultId.split("/").pop()}"]`);
            result.classList.remove("hidden");
            this.appendChild(result);
          });
        });
      }
    }
  }
);

// Example
// <result-embed class="contents w-full h-fit"></result-embed>
