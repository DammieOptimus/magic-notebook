// Wait for the entire HTML page to be loaded and ready
document.addEventListener('DOMContentLoaded', () => {

    // --- FIREBASE INITIALIZATION ---

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCQ2IOoNAGEYWJMN4iB1j1cgg199MLqCnU",
        authDomain: "magic-notebook-project.firebaseapp.com",
        projectId: "magic-notebook-project",
        storageBucket: "magic-notebook-project.firebasestorage.app",
        messagingSenderId: "279845274939",
        appId: "1:279845274939:web:a7cfa6e916b7e5ca5d631e"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the Firestore database service
    const db = firebase.firestore();

    // Create a reference to the specific document we want to work with.
    // This points to the 'notes' collection and the 'main_note' document inside it.
    const noteRef = db.collection('notes').doc('main_note');


    // --- GET REFERENCES TO OUR HTML ELEMENTS ---
    const noteTextarea = document.getElementById('note-textarea');
    const saveButton = document.getElementById('save-button');
    const copyButton = document.getElementById('copy-button');


    // --- LOAD DATA LOGIC ---
    // This function runs once when the page loads to get the initial note.
    noteRef.get()
        .then((doc) => {
            if (doc.exists) {
                // If the document exists, get the 'content' field and put it in the textarea
                noteTextarea.value = doc.data().content;
                console.log("Document data loaded successfully.");
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document! Let's create it on the first save.");
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
            alert("Could not load your note. Please check the console for errors.");
        });


    // --- SAVE BUTTON LOGIC ---
    saveButton.addEventListener('click', () => {
        const textToSave = noteTextarea.value;
        const originalText = saveButton.textContent;

        // Provide immediate feedback that we're saving
        saveButton.textContent = 'Saving...';
        saveButton.disabled = true; // Prevent multiple clicks

        // The .set() method will create the document if it doesn't exist, or overwrite it if it does.
        noteRef.set({
            content: textToSave
        })
            .then(() => {
                console.log("Document successfully written!");
                saveButton.textContent = 'Saved!';

                // Revert button text after 2 seconds
                setTimeout(() => {
                    saveButton.textContent = originalText;
                    saveButton.disabled = false;
                }, 2000);
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
                alert("Failed to save your note. Please check the console for errors.");
                saveButton.textContent = 'Error!';

                // Revert button text after 2 seconds
                setTimeout(() => {
                    saveButton.textContent = originalText;
                    saveButton.disabled = false;
                }, 2000);
            });
    });


    // --- COPY BUTTON LOGIC (This remains the same) ---
    copyButton.addEventListener('click', () => {
        if (!noteTextarea.value) return;

        navigator.clipboard.writeText(noteTextarea.value)
            .then(() => {
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    });

});