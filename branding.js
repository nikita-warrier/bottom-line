const chatForm = document.getElementById("chatForm");

const chatInput = document.getElementById("chatInput");

const chatMessages = document.getElementById("chatMessages");


chatForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const message = chatInput.value.trim();


    if (!message) {
        return;
    }


    // Show user's message

    addMessage(message, "user");


    // Clear input

    chatInput.value = "";


    // Show loading message

    const loadingMessage =
        addMessage("Thinking...", "ai");


    try {

        const response = await fetch(
            "/api/branding",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })

            }
        );


        if (!response.ok) {

            throw new Error(
                "Gemini request failed"
            );

        }


        const data =
            await response.json();


        // Remove "Thinking..."

        loadingMessage.remove();


        // Add Gemini's response

        addMessage(
            data.message,
            "ai"
        );


        // Update branding fields

        updateBrandingFields(
            data.updates
        );


    } catch (error) {

        console.error(error);


        loadingMessage.textContent =
            "Sorry! Something went wrong. Please try again.";

    }

});


/* =========================================
   UPDATE BRANDING FIELDS
========================================= */

function updateBrandingFields(updates) {

    if (!updates) {
        return;
    }


    // Company Name

    if (updates.companyName) {

        document.getElementById(
            "companyName"
        ).value = updates.companyName;

    }


    // Mission

    if (updates.mission) {

        document.getElementById(
            "mission"
        ).value = updates.mission;

    }


    // Vision

    if (updates.vision) {

        document.getElementById(
            "vision"
        ).value = updates.vision;

    }


    // Goals

    if (
        Array.isArray(updates.goals) &&
        updates.goals.length > 0
    ) {

        document.getElementById(
            "goals"
        ).value = updates.goals.join("\n");

    }


    // Colors

    if (
        Array.isArray(updates.colors) &&
        updates.colors.length > 0
    ) {

        const colorInputs =
            document.querySelectorAll(
                ".color-input"
            );


        updates.colors.forEach(
            (color, index) => {

                if (colorInputs[index]) {

                    colorInputs[index].value =
                        color;

                }

            }
        );

    }


    // Heading Font

    if (updates.headingFont) {

        document.getElementById(
            "headingFont"
        ).value = updates.headingFont;

    }


    // Body Font

    if (updates.bodyFont) {

        document.getElementById(
            "bodyFont"
        ).value = updates.bodyFont;

    }


    // Miscellaneous

    if (updates.misc) {

        document.getElementById(
            "misc"
        ).value = updates.misc;

    }

}


/* =========================================
   ADD CHAT MESSAGE
========================================= */

function addMessage(text, type) {

    const message =
        document.createElement("div");


    message.classList.add(
        "message"
    );


    if (type === "user") {

        message.classList.add(
            "user-message"
        );

    } else {

        message.classList.add(
            "ai-message"
        );

    }


    message.textContent = text;


    chatMessages.appendChild(
        message
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;


    return message;

}