import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
    databaseUrl: "https://leads-tracker-app-5c75f-default-rtdb.europe-west1.firebasedatabase.app/",
    apiKey: "AIzaSyDvZHrLJjpxBBG9-ozLRQV6v86jz723Qs8",
    authDomain: "leads-tracker-app-5c75f.firebaseapp.com",
    projectId: "leads-tracker-app-5c75f",
    storageBucket: "leads-tracker-app-5c75f.firebasestorage.app",
    messagingSenderId: "796516690768",
    appId: "1:796516690768:web:d3008fb2959fec67311a55"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInDB = ref(database, "leads")

console.log(database);

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const tabBtn = document.getElementById("tab-btn")


tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        for (const tab of tabs) {
            push(referenceInDB, tab.url)
            render(referenceInDB)
        }
    })
})

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

deleteBtn.addEventListener("dblclick", function() {
    remove(referenceInDB)
    ulEl.innerHTML = "";
})

inputBtn.addEventListener("click", function() {
    push(referenceInDB, inputEl.value)
    inputEl.value = ""
})


onValue(referenceInDB, function(snapshot) {
    const snapshotDoesExist = snapshot.exists();
    if (snapshotDoesExist) {
        const snapshotValues = snapshot.val();
        const leads = Object.values(snapshotValues);
        render(leads);
    }
})

