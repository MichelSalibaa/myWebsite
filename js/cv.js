(function () {
    const sampleData = Object.freeze({
        personal: {
            name: "Michel Saliba",
            tagline: "Telecommunications Engineering Student | Wireless & RF Enthusiast",
            location: "Kaslik & Jounieh, Lebanon",
            email: "michel12.saliba@gmail.com",
            phone: "",
            linkedin: "https://www.linkedin.com/in/michel-saliba-05491423a/"
        },
        summary: "Telecommunications engineering student entering the final year at USEK with hands-on experience in mobile networks, RF systems, and field site installation.",
        experience: [
            {
                role: "Technical & Radio Intern",
                organization: "Touch (MTC)",
                timeframe: "July 2024 - Sept 2024",
                location: "Lebanon",
                details: [
                    "Studied 2G, 3G, and LTE technologies in production environments.",
                    "Reviewed congestion reports and optimization strategies.",
                    "Analyzed frequency planning scenarios to minimize interference."
                ]
            },
            {
                role: "Cloud Computing Intern",
                organization: "Activeo",
                timeframe: "July 2025 - Sept 2025",
                location: "Lebanon",
                details: [
                    "Completed AWS Cloud Practitioner foundational modules.",
                    "Built familiarity with EC2, S3, RDS, Lambda and pricing models.",
                    "Assisted in cloud solution design exercises covering security."
                ]
            }
        ],
        education: [
            {
                degree: "BE in Telecommunications Engineering",
                school: "Holy Spirit University of Kaslik (USEK)",
                years: "2021 - Present",
                highlights: "Entering final year"
            },
            {
                degree: "Lebanese Baccalaureate in Life Science",
                school: "College des Soeurs du Rosaire",
                years: "2019",
                highlights: "Graduated with DELF B2 certification"
            }
        ],
        skills: {
            programming: ["Java", "MATLAB"],
            engineering: ["OrCAD PSpice", "NI Multisim", "LabVIEW"],
            focus: ["Microprocessors", "Digital Circuits", "Wireless Technologies"],
            languages: ["Arabic - Fluent", "English - Fluent", "French - Fluent"],
            productivity: ["Microsoft Office Suite"]
        },
        projects: ["DELF B2 Certificate", "DELF B1 Certificate"]
    });

    const placeholders = Object.freeze({
        personal: {
            name: "Your name",
            tagline: "Headline or desired role",
            location: "City, Country",
            email: "name@example.com",
            phone: "",
            linkedin: ""
        },
        summary: "Summarize your background, strengths and goals in 2-3 sentences."
    });

    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("cv-form");
        const preview = document.getElementById("cv-preview");
        if (!form || !preview) {
            return;
        }

        let currentData = cloneData(sampleData);
        renderPreview(preview, currentData);
        initRepeatables(form);

        const updateFromForm = () => {
            const data = buildCvData(form);
            currentData = data;
            renderPreview(preview, currentData);
        };

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!form.reportValidity()) {
                return;
            }
            updateFromForm();
        });

        form.addEventListener("input", () => {
            updateFromForm();
        });

        form.addEventListener("reset", () => {
            window.setTimeout(() => {
                resetRepeatables(form);
                currentData = cloneData(sampleData);
                renderPreview(preview, currentData);
            }, 0);
        });
    });

    function initRepeatables(form) {
        const repeatableContainers = form.querySelectorAll(".repeatable");
        repeatableContainers.forEach((container) => {
            updateRemoveButtons(container);
            container.addEventListener("click", (event) => {
                const removeBtn = event.target.closest(".repeatable__remove");
                if (!removeBtn) {
                    return;
                }
                const entry = removeBtn.closest("[data-entry]");
                if (!entry) {
                    return;
                }
                const entries = container.querySelectorAll("[data-entry]");
                if (entries.length <= 1) {
                    return;
                }
                entry.remove();
                updateRemoveButtons(container);
                form.dispatchEvent(new Event("input", { bubbles: true }));
            });
        });

        const addButtons = form.querySelectorAll(".repeatable__add");
        addButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const target = button.dataset.target;
                const container = form.querySelector(`.repeatable[data-repeatable="${target}"]`);
                const template = document.getElementById(`${target}-template`);
                if (!container || !template) {
                    return;
                }
                const clone = template.content.firstElementChild.cloneNode(true);
                container.appendChild(clone);
                updateRemoveButtons(container);
                const firstField = clone.querySelector("input, textarea");
                if (firstField) {
                    firstField.focus();
                }
                form.dispatchEvent(new Event("input", { bubbles: true }));
            });
        });
    }

    function resetRepeatables(form) {
        const repeatableContainers = form.querySelectorAll(".repeatable");
        repeatableContainers.forEach((container) => {
            const entries = Array.from(container.querySelectorAll("[data-entry]"));
            entries.forEach((entry, index) => {
                if (index === 0) {
                    entry.querySelectorAll("input, textarea").forEach((field) => {
                        field.value = "";
                    });
                } else {
                    entry.remove();
                }
            });
            updateRemoveButtons(container);
        });
    }

    function updateRemoveButtons(container) {
        const entries = container.querySelectorAll("[data-entry]");
        const buttons = container.querySelectorAll(".repeatable__remove");
        const shouldHide = entries.length <= 1;
        buttons.forEach((btn) => {
            btn.hidden = shouldHide;
            btn.disabled = shouldHide;
        });
    }

    function buildCvData(form) {
        const personal = {
            name: form.fullName.value.trim() || placeholders.personal.name,
            tagline: form.tagline.value.trim() || placeholders.personal.tagline,
            location: form.location.value.trim() || placeholders.personal.location,
            email: form.email.value.trim() || placeholders.personal.email,
            phone: form.phone.value.trim(),
            linkedin: form.linkedin.value.trim()
        };

        const summary = form.summary.value.trim() || placeholders.summary;

        const experienceEntries = extractRepeatableEntries(form, "experience", (entry) => {
            const role = entry.querySelector(".experience-role").value.trim();
            const organization = entry.querySelector(".experience-org").value.trim();
            const timeframe = entry.querySelector(".experience-time").value.trim();
            const location = entry.querySelector(".experience-location").value.trim();
            const details = splitLines(entry.querySelector(".experience-details").value);
            if (!role && !organization && details.length === 0) {
                return null;
            }
            return { role, organization, timeframe, location, details };
        });

        const educationEntries = extractRepeatableEntries(form, "education", (entry) => {
            const degree = entry.querySelector(".education-degree").value.trim();
            const school = entry.querySelector(".education-school").value.trim();
            const years = entry.querySelector(".education-years").value.trim();
            const highlights = entry.querySelector(".education-highlights").value.trim();
            if (!degree && !school && !years && !highlights) {
                return null;
            }
            return { degree, school, years, highlights };
        });

        const skills = {
            programming: splitCommaList(form.querySelector("#programming-skills").value),
            engineering: splitCommaList(form.querySelector("#engineering-skills").value),
            focus: splitCommaList(form.querySelector("#focus-areas").value),
            languages: splitCommaList(form.querySelector("#languages").value),
            productivity: splitCommaList(form.querySelector("#productivity").value)
        };

        const projects = splitLines(form.projects.value);

        return { personal, summary, experience: experienceEntries, education: educationEntries, skills, projects };
    }

    function extractRepeatableEntries(form, groupName, mapper) {
        const container = form.querySelector(`.repeatable[data-repeatable="${groupName}"]`);
        if (!container) {
            return [];
        }
        const entries = Array.from(container.querySelectorAll("[data-entry]"));
        return entries
            .map(mapper)
            .filter((item) => item && (Object.values(item).some((value) => {
                if (Array.isArray(value)) {
                    return value.length > 0;
                }
                return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
            })));
    }

    function renderPreview(preview, data) {
        preview.innerHTML = "";
        preview.appendChild(buildCvArticle(data));
    }

    function buildCvArticle(data) {
        const article = document.createElement("article");
        article.className = "cv";

        const intro = document.createElement("section");
        intro.className = "cv__intro";

        const headline = document.createElement("div");
        headline.className = "cv__headline";
        const h2 = document.createElement("h2");
        h2.textContent = data.personal.name;
        const tagline = document.createElement("p");
        tagline.className = "cv__tagline";
        tagline.textContent = data.personal.tagline;
        headline.append(h2, tagline);

        const contactList = document.createElement("ul");
        contactList.className = "cv__contact";
        contactList.appendChild(createContactItem("Location", data.personal.location));
        if (data.personal.email) {
            const emailItem = document.createElement("li");
            const labelSpan = document.createElement("span");
            labelSpan.textContent = "Email:";
            emailItem.appendChild(labelSpan);
            const link = document.createElement("a");
            link.href = `mailto:${data.personal.email}`;
            link.textContent = data.personal.email;
            emailItem.appendChild(link);
            contactList.appendChild(emailItem);
        }
        if (data.personal.phone) {
            contactList.appendChild(createContactItem("Phone", data.personal.phone));
        }
        if (data.personal.linkedin) {
            const linkedItem = document.createElement("li");
            const labelSpan = document.createElement("span");
            labelSpan.textContent = "LinkedIn:";
            linkedItem.appendChild(labelSpan);
            const link = document.createElement("a");
            link.href = data.personal.linkedin;
            link.target = "_blank";
            link.rel = "noreferrer";
            link.textContent = data.personal.linkedin.replace(/^https?:\/\//i, "");
            linkedItem.appendChild(link);
            contactList.appendChild(linkedItem);
        }

        const cta = document.createElement("div");
        cta.className = "cv__cta";
        const ctaNote = document.createElement("p");
        ctaNote.className = "cv__cta-note";
        ctaNote.textContent = "Live preview generated from the CV entry form.";
        cta.appendChild(ctaNote);

        intro.append(headline, contactList, cta);

        const summarySection = document.createElement("section");
        summarySection.className = "cv__summary";
        const summaryHeading = document.createElement("h3");
        summaryHeading.textContent = "Professional Summary";
        const summaryParagraph = document.createElement("p");
        summaryParagraph.textContent = data.summary;
        summarySection.append(summaryHeading, summaryParagraph);

        const grid = document.createElement("section");
        grid.className = "cv__grid";

        const experienceSection = document.createElement("section");
        const expTitle = document.createElement("h3");
        expTitle.textContent = "Experience";
        experienceSection.appendChild(expTitle);
        if (data.experience.length === 0) {
            experienceSection.appendChild(createPlaceholderParagraph("Add experience entries to see them listed here."));
        } else {
            data.experience.forEach((job) => {
                const jobArticle = document.createElement("article");
                jobArticle.className = "cv__job";
                const header = document.createElement("header");
                const title = document.createElement("h4");
                const titleText = job.role && job.organization
                    ? `${job.role} at ${job.organization}`
                    : (job.role || job.organization || "Experience entry");
                title.textContent = titleText;
                const meta = document.createElement("p");
                meta.className = "cv__job-meta";
                meta.textContent = joinValues([job.timeframe, job.location], " | ");
                header.append(title, meta);
                jobArticle.appendChild(header);
                if (job.details.length > 0) {
                    const list = document.createElement("ul");
                    job.details.forEach((bullet) => {
                        const li = document.createElement("li");
                        li.textContent = bullet;
                        list.appendChild(li);
                    });
                    jobArticle.appendChild(list);
                }
                experienceSection.appendChild(jobArticle);
            });
        }

        const educationSection = document.createElement("section");
        const eduTitle = document.createElement("h3");
        eduTitle.textContent = "Education";
        educationSection.appendChild(eduTitle);
        if (data.education.length === 0) {
            educationSection.appendChild(createPlaceholderParagraph("Add education entries to render them."));
        } else {
            data.education.forEach((item) => {
                const card = document.createElement("div");
                card.className = "cv__education";
                const degree = document.createElement("h4");
                degree.textContent = item.degree;
                const school = document.createElement("p");
                school.textContent = item.school;
                const years = document.createElement("p");
                years.className = "cv__job-meta";
                years.textContent = item.years;
                card.append(degree, school, years);
                if (item.highlights) {
                    const highlight = document.createElement("p");
                    highlight.textContent = item.highlights;
                    card.appendChild(highlight);
                }
                educationSection.appendChild(card);
            });
        }

        const skillsTitle = document.createElement("h3");
        skillsTitle.textContent = "Skills & Attributes";
        educationSection.appendChild(skillsTitle);

        renderSkillGroup(educationSection, "Programming & Tools", data.skills.programming);
        renderSkillGroup(educationSection, "Engineering Software", data.skills.engineering);
        renderSkillGroup(educationSection, "Concepts & Focus Areas", data.skills.focus);
        renderSkillGroup(educationSection, "Languages", data.skills.languages);
        renderSkillGroup(educationSection, "Productivity & Collaboration", data.skills.productivity);

        if (data.projects.length > 0) {
            const projectsTitle = document.createElement("h3");
            projectsTitle.textContent = "Projects & Certifications";
            const projectList = document.createElement("ul");
            data.projects.forEach((item) => {
                const li = document.createElement("li");
                li.textContent = item;
                projectList.appendChild(li);
            });
            educationSection.append(projectsTitle, projectList);
        }

        grid.append(experienceSection, educationSection);
        article.append(intro, summarySection, grid);
        return article;
    }

    function renderSkillGroup(parent, title, items) {
        if (!items || items.length === 0) {
            return;
        }
        const heading = document.createElement("h4");
        heading.textContent = title;
        const list = document.createElement("ul");
        list.className = "cv__tag-list";
        items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
        });
        parent.append(heading, list);
    }

    function joinValues(values, separator) {
        return values.filter((value) => value && value.length > 0).join(separator);
    }

    function createContactItem(label, value) {
        const item = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = `${label}:`;
        item.appendChild(span);
        const text = document.createTextNode(` ${value}`);
        item.appendChild(text);
        return item;
    }

    function createPlaceholderParagraph(message) {
        const paragraph = document.createElement("p");
        paragraph.className = "placeholder-text";
        paragraph.textContent = message;
        return paragraph;
    }

    function splitCommaList(value) {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
    }

    function splitLines(value) {
        return value
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
    }

    function cloneData(data) {
        return JSON.parse(JSON.stringify(data));
    }
})();
