// ============================================================
// HABIT TRACKER - MAIN JAVASCRIPT
// ============================================================


// ============================================================
// 1. HTML ELEMENTS
// ============================================================

const addHabitButton = document.getElementById("addHabit");
const habitModal = document.getElementById("habitModal");
const closeModal = document.getElementById("closeModal");
const saveHabit = document.getElementById("saveHabit");
const habitInput = document.getElementById("habitInput");


// History
const historyButton = document.getElementById("historyButton");

// Get today's day index
// Monday = 0, Tuesday = 1, ... Sunday = 6
const today = new Date();
const todayIndex = (today.getDay() + 6) % 7;

function updateMobileCurrentDay() {
    const dayHeaders = document.querySelectorAll(".day");
    const habitRows = document.querySelectorAll(".habit-row");

    // Remove old current-day class from day headers
    dayHeaders.forEach(day => {
        day.classList.remove("current-day");
    });

    // Remove old current-day class from habit checkboxes
    habitRows.forEach(row => {
        const checks = row.querySelectorAll(".checks label");

        checks.forEach(check => {
            check.classList.remove("current-day");
        });
    });

    // Mark today's day header
    if (dayHeaders[todayIndex]) {
        dayHeaders[todayIndex].classList.add("current-day");
    }

    // Mark today's checkbox in every habit
    habitRows.forEach(row => {
        const checks = row.querySelectorAll(".checks label");

        if (checks[todayIndex]) {
            checks[todayIndex].classList.add("current-day");
        }
    });
}


const historyModal = document.getElementById("historyModal");
const historyClose = document.getElementById("historyClose");
const previousMonth = document.getElementById("previousMonth");
const nextMonth = document.getElementById("nextMonth");
const historyMonth = document.getElementById("historyMonth");
const calendar = document.querySelector(".calendar");
const historyDetails = document.getElementById("historyDetails");


// Statistics
const weeklyProgress = document.getElementById("weeklyProgress");
const overallProgress = document.getElementById("overallProgress");
const bestHabit = document.getElementById("bestHabit");
const worstHabit = document.getElementById("worstHabit");
const weeklyChart = document.getElementById("weeklyChart");

const overviewScore = document.getElementById("overviewScore");
const monthlyChangeEl = document.getElementById("monthlyChange");
const yearlyChangeEl = document.getElementById("yearlyChange");
const totalDays = document.getElementById("totalDays");


// History calendar current month
let historyDate = new Date();
historyDate.setDate(1);



// ============================================================
// 2. DATE HELPER FUNCTIONS
// ============================================================

// Monday = 0
// Tuesday = 1
// Wednesday = 2
// Thursday = 3
// Friday = 4
// Saturday = 5
// Sunday = 6

function getTodayIndex() {

    const day = new Date().getDay();

    return day === 0 ? 6 : day - 1;
}


// Convert Date → YYYY-MM-DD
function getDateKey(date) {

    return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
    );
}

// Daily motivation

function updateDailyMotivation() {

    const motivationElement =
        document.getElementById(
            "dailyMotivation"
        );

    if (!motivationElement) {
        return;
    }

    const motivations = [
        "One step at a time.<br><b>Keep moving.</b>",
        "Consistency beats motivation.<br><b>Show up today.</b>",
        "Small progress is still progress.<br><b>Don't stop.</b>",
        "Focus on what you can do today.<br><b>Tomorrow can wait.</b>",
        "You don't need a perfect day.<br><b>You need a productive one.</b>",
        "Build the habit.<br><b>The results will follow.</b>",
        "Discipline gets you further than motivation.<br><b>Stay consistent.</b>",
        "Do the work today.<br><b>Thank yourself later.</b>",
        "Your future is built by what you do today.<br><b>Make today count.</b>",
        "Progress takes time.<br><b>Keep showing up.</b>"
    ];

    const today =
        new Date();

    const startOfYear =
        new Date(
            today.getFullYear(),
            0,
            0
        );

    const dayOfYear =
        Math.floor(
            (today - startOfYear) /
            (1000 * 60 * 60 * 24)
        );

    const motivationIndex =
        (dayOfYear - 1) %
        motivations.length;

    motivationElement.innerHTML =
        motivations[motivationIndex];
}


// Get date represented by Monday-Sunday column
function getDateForDayIndex(dayIndex) {

    const today = new Date();

    const todayIndex = getTodayIndex();

    const difference = dayIndex - todayIndex;

    const selectedDate = new Date(today);

    selectedDate.setDate(
        today.getDate() + difference
    );

    return selectedDate;
}


// Get Monday of current week
function getWeekStartDate() {

    const today = new Date();

    const todayIndex = getTodayIndex();

    const monday = new Date(today);

    monday.setDate(
        today.getDate() - todayIndex
    );

    monday.setHours(0, 0, 0, 0);

    return monday;
}


// Check whether a column is future
function isFutureDayIndex(dayIndex) {

    return dayIndex > getTodayIndex();
}


// Get complete history object
function getHistoryData() {

    try {

        return JSON.parse(
            localStorage.getItem("habitHistory") || "{}"
        );

    } catch (error) {

        console.error(
            "Could not read habit history:",
            error
        );

        return {};
    }
}



// ============================================================
// 3. HISTORY / CALENDAR
// ============================================================

function renderCalendar() {

    // Remove old calendar dates
    // Keep weekday names

    calendar
        .querySelectorAll(
            ".calendar-date, .calendar-empty"
        )
        .forEach((element) => {

            element.remove();

        });


    const year =
        historyDate.getFullYear();

    const month =
        historyDate.getMonth();


    // Month name

    const monthName =
        historyDate.toLocaleString(
            "default",
            {
                month: "long"
            }
        );


    historyMonth.textContent =
        monthName + " " + year;


    // First day of month

    const firstDay =
        new Date(
            year,
            month,
            1
        );


    // Monday = 0

    let firstDayIndex =
        firstDay.getDay();

    firstDayIndex =
        firstDayIndex === 0
            ? 6
            : firstDayIndex - 1;


    // Number of days

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // Empty cells before first day

    for (
        let i = 0;
        i < firstDayIndex;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "calendar-empty";

        calendar.appendChild(empty);
    }


    const history = getHistoryData();

    const todayKey =
        getDateKey(new Date());


    // Create date buttons

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateButton =
            document.createElement("button");


        dateButton.className =
            "calendar-date";


        dateButton.textContent =
            day;


        // Date key

        const dateKey =
            year +
            "-" +
            String(month + 1).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0");


        const record =
            history[dateKey];


        // Today's class

        if (dateKey === todayKey) {

            dateButton.classList.add("today");

        }


        // Completion status

        if (
            record &&
            record.total > 0
        ) {

            if (
                record.done === record.total
            ) {

                dateButton.classList.add(
                    "completed"
                );

            } else if (
                record.done > 0
            ) {

                dateButton.classList.add(
                    "partial"
                );

            } else {

                dateButton.classList.add(
                    "missed"
                );
            }
        }


        // Show details when clicked

        dateButton.addEventListener(
            "click",
            () => {

                showHistoryDetails(dateKey);

            }
        );


        calendar.appendChild(
            dateButton
        );
    }
}



// Format date for history details

function formatHistoryDate(dateKey) {

    const parts =
        dateKey.split("-");

    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]) - 1;

    const day =
        Number(parts[2]);


    const date =
        new Date(
            year,
            month,
            day
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );
}



// Show history details

function showHistoryDetails(dateKey) {

    const history =
        getHistoryData();


    const record =
        history[dateKey];


    // No record

    if (!record) {

        historyDetails.innerHTML = `
            <p>
                No habit data recorded for this day.
            </p>
        `;

        return;
    }


    // Percentage

    let percentage = 0;

    if (record.total > 0) {

        percentage =
            Math.round(
                (record.done / record.total) * 100
            );
    }


    let habitHTML = "";


    // New history format

    if (record.habits) {

        Object.entries(
            record.habits
        ).forEach(
            ([habitName, completed]) => {

                habitHTML += `
                    <div class="history-habit">

                        <span>
                            ${habitName}
                        </span>

                        <span
                            class="${
                                completed
                                    ? "history-complete"
                                    : "history-incomplete"
                            }"
                        >
                            ${
                                completed
                                    ? "✅"
                                    : "❌"
                            }
                        </span>

                    </div>
                `;
            }
        );


    } else {

        // Old history format

        habitHTML = `
            <p class="old-history-message">
                Individual habit details are not
                available for this date.
            </p>
        `;
    }


    historyDetails.innerHTML = `

        <h3>
            ${formatHistoryDate(dateKey)}
        </h3>

        <p>

            <strong>
                ${record.done} / ${record.total}
            </strong>

            habits completed

            &nbsp; (${percentage}%)

        </p>


        <div class="history-progress-bar">

            <div
                class="history-progress-fill"
                style="width: ${percentage}%"
            ></div>

        </div>

        <div class="history-habits">
            ${habitHTML}
        </div>

        ${
            record.note
                ? `
                    <div class="history-note">
                        <strong>📝 Note</strong>
                        <p>${record.note}</p>
                    </div>
                `
                : ""
        }
    `;
    }

// Open history

historyButton.addEventListener(
    "click",
    () => {

        historyModal.style.display = "flex";

        renderCalendar();

    }
);


// Previous month

previousMonth.addEventListener(
    "click",
    () => {

        historyDate.setMonth(
            historyDate.getMonth() - 1
        );

        renderCalendar();

    }
);


// Next month

nextMonth.addEventListener(
    "click",
    () => {

        historyDate.setMonth(
            historyDate.getMonth() + 1
        );

        renderCalendar();

    }
);


// Close history

historyClose.addEventListener(
    "click",
    () => {

        historyModal.style.display = "none";

    }
);


// Click outside history modal

historyModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === historyModal
        ) {

            historyModal.style.display = "none";

        }
    }
);



// ============================================================
// 4. ADD HABIT MODAL
// ============================================================


// Open add habit modal

addHabitButton.addEventListener(
    "click",
    () => {

        habitModal.style.display = "flex";

        habitInput.focus();

    }
);


// Close add habit modal

closeModal.addEventListener(
    "click",
    () => {

        habitModal.style.display = "none";

    }
);



// ============================================================
// 5. SAVE HABIT DATA
// ============================================================

function saveData() {

    const habits = [];


    const habitRows =
        document.querySelectorAll(
            ".habit-row"
        );


    habitRows.forEach(
        (row) => {

            const nameElement =
                row.querySelector(
                    ".habit-title"
                );


            const iconElement =
                row.querySelector(
                    ".habit-icon"
                );


            const name =
                nameElement
                    ? nameElement.textContent.trim()
                    : "";


            const icon =
                iconElement
                    ? iconElement.textContent.trim()
                    : "";


            // Keep checkbox array only as
            // legacy/current-week backup.

            const checked = [];


            const checkboxes =
                row.querySelectorAll(
                    'input[type="checkbox"]'
                );


            checkboxes.forEach(
                (checkbox) => {

                    checked.push(
                        checkbox.checked
                    );

                }
            );


            habits.push({

                name: name,

                icon: icon,

                checked: checked

            });

        }
    );


    const data = {

        habits: habits,

        // Important:
        // This checkbox array belongs ONLY
        // to the current week.

        weekKey:
            getDateKey(
                getWeekStartDate()
            )

    };


    localStorage.setItem(
        "habitTrackerData",
        JSON.stringify(data)
    );
}



// ============================================================
// 6. SAVE HISTORY FOR A SPECIFIC DATE
// ============================================================

function saveHistoryForDay(dayIndex) {

    // Never save future dates

    if (isFutureDayIndex(dayIndex)) {

        return;
    }


    const selectedDate =
        getDateForDayIndex(dayIndex);


    const dateKey =
        getDateKey(selectedDate);


    const history =
        getHistoryData();


    const habitRows =
        document.querySelectorAll(
            ".habit-row"
        );


    const habitStatus = {};


    habitRows.forEach(
        (row) => {

            const habitTitle =
                row.querySelector(
                    ".habit-title"
                );


            const checkboxes =
                row.querySelectorAll(
                    'input[type="checkbox"]'
                );


            const checkbox =
                checkboxes[dayIndex];


            if (
                habitTitle &&
                checkbox
            ) {

                const habitName =
                    habitTitle.textContent.trim();


                habitStatus[habitName] =
                    checkbox.checked;

            }

        }
    );


    const total =
        Object.keys(habitStatus).length;


    const done =
        Object.values(habitStatus)
            .filter(Boolean)
            .length;


const existingRecord = history[dateKey] || {};

const notesInput =
    document.getElementById("notesInput");

const note =
    dateKey === getDateKey(new Date())
        ? (notesInput ? notesInput.value : "")
        : (existingRecord.note || "");

history[dateKey] = {
    habits: habitStatus,
    done: done,
    total: total,
    note: note
};


    localStorage.setItem(
        "habitHistory",
        JSON.stringify(history)
    );
}



// ============================================================
// 7. REMOVE OLD FUTURE RECORDS
// ============================================================

// This removes future records created by the old bug.
// Example:
// If Oct 10 was accidentally ticked on Oct 5,
// that old future record is deleted.

function removeFutureCurrentWeekHistory() {

    const history =
        getHistoryData();


    const todayIndex =
        getTodayIndex();


    let changed = false;


    for (
        let dayIndex = todayIndex + 1;
        dayIndex < 7;
        dayIndex++
    ) {

        const date =
            getDateForDayIndex(dayIndex);


        const dateKey =
            getDateKey(date);


        if (
            history[dateKey]
        ) {

            delete history[dateKey];

            changed = true;
        }
    }


    if (changed) {

        localStorage.setItem(
            "habitHistory",
            JSON.stringify(history)
        );
    }
}



// ============================================================
// 8. LOAD CURRENT WEEK FROM DATE-BASED HISTORY
// ============================================================

function syncCurrentWeekFromHistory(
    legacyData = null
) {

    const history =
        getHistoryData();


    const todayIndex =
        getTodayIndex();


    const currentWeekKey =
        getDateKey(
            getWeekStartDate()
        );


    // Old checkbox array can ONLY be used
    // if it belongs to this exact week.

    const useLegacyWeek =
        legacyData &&
        legacyData.weekKey === currentWeekKey;


    const habitRows =
        document.querySelectorAll(
            ".habit-row"
        );


    habitRows.forEach(
        (row, habitRowIndex) => {

            const habitTitle =
                row.querySelector(
                    ".habit-title"
                );


            const habitName =
                habitTitle
                    ? habitTitle.textContent.trim()
                    : "";


            const checkboxes =
                row.querySelectorAll(
                    'input[type="checkbox"]'
                );


            const savedHabit =
                legacyData &&
                Array.isArray(
                    legacyData.habits
                )
                    ? legacyData.habits[
                        habitRowIndex
                    ]
                    : null;


            checkboxes.forEach(
                (
                    checkbox,
                    dayIndex
                ) => {

                    // Future day

                    if (
                        dayIndex > todayIndex
                    ) {

                        checkbox.checked =
                            false;

                        checkbox.disabled =
                            true;

                        return;
                    }


                    // Past + today

                    checkbox.disabled =
                        false;


                    const date =
                        getDateForDayIndex(
                            dayIndex
                        );


                    const dateKey =
                        getDateKey(date);


                    const record =
                        history[dateKey];


                    // Date-based history is
                    // the MAIN source of truth.

                    if (
                        record &&
                        record.habits &&
                        Object.prototype.hasOwnProperty.call(
                            record.habits,
                            habitName
                        )
                    ) {

                        checkbox.checked =
                            Boolean(
                                record.habits[
                                    habitName
                                ]
                            );

                        return;
                    }


                    // Only use old weekly
                    // checkbox data when:
                    //
                    // 1. It belongs to this week
                    // 2. There is no date-based
                    //    individual history.

                    if (
                        useLegacyWeek &&
                        savedHabit &&
                        Array.isArray(
                            savedHabit.checked
                        ) &&
                        savedHabit.checked[
                            dayIndex
                        ] !== undefined &&
                        !record
                    ) {

                        checkbox.checked =
                            Boolean(
                                savedHabit.checked[
                                    dayIndex
                                ]
                            );

                    } else {

                        checkbox.checked =
                            false;
                    }

                }
            );

        }
    );


    // Apply future-date lock

    applyCurrentWeekRules();
}



// ============================================================
// 9. FUTURE DATE LOCK
// ============================================================

function applyCurrentWeekRules() {

    const todayIndex =
        getTodayIndex();


    const habitRows =
        document.querySelectorAll(
            ".habit-row"
        );


    habitRows.forEach(
        (row) => {

            const checkboxes =
                row.querySelectorAll(
                    'input[type="checkbox"]'
                );


            checkboxes.forEach(
                (
                    checkbox,
                    dayIndex
                ) => {

                    if (
                        dayIndex > todayIndex
                    ) {

                        checkbox.disabled =
                            true;

                        checkbox.checked =
                            false;

                    } else {

                        checkbox.disabled =
                            false;

                    }

                }
            );

        }
    );
}



// ============================================================
// 10. CURRENT STREAK
// ============================================================

function updateStreak() {

    const history =
        getHistoryData();


    let streak = 0;


    const date =
        new Date();


    while (true) {

        const dateKey =
            getDateKey(date);


        const record =
            history[dateKey];


        // A day counts only when
        // ALL habits were completed.

        if (
            record &&
            record.total > 0 &&
            record.done === record.total
        ) {

            streak++;


            date.setDate(
                date.getDate() - 1
            );

        } else {

            break;
        }
    }


    const streakElement =
        document.getElementById(
            "streakCount"
        );


    if (streakElement) {

        streakElement.textContent =
            streak +
            (
                streak === 1
                    ? " day"
                    : " days"
            );
    }
}

// ============================================================
//  ACHIEVEMENTS
// ============================================================

function updateAchievements() {

    const history = getHistoryData();

    const records = Object.values(history);


    // --------------------------------------------------------
    // 1. CURRENT STREAK
    // --------------------------------------------------------

    let currentStreak = 0;

    const today = new Date();


    while (true) {

        const dateKey =
            getDateKey(today);

        const record =
            history[dateKey];


        if (
            record &&
            record.total > 0 &&
            record.done === record.total
        ) {

            currentStreak++;

            today.setDate(
                today.getDate() - 1
            );

        } else {

            break;
        }
    }


    // --------------------------------------------------------
    // 2. PERFECT DAYS
    // --------------------------------------------------------

    let perfectDays = 0;


    records.forEach(
        (record) => {

            if (
                record &&
                record.total > 0 &&
                record.done === record.total
            ) {

                perfectDays++;

            }

        }
    );


    // --------------------------------------------------------
    // 3. HABIT COMPLETION COUNTS
    // --------------------------------------------------------

    const habitCounts = {};


    records.forEach(
        (record) => {

            if (
                !record ||
                !record.habits
            ) {

                return;
            }


            Object.entries(
                record.habits
            ).forEach(
                (
                    [habitName, completed]
                ) => {

                    if (
                        !habitCounts[habitName]
                    ) {

                        habitCounts[habitName] =
                            0;
                    }


                    if (
                        completed
                    ) {

                        habitCounts[
                            habitName
                        ]++;

                    }

                }
            );

        }
    );


    // --------------------------------------------------------
    // 4. HABIT MASTER
    // --------------------------------------------------------

    let habitMasterUnlocked =
        false;


    Object.values(
        habitCounts
    ).forEach(
        (count) => {

            if (
                count >= 30
            ) {

                habitMasterUnlocked =
                    true;
            }

        }
    );


    // --------------------------------------------------------
    // 5. UPDATE BADGES
    // --------------------------------------------------------

    updateAchievement(
        "achievement3Day",
        currentStreak >= 3
    );


    updateAchievement(
        "achievement7Day",
        currentStreak >= 7
    );


    updateAchievement(
        "achievementPerfectDay",
        perfectDays >= 1
    );


    updateAchievement(
        "achievement10Perfect",
        perfectDays >= 10
    );


    updateAchievement(
        "achievement30Habit",
        habitMasterUnlocked
    );


    updateAchievement(
        "achievement30Day",
        currentStreak >= 30
    );
}



// ============================================================
//  UPDATE SINGLE ACHIEVEMENT
// ============================================================

function updateAchievement(
    achievementId,
    unlocked
) {

    const card =
        document.getElementById(
            achievementId
        );


    if (!card) {

        return;
    }


    const status =
        card.querySelector(
            ".achievement-status"
        );


    if (unlocked) {

        card.classList.remove(
            "locked"
        );

        card.classList.add(
            "unlocked"
        );


        if (status) {

            status.textContent =
                "🔓";
        }

    } else {

        card.classList.remove(
            "unlocked"
        );

        card.classList.add(
            "locked"
        );


        if (status) {

            status.textContent =
                "🔒";
        }

    }
}


// ============================================================
// 11. LONGEST STREAK
// ============================================================

function updateLongestStreak() {

    const history =
        getHistoryData();


    const dates =
        Object.keys(history).sort();


    let longest = 0;

    let current = 0;

    let previousDate = null;


    dates.forEach(
        (dateKey) => {

            const record =
                history[dateKey];


            if (
                record &&
                record.total > 0 &&
                record.done === record.total
            ) {

                const currentDate =
                    new Date(
                        dateKey
                    );


                if (previousDate) {

                    const difference =
                        Math.round(
                            (
                                currentDate -
                                previousDate
                            ) /
                            (
                                1000 *
                                60 *
                                60 *
                                24
                            )
                        );


                    if (
                        difference === 1
                    ) {

                        current++;

                    } else {

                        current = 1;
                    }

                } else {

                    current = 1;
                }


                if (
                    current > longest
                ) {

                    longest = current;
                }


                previousDate =
                    currentDate;

            }

        }
    );


    const longestElement =
        document.getElementById(
            "longestStreakCount"
        );


    if (longestElement) {

        longestElement.textContent =
            longest +
            (
                longest === 1
                    ? " day"
                    : " days"
            );
    }
}



// ============================================================
// 12. ADD NEW HABIT
// ============================================================

saveHabit.addEventListener(
    "click",
    () => {

        const habitName =
            habitInput.value.trim();


        if (
            habitName === ""
        ) {

            alert(
                "Please enter a habit name."
            );

            return;
        }


        createHabit(
            habitName,
            ""
        );


        habitInput.value =
            "";


        habitModal.style.display =
            "none";


        // Save habits

        saveData();


        // New habit starts unchecked.

        applyCurrentWeekRules();


        updateProgress();


        // Save today's current state

        saveHistoryForDay(
            getTodayIndex()
        );


        updateStreak();

        updateLongestStreak();

        updateStatistics();

        updateAchievements();

    }
);



// ============================================================
// 13. CREATE HABIT ROW
// ============================================================

function createHabit(
    name,
    icon
) {

    const habitRow =
        document.createElement(
            "div"
        );


    habitRow.className =
        "habit-row";


    habitRow.innerHTML = `

        <div class="habit-name">

            <span class="habit-icon">
                ${icon}
            </span>

            <span class="habit-title">
                ${name}
            </span>

            <div class="habit-actions">

                <button
                    class="edit-habit"
                    title="Edit"
                >
                    ✏️
                </button>

                <button
                    class="delete-habit"
                    title="Delete"
                >
                    🗑️
                </button>

            </div>

        </div>


        <div class="checks">

            <label>
                <input type="checkbox">
                <span></span>
            </label>

            <label>
                <input type="checkbox">
                <span></span>
            </label>

            <label>
                <input type="checkbox">
                <span></span>
            </label>

            <label>
                <input type="checkbox">
                <span></span>
            </label>

            <label>
                <input type="checkbox">
                <span></span>
            </label>

            <label>
                <input type="checkbox">
                <span></span>
            </label>

            <label>
                <input type="checkbox">
                <span></span>
            </label>

        </div>

    `;


    const progressSection =
        document.getElementById(
            "progressSection"
        );


    const trackerCard =
        document.querySelector(
            ".tracker-card"
        );


    trackerCard.insertBefore(
        habitRow,
        progressSection
    );
}



// ============================================================
// 14. LOAD SAVED DATA
// ============================================================

function loadData() {

    const savedData = localStorage.getItem("habitTrackerData");

    let data = null;

    if (savedData) {

        try {

            data = JSON.parse(savedData);

        } catch (error) {

            console.error("Could not load saved data:", error);

        }

    }

    // Remove any old/static habit rows
    document.querySelectorAll(".habit-row").forEach(row => {
        row.remove();
    });

// Load today's note

const notesInput =
    document.getElementById(
        "notesInput"
    );

if (notesInput) {

    const history =
        getHistoryData();

    const todayKey =
        getDateKey(new Date());

    notesInput.value =
        history[todayKey]?.note || "";

}

    // Default habits for a fresh installation
    const defaultHabits = [
        { name: "Drink water", icon: "💧" },
        { name: "Study", icon: "📚" },
        { name: "Exercise", icon: "🏋️" },
        { name: "Read a book", icon: "📖" },
        { name: "Meditate", icon: "🧘" },
        { name: "8+ hrs sleep", icon: "😴" },
        { name: "Be productive", icon: "⚡" }
    ];

    // Load saved habits, otherwise create default habits
    if (data && Array.isArray(data.habits) && data.habits.length > 0) {

        data.habits.forEach(habit => {

            createHabit(
                habit.name || "",
                habit.icon || ""
            );

        });

    } else {

        defaultHabits.forEach(habit => {

            createHabit(
                habit.name,
                habit.icon
            );

        });

    }

    syncCurrentWeekFromHistory(data);

    saveData();

    updateProgress();

}



// ============================================================
// 15. CHECKBOX CHANGE
// ============================================================

document.addEventListener(
    "change",
    (event) => {

        if (
            !event.target.matches(
                '.checks input[type="checkbox"]'
            )
        ) {

            return;
        }


        const checksContainer =
            event.target.closest(
                ".checks"
            );


        if (!checksContainer) {

            return;
        }


        const allCheckboxes =
            Array.from(
                checksContainer.querySelectorAll(
                    'input[type="checkbox"]'
                )
            );


        const dayIndex =
            allCheckboxes.indexOf(
                event.target
            );


        // Extra safety:
        // Future dates cannot be changed.

        if (
            isFutureDayIndex(
                dayIndex
            )
        ) {

            event.target.checked =
                false;

            event.target.disabled =
                true;

            return;
        }


        // Update today's progress

        updateProgress();


        // Save normal app data

        saveData();


        // Save DATE-SPECIFIC history

        saveHistoryForDay(
            dayIndex
        );


        // Update everything

        updateStreak();

        updateLongestStreak();

        updateStatistics();

        updateAchievements();


        // Refresh calendar if history
        // modal is open

        if (
            historyModal.style.display === "flex"
        ) {

            renderCalendar();

        }

    }
);



// ============================================================
// 16. TODAY'S PROGRESS
// ============================================================

function updateProgress() {

    const todayIndex =
        getTodayIndex();


    const habitRows =
        document.querySelectorAll(
            ".habit-row"
        );


    let total = 0;

    let done = 0;


    habitRows.forEach(
        (row) => {

            const checkboxes =
                row.querySelectorAll(
                    'input[type="checkbox"]'
                );


            const todayCheckbox =
                checkboxes[
                    todayIndex
                ];


            if (
                todayCheckbox
            ) {

                total++;


                if (
                    todayCheckbox.checked
                ) {

                    done++;
                }

            }

        }
    );


    let percentage = 0;


    if (
        total > 0
    ) {

        percentage =
            Math.round(
                (done / total) * 100
            );
    }


    const progressText =
        document.getElementById(
            "progressText"
        );


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    const progressDetails =
        document.getElementById(
            "progressDetails"
        );


    if (
        progressText
    ) {

        progressText.textContent =
            percentage + "%";
    }


    if (
        progressFill
    ) {

        progressFill.style.width =
            percentage + "%";
    }


    if (
        progressDetails
    ) {

        progressDetails.textContent =
            done +
            " / " +
            total +
            " completed";
    }
}



// ============================================================
// 17. DELETE / EDIT HABIT
// ============================================================

document.addEventListener(
    "click",
    (event) => {


        // ----------------------------------------------------
        // DELETE
        // ----------------------------------------------------

        if (
            event.target.closest(
                ".delete-habit"
            )
        ) {

            const row =
                event.target.closest(
                    ".habit-row"
                );


            const title =
                row.querySelector(
                    ".habit-title"
                );


            const habitName =
                title
                    ? title.textContent.trim()
                    : "this habit";


            const confirmDelete =
                confirm(
                    `Delete "${habitName}"?`
                );


            if (
                confirmDelete
            ) {

                row.remove();


                saveData();

                updateProgress();


                // Recalculate today's history

                saveHistoryForDay(
                    getTodayIndex()
                );


                updateStreak();

                updateLongestStreak();

                updateStatistics();

                updateAchievements();


                // Re-apply future lock

                applyCurrentWeekRules();

            }
        }



        // ----------------------------------------------------
        // EDIT
        // ----------------------------------------------------

        if (
            event.target.closest(
                ".edit-habit"
            )
        ) {

            const row =
                event.target.closest(
                    ".habit-row"
                );


            const title =
                row.querySelector(
                    ".habit-title"
                );


            if (!title) {

                return;
            }


            const oldName =
                title.textContent.trim();


            const newName =
                prompt(
                    "Enter new habit name:",
                    oldName
                );


            if (
                newName !== null &&
                newName.trim() !== ""
            ) {

                title.textContent =
                    newName.trim();


                saveData();


                // Update today's record
                // with new habit name.

                saveHistoryForDay(
                    getTodayIndex()
                );


                updateStatistics();

                updateAchievements();

            }
        }

    }
);



// ============================================================
// 18. NOTES AUTOSAVE
// ============================================================

const notesInput =
    document.getElementById(
        "notesInput"
    );


if (
    notesInput
) {
    notesInput.addEventListener(
        "input",
        () => {
            saveData();
            saveHistoryForDay(
                getTodayIndex()
            );
        }
    );
}



// ============================================================
// 19. STATISTICS
// ============================================================

function updateStatistics() {

    const history =
        getHistoryData();


    // --------------------------------------------------------
    // OVERALL COMPLETION
    // --------------------------------------------------------

    let totalDone = 0;

    let totalHabits = 0;


    Object.values(history)
        .forEach(
            (record) => {

                if (
                    record &&
                    record.total > 0
                ) {

                    totalDone +=
                        record.done;

                    totalHabits +=
                        record.total;

                }

            }
        );


    let overallPercentage = 0;


    if (
        totalHabits > 0
    ) {

        overallPercentage =
            Math.round(
                (
                    totalDone /
                    totalHabits
                ) * 100
            );
    }
if (
    overallProgress
) {

    overallProgress.textContent =
        overallPercentage + "%";
}

if (
    overviewScore
) {

    overviewScore.textContent =
        overallPercentage + "%";
}

if (monthlyChangeEl) {
    monthlyChangeEl.textContent = overallPercentage + "%";
}

if (yearlyChangeEl) {
    yearlyChangeEl.textContent = overallPercentage + "%";
}

if (totalDays) {
    totalDays.textContent = Object.keys(history).length;
}

// --------------------------------------------------------
// CURRENT MONTH PROGRESS
// --------------------------------------------------------

const monthNow =
    new Date();

const currentMonth =
    monthNow.getMonth();

const currentYear =
    monthNow.getFullYear();


let monthlyDone = 0;

let monthlyTotal = 0;


Object.entries(history)
    .forEach(
        (
            [
                dateKey,
                record
            ]
        ) => {

            if (
                !record ||
                record.total <= 0
            ) {

                return;
            }


            const date =
                new Date(
                    dateKey + "T00:00:00"
                );


            if (
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear &&
                date <= monthNow
            ) {

                monthlyDone +=
                    record.done;

                monthlyTotal +=
                    record.total;
            }

        }
    );


let monthlyPercentage = 0;


if (
    monthlyTotal > 0
) {

    monthlyPercentage =
        Math.round(
            (
                monthlyDone /
                monthlyTotal
            ) * 100
        );
}


if (
    monthlyChange
) {

    monthlyChange.textContent =
        monthlyPercentage + "%";
}


    // --------------------------------------------------------
    // WEEKLY PROGRESS
    // --------------------------------------------------------

    const today =
        new Date();


    const monday =
        new Date(today);


    const day =
        today.getDay();


    const difference =
        day === 0
            ? 6
            : day - 1;


    monday.setDate(
        today.getDate() - difference
    );


    let weeklyDone = 0;

    let weeklyTotal = 0;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(monday);


        date.setDate(
            monday.getDate() + i
        );


        // Do not count future dates

        if (
            date > today
        ) {

            continue;
        }


        const dateKey =
            getDateKey(date);


        const record =
            history[dateKey];


        if (
            record &&
            record.total > 0
        ) {

            weeklyDone +=
                record.done;

            weeklyTotal +=
                record.total;

        }
    }


    let weeklyPercentage = 0;


    if (
        weeklyTotal > 0
    ) {

        weeklyPercentage =
            Math.round(
                (
                    weeklyDone /
                    weeklyTotal
                ) * 100
            );
    }


    if (
        weeklyProgress
    ) {

        weeklyProgress.textContent =
            weeklyPercentage + "%";
    }



    // --------------------------------------------------------
    // BEST / WORST HABIT
    // --------------------------------------------------------

    const habitStats = {};


    Object.values(history)
        .forEach(
            (record) => {

                if (
                    !record ||
                    !record.habits
                ) {

                    return;
                }


                Object.entries(
                    record.habits
                ).forEach(
                    (
                        [
                            habitName,
                            completed
                        ]
                    ) => {

                        if (
                            !habitStats[
                                habitName
                            ]
                        ) {

                            habitStats[
                                habitName
                            ] = {

                                done: 0,

                                total: 0

                            };
                        }


                        habitStats[
                            habitName
                        ].total++;


                        if (
                            completed
                        ) {

                            habitStats[
                                habitName
                            ].done++;
                        }

                    }
                );

            }
        );


    let bestName = "-";

    let worstName = "-";


    let bestPercentage = -1;

    let worstPercentage = 101;


    Object.entries(
        habitStats
    ).forEach(
        (
            [
                habitName,
                stats
            ]
        ) => {

            if (
                stats.total === 0
            ) {

                return;
            }


            const percentage =
                Math.round(
                    (
                        stats.done /
                        stats.total
                    ) * 100
                );


            if (
                percentage >
                bestPercentage
            ) {

                bestPercentage =
                    percentage;

                bestName =
                    habitName;

            }


            if (
                percentage <
                worstPercentage
            ) {

                worstPercentage =
                    percentage;

                worstName =
                    habitName;

            }

        }
    );


    if (
        bestHabit
    ) {

        bestHabit.textContent =
            bestName;
    }


    if (
        worstHabit
    ) {

        worstHabit.textContent =
            worstName;
    }


    // --------------------------------------------------------
    // WEEKLY GRAPH
    // --------------------------------------------------------

    generateWeeklyChart(
        history
    );
}



// ============================================================
// 20. WEEKLY GRAPH
// ============================================================
function generateWeeklyChart(history) {

    if (!weeklyChart) {
        return;
    }

    weeklyChart.innerHTML = "";

    // ========================================================
    // CHART MODE
    // ========================================================

    let chartMode =
        localStorage.getItem("chartMode") || "day";


    // ========================================================
    // CHART HEADER + SELECTOR
    // ========================================================

    const chartHeader =
        document.createElement("div");

    chartHeader.classList.add(
        "chart-header"
    );


    const chartTitle =
        document.createElement("h3");

    chartTitle.textContent =
        "📅 Overall performance";


    const selector =
        document.createElement("select");

    selector.classList.add(
        "chart-mode"
    );

    selector.innerHTML = `
        <option value="day">Day</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
    `;

    selector.value =
        chartMode;


    selector.addEventListener(
        "change",
        () => {

            chartMode =
                selector.value;

            localStorage.setItem(
                "chartMode",
                chartMode
            );

            generateWeeklyChart(
                history
            );

        }
    );


    chartHeader.appendChild(
        chartTitle
    );

    chartHeader.appendChild(
        selector
    );

    weeklyChart.appendChild(
        chartHeader
    );


    // ========================================================
    // GET VALID HISTORY DATES
    // ========================================================

const dates = Object.keys(history)
    .filter(dateKey => {
        const record = history[dateKey];

        return (
            record &&
            record.total > 0 &&
            new Date(dateKey + "T00:00:00") <= new Date()
        );
    })
    .sort()



    // No data
    if (dates.length === 0) {

        weeklyChart.innerHTML += `
            <div class="no-data">
                📊 No performance data yet
            </div>
        `;

        return;
    }


    // ========================================================
    // PREPARE CHART DATA
    // ========================================================

    let chartData = [];


    // ========================================================
    // DAY MODE
    // ========================================================

    if (chartMode === "day") {

      // Use complete history for Day view

     const visibleDates = dates;

        chartData =
            visibleDates.map(
                dateKey => {

                    const record =
                        history[dateKey];

                    const percentage =
                        Math.round(
                            (
                                record.done /
                                record.total
                            ) * 100
                        );


                    const date =
                        new Date(dateKey);


                    return {

                        label:
                          date.getDate(),

                        percentage

                    };

                }
            );
    }


    // ========================================================
    // MONTH MODE
    // ========================================================

    if (chartMode === "month") {

        const months = {};


        dates.forEach(
            dateKey => {

                const date =
                    new Date(dateKey);

                const key =
                    `${date.getFullYear()}-${date.getMonth()}`;


                if (!months[key]) {

                    months[key] = {

                        year:
                            date.getFullYear(),

                        month:
                            date.getMonth(),

                        done: 0,

                        total: 0

                    };

                }


                const record =
                    history[dateKey];


                months[key].done +=
                    record.done;

                months[key].total +=
                    record.total;

            }
        );


        chartData =
            Object.values(months)
                .sort(
                    (a, b) =>
                        a.year - b.year ||
                        a.month - b.month
                )
                .map(month => {

                    const percentage =
                        Math.round(
                            (
                                month.done /
                                month.total
                            ) * 100
                        );


                    const date =
                        new Date(
                            month.year,
                            month.month,
                            1
                        );


                    return {

                        label:
                            date.toLocaleString(
                                "default",
                                {
                                    month: "short"
                                }
                            ) +
                            " " +
                            month.year,

                        percentage

                    };

                });

    }


    // ========================================================
    // YEAR MODE
    // ========================================================

    if (chartMode === "year") {

        const years = {};


        dates.forEach(
            dateKey => {

                const date =
                    new Date(dateKey);

                const year =
                    date.getFullYear();


                if (!years[year]) {

                    years[year] = {

                        done: 0,

                        total: 0

                    };

                }


                const record =
                    history[dateKey];


                years[year].done +=
                    record.done;

                years[year].total +=
                    record.total;

            }
        );


        chartData =
            Object.entries(years)
                .sort(
                    (a, b) =>
                        Number(a[0]) -
                        Number(b[0])
                )
                .map(
                    ([year, data]) => {

                        const percentage =
                            Math.round(
                                (
                                    data.done /
                                    data.total
                                ) * 100
                            );


                        return {

                            label:
                                year,

                            percentage

                        };

                    }
                );

    }


    // ========================================================
    // SVG SIZE
    // ========================================================
let width;

if (chartMode === "day") {
    width =
        window.innerWidth <= 600
            ? Math.max(330, chartData.length * 28)
            : 700;
} else {
    width =
        window.innerWidth <= 600
            ? 330
            : 700;
}

const height = 300;

    const paddingLeft = 10;

    const paddingRight = 20;

    const paddingTop = 25;

    const paddingBottom = 45;


    const graphWidth =
        width -
        paddingLeft -
        paddingRight;

    const graphHeight =
        height -
        paddingTop -
        paddingBottom;


    // ========================================================
    // CALCULATE POINTS
    // ========================================================

    const points =
        chartData.map(
            (item, index) => {

                const x =
                    chartData.length === 1
                        ? paddingLeft +
                          graphWidth / 2
                        : paddingLeft +
                          (
                              index /
                              (
                                  chartData.length - 1
                              )
                          ) *
                          graphWidth;


                const y =
                    paddingTop +
                    graphHeight -
                    (
                        item.percentage /
                        100
                    ) *
                    graphHeight;


                return {

                      x,

                      y,

                      percentage:
                       item.percentage,

                       label:
                        item.label

                };

            }
        );


    // ========================================================
    // CREATE SVG
    // ========================================================

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );


    svg.classList.add(
        "overall-chart-svg"
    );

if (chartMode === "day") {
    svg.style.width = `${width}px`;
    svg.style.maxWidth = "none";
}

    // ========================================================
    // GRID LINES
    // ========================================================

    [0, 25, 50, 75, 100]
        .forEach(
            percentage => {

                const y =
                    paddingTop +
                    graphHeight -
                    (
                        percentage /
                        100
                    ) *
                    graphHeight;


                const line =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "line"
                    );


                line.setAttribute(
                    "x1",
                    paddingLeft
                );

                line.setAttribute(
                    "x2",
                    width -
                    paddingRight
                );

                line.setAttribute(
                    "y1",
                    y
                );

                line.setAttribute(
                    "y2",
                    y
                );


                line.classList.add(
                    "chart-grid-line"
                );


                svg.appendChild(
                    line
                );

            }
        );


    // ========================================================
    // LINE
    // ========================================================

    const pathData =
        points.map(
            (point, index) =>
                `${
                    index === 0
                        ? "M"
                        : "L"
                } ${point.x} ${point.y}`
        ).join(" ");


    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    path.setAttribute(
        "d",
        pathData
    );


    path.classList.add(
        "overall-chart-line"
    );


    svg.appendChild(
        path
    );


    // ========================================================
    // POINTS + LABELS
    // ========================================================

    points.forEach(
        point => {

            // Point

            const circle =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "circle"
                );


            circle.setAttribute(
                "cx",
                point.x
            );

            circle.setAttribute(
                "cy",
                point.y
            );

            circle.setAttribute(
                "r",
                5
            );


            circle.classList.add(
                "overall-chart-point"
            );


            svg.appendChild(
                circle
            );


            // Percentage




            // Date / Month / Year label

            const label =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );


label.setAttribute(
    "x",
    point.x
);

label.setAttribute(
    "y",
    height - 15
);

if (chartData.length > 1 && point === points[0]) {
    label.setAttribute(
        "text-anchor",
        "start"
    );
} else if (
    chartData.length > 1 &&
    point === points[points.length - 1]
) {
    label.setAttribute(
        "text-anchor",
        "end"
    );
} else {
    label.setAttribute(
        "text-anchor",
        "middle"
    );
}

label.textContent = point.label;


            label.classList.add(
                "chart-date-label"
            );

            label.setAttribute(
                "font-size",
                "14"
            );

            label.setAttribute(
               "font-weight",
               "600"
           );

            svg.appendChild(
                label
            );

        }
    );

const chartArea =
    document.createElement("div");

chartArea.classList.add(
    "overall-chart-area"
);


const chartScroll =
    document.createElement("div");

chartScroll.classList.add(
    "overall-chart-scroll"
);

chartScroll.appendChild(svg);

const axis =
    document.createElement("div");

axis.classList.add(
    "overall-chart-axis"
);

axis.innerHTML = `
    <div>100%</div>
    <div>75%</div>
    <div>50%</div>
    <div>25%</div>
    <div>0%</div>
`;

chartArea.appendChild(axis);

chartArea.appendChild(
    chartScroll
);

weeklyChart.appendChild(
    chartArea
);

chartScroll.scrollLeft =
    chartScroll.scrollWidth -
    chartScroll.clientWidth;
}



// ============================================================
// 21. START APPLICATION
// ============================================================


// First remove any future history that was
// accidentally created by the old bug.

removeFutureCurrentWeekHistory();


// Load habits + history

loadData();

updateDailyMotivation();

updateMobileCurrentDay();

// Lock future days

applyCurrentWeekRules();


// Update today's progress

updateProgress();


// Update streaks

updateStreak();

updateLongestStreak();


// Update statistics

updateStatistics();

updateAchievements();


// Save today's state ONLY after
// today's existing history has been loaded.

saveHistoryForDay(
    getTodayIndex()
);


// Refresh everything after today's save

updateStreak();

updateLongestStreak();

updateStatistics();

updateAchievements();


// ============================================================
// END OF SCRIPT
// ============================================================

// =========================
// DARK MODE TOGGLE
// =========================
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

   if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
} else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
}
});

// Remember dark mode
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}

// ============================================================
// EXPORT BACKUP
// ============================================================

function exportBackup() {

    const backup = {
        app: "Habit Tracker",
        version: 1,
        exportedAt: new Date().toISOString(),

        data: {
            habitTrackerData:
                localStorage.getItem("habitTrackerData"),

            habitHistory:
                localStorage.getItem("habitHistory"),

            chartMode:
                localStorage.getItem("chartMode"),

            theme:
                localStorage.getItem("theme")
        }
    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    const date =
        new Date().toISOString().split("T")[0];

    link.download =
        `habit-tracker-backup-${date}.json`;

    link.click();

    URL.revokeObjectURL(url);
}

// =========================
// IMPORT BACKUP
// =========================

const backupFile =
    document.getElementById("backupFile");


backupFile.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {

        try {

            const backup =
                JSON.parse(reader.result);

            // Basic backup validation
            if (
                backup.app !== "Habit Tracker" ||
                backup.version !== 1 ||
                !backup.data
            ) {
                throw new Error("Invalid backup format");
            }

            const data = backup.data;

            // Check required backup data
            if (
                !data.habitTrackerData ||
                !data.habitHistory
            ) {
                throw new Error("Incomplete backup");
            }

            // Make sure stored JSON is valid
            JSON.parse(data.habitTrackerData);
            JSON.parse(data.habitHistory);

            const confirmed = confirm(
                "Import this backup?\n\n" +
                "Your current habit data will be replaced."
            );

            if (!confirmed) {
                backupFile.value = "";
                return;
            }

            // Restore main data
            localStorage.setItem(
                "habitTrackerData",
                data.habitTrackerData
            );

            localStorage.setItem(
                "habitHistory",
                data.habitHistory
            );

            // Restore chart mode
            if (data.chartMode) {
                localStorage.setItem(
                    "chartMode",
                    data.chartMode
                );
            }

            // Restore theme
            if (data.theme) {
                localStorage.setItem(
                    "theme",
                    data.theme
                );
            }

            alert(
                "Backup imported successfully!"
            );

            location.reload();

        } catch (error) {

            console.error(
                "Import failed:",
                error
            );

            alert(
                "Invalid or corrupted backup file."
            );

        }

        backupFile.value = "";
    };

    reader.readAsText(file);
});

// =========================
// HAMBURGER MENU
// =========================

const menuToggle =
    document.getElementById("menuToggle");

// =========================
// MENU PAGE
// =========================

const menuPage =
    document.getElementById("menuPage");

const menuBack =
    document.getElementById("menuBack");


menuToggle.addEventListener("click", () => {

    menuPage.style.display = "block";

});


menuBack.addEventListener("click", () => {

    menuPage.style.display = "none";

});

// =========================
// SETTINGS PAGE CONTROLS
// =========================

const pageThemeSwitch =
    document.getElementById("pageThemeSwitch");

const pageExport =
    document.getElementById("pageExport");

const pageImport =
    document.getElementById("pageImport");

    const pageAbout =
    document.getElementById("pageAbout");

const aboutPage =
    document.getElementById("aboutPage");

    const aboutBack =
    document.getElementById("aboutBack");

    aboutBack.addEventListener("click", () => {

    aboutPage.style.display = "none";
    menuPage.style.display = "block";

});

pageThemeSwitch.addEventListener("click", () => {

    themeToggle.click();

});

pageAbout.addEventListener("click", () => {

    menuPage.style.display = "none";
    aboutPage.style.display = "block";

});

pageExport.addEventListener("click", () => {

    exportBackup();

});


pageImport.addEventListener("click", () => {

    backupFile.click();

});

