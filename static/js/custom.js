window.addEventListener("DOMContentLoaded", () => {
  const rnds = document.querySelectorAll(".random-order>.inner");
  rnds.forEach((element) => {
    const children = [...element.querySelectorAll("article")].sort(
      () => Math.random() - 0.5
    );
    children.forEach((child) => {
      element.removeChild(child);
      element.appendChild(child);
    });
  });

  function getStartDate(dateString) {
    return Date.parse(dateString.split(",")[0]).valueOf();
  }

  function formatTime(date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const fmt1 = new Date(Date.parse(date)).toLocaleString("de-DE", {
      ...options,
      ...(date && date.includes("T") && { hour: "numeric", minute: "numeric" }),
    });
    if (date && date.includes("T")) {
      return `${fmt1} Uhr`;
    }
    return fmt1;
  }

  function formatPastTime(date) {
    const options = {
      year: "numeric",
      month: "long",
    };
    return new Date(Date.parse(date)).toLocaleString("de-DE", {
      ...options,
    });
  }

  const concertContainer = document.querySelectorAll("ul.concerts");
  concertContainer.forEach((container) => {
    const concerts = [...container.querySelectorAll("li")];
    const mode = container.dataset.mode === "past" ? -1 : 1;
    const defaultImage = container.dataset.defaultImage;
    concerts.sort(
      (a, b) =>
        (getStartDate(a.dataset.date) - getStartDate(b.dataset.date)) * mode
    );
    if (mode > 0) {
      concerts.forEach((concert) => {
        container.removeChild(concert);
        const { name, date, locationName, locationLink, fee, link } =
          concert.dataset;
        // TODO: fix date
        const splittedDate = date.split(",");
        const dateStart = splittedDate[0];
        const dateEnd = splittedDate[splittedDate.length - 1];
        if (Date.parse(dateEnd) * mode < Date.now() * mode) {
          return;
        }
        const li = document.createElement("li");
        const headline = document.createElement("strong");
        headline.classList.add("font-h3");
        if (link) {
          const a = document.createElement("a");
          a.href = link;
          a.target = "_blank";
          a.textContent = name;
          headline.appendChild(a);
        } else {
          headline.appendChild(document.createTextNode(name));
        }
        li.appendChild(headline);
        li.appendChild(document.createElement("br"));

        const start = formatTime(dateStart);
        li.appendChild(document.createTextNode(start));
        if (dateEnd !== dateStart) {
          const end = formatTime(dateEnd);
          li.appendChild(document.createTextNode(` bis ${end}`));
        }

        li.appendChild(document.createElement("br"));
        if (locationLink) {
          const a = document.createElement("a");
          a.href = locationLink;
          a.target = "_blank";
          a.textContent = locationName;
          li.appendChild(a);
        } else {
          li.appendChild(document.createTextNode(locationName));
        }

        if (fee) {
          li.appendChild(document.createElement("br"));
          if (fee.search(/[a-zA-Z]/) > -1) {
            li.appendChild(document.createTextNode(fee));
          } else {
            li.appendChild(document.createTextNode(`Eintritt: ${fee}€`));
          }
        }

        container.appendChild(li);
      });
    } else {
      const target = document.querySelector("#concert-target");
      concerts.forEach((concert) => {
        container.removeChild(concert);
        const { name, date, locationName, image } = concert.dataset;
        // TODO: fix date
        const splittedDate = date.split(",");
        const dateStart = splittedDate[0];
        const dateEnd = splittedDate[splittedDate.length - 1];
        if (Date.parse(dateEnd) * mode < Date.now() * mode) {
          return;
        }
        const li = document.createElement("article");
        // add image
        const imageTag = document.createElement("img");
        imageTag.src = image && image !== "" ? image : defaultImage;
        imageTag.alt = "";
        imageTag.loading = "lazy";
        imageTag.classList.add("image");
        li.appendChild(imageTag);

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("info");

        const headline = document.createElement("h3");

        headline.appendChild(document.createTextNode(name));

        infoDiv.appendChild(headline);

        const start = formatPastTime(dateStart);
        infoDiv.appendChild(
          document.createTextNode(`${start}, ${locationName}`)
        );
        li.appendChild(infoDiv);

        container.appendChild(li);
      });
    }
  });
});
