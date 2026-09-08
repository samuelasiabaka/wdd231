const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    completed: true,
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    completed: true,
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    completed: true,
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    completed: false,
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    completed: false,
  },
  {
    subject: "WDD",
    number: 231,
    title: "Frontend Web Development I",
    credits: 2,
    completed: false,
  },
];

const courseList = document.querySelector("#course-list");
const totalCreditsEl = document.querySelector("#total-credits");
const filterButtons = document.querySelectorAll(".filter-btn");

function displayCourses(list) {
  courseList.innerHTML = "";

  list.forEach((course) => {
    const card = document.createElement("div");
    card.className = "course-card" + (course.completed ? " completed" : "");
    card.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            <p>${course.title}</p>
            <p>Credits: ${course.credits}</p>
        `;
    courseList.appendChild(card);
  });

  const total = list.reduce((sum, course) => sum + course.credits, 0);
  totalCreditsEl.textContent = `The total credits for the courses listed above is ${total}`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    if (filter === "all") {
      displayCourses(courses);
    } else {
      displayCourses(courses.filter((course) => course.subject === filter));
    }
  });
});

// Initial render
displayCourses(courses);
