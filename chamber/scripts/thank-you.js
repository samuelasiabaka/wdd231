document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const details = document.querySelector("#submission-details");
  const fields = [
    ["First Name", "firstName"],
    ["Last Name", "lastName"],
    ["Email", "email"],
    ["Phone Number", "phone"],
    ["Business / Organization", "organization"],
    ["Membership Level", "membership"],
    ["Organizational Title", "title"],
    ["Application Date", "timestamp"],
  ];
  const list = document.createElement("dl");
  fields.forEach(([label, key]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    const value = params.get(key) || "Not provided";
    dd.textContent =
      key === "timestamp" && params.get(key)
        ? new Date(value).toLocaleString("en-NG", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : value;
    list.append(dt, dd);
  });
  details.appendChild(list);
});
