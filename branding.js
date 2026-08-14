const chatForm = document.getElementById("chatForm");

const chatInput = document.getElementById("chatInput");

const chatMessages = document.getElementById("chatMessages");


chatForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const message = chatInput.value.trim();


    if (!message) {
        return;
    }


    // show user's message

    addMessage(message, "user");


    // clear input

    chatInput.value = "";


    // show loading message

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



        loadingMessage.remove();


        // add gemini's response

        addMessage(
            data.message,
            "ai"
        );


        // update branding fields

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
   update branding fields
========================================= */

function updateBrandingFields(updates) {

    if (!updates) {
        return;
    }

    if (updates.companyName) {

        document.getElementById(
            "companyName"
        ).value = updates.companyName;

    }

    if (updates.mission) {

        document.getElementById(
            "mission"
        ).value = updates.mission;

    }

    if (updates.vision) {

        document.getElementById(
            "vision"
        ).value = updates.vision;

    }

    if (
        Array.isArray(updates.goals) &&
        updates.goals.length > 0
    ) {

        document.getElementById(
            "goals"
        ).value = updates.goals.join("\n");

    }

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
    if (updates.headingFont) {

        document.getElementById(
            "headingFont"
        ).value = updates.headingFont;

    }

    if (updates.bodyFont) {

        document.getElementById(
            "bodyFont"
        ).value = updates.bodyFont;

    }

    if (updates.misc) {

        document.getElementById(
            "misc"
        ).value = updates.misc;

    }

}


/* =========================================
   add message to chat
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