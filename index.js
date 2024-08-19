const fs = require("fs");
const Table = require("cli-table3");
const path = require("path");

// Prendi il path del file dal comando npm run start
const args = process.argv.slice(2);
if (args.length < 1) {
    console.error("Utilizzo: npm run start <week_numbers>");
    console.error("Esempio: npm run start 01 02 03 04");
    process.exit(1);
}
const paths = args;

// Funzione per calcolare la differenza in ore tra due date
function calculateHoursDifference(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const difference = endDate - startDate;
    return difference / (1000 * 60 * 60); // Converti millisecondi in ore
}

// Funzione per analizzare i task
function analyzeTasks(tasks) {
    const typeTasks = {};
    const clientTasks = {};

    tasks.forEach((task) => {
        const taskData = task.split("---");
        if (taskData.length > 1) {
            const lines = taskData[1].split("\n");
            let currentType = "Unknown";
            let currentClient = "Unknown";
            let time = 0;

            lines.forEach((line) => {
                if (line.startsWith("Type:")) {
                    currentType = line.split("Type:")[1].trim().toUpperCase();
                }
                if (line.startsWith("Client:")) {
                    currentClient = line
                        .split("Client:")[1]
                        .trim()
                        .toUpperCase();
                }
                if (line.startsWith("Time:")) {
                    time = parseFloat(line.split("Time:")[1].trim());
                }
            });

            if (time === 0) {
                let start = null;
                let end = null;
                lines.forEach((line) => {
                    if (line.startsWith("Start:")) {
                        start = line.split("Start:")[1].trim();
                    }
                    if (line.startsWith("End:")) {
                        end = line.split("End:")[1].trim();
                    }
                });
                if (start && end) {
                    time = calculateHoursDifference(start, end);
                }
            }

            if (currentType !== "Unknown") {
                if (!typeTasks[currentType]) {
                    typeTasks[currentType] = 0;
                }
                typeTasks[currentType] += time;
            } else if (currentClient !== "Unknown") {
                if (!clientTasks[currentClient]) {
                    clientTasks[currentClient] = 0;
                }
                clientTasks[currentClient] += time;
            }
        }
    });

    return { typeTasks, clientTasks };
}

const hoursColumnsLength = 10;
const typeColumnLength = 20;

// Oggetti globali per le somme totali
const totalTypeTasks = {};
const totalClientTasks = {};
let printSumAsMd = false;

const filePromises = paths.map((filePath) => {
    if (filePath === "print-md") {
        printSumAsMd = true;
        return;
    }

    return new Promise((resolve, reject) => {
        fs.readFile(`./weeks/week_${filePath}.md`, "utf8", (err, data) => {
            if (err) {
                console.error("Errore nella lettura del file:", err);
                reject(err);
                return;
            }

            const doneSection = data.split("## Done")[1].trim();
            const tasks = doneSection.split("### ");

            const { typeTasks, clientTasks } = analyzeTasks(tasks);

            // Aggiorna le somme totali
            for (const [key, hours] of Object.entries(typeTasks)) {
                if (!totalTypeTasks[key]) {
                    totalTypeTasks[key] = 0;
                }
                totalTypeTasks[key] += hours;
            }

            for (const [key, hours] of Object.entries(clientTasks)) {
                if (!totalClientTasks[key]) {
                    totalClientTasks[key] = 0;
                }
                totalClientTasks[key] += hours;
            }

            // Creare la tabella per i gruppi di tipo Type
            const typeTable = new Table({
                head: ["Tipo", "Ore"],
                colWidths: [typeColumnLength, hoursColumnsLength],
                colAligns: ["left", "center"],
            });

            let oreTotali = 0;
            for (const [key, hours] of Object.entries(typeTasks)) {
                typeTable.push([key, hours.toFixed(2)]);
                oreTotali += hours;
            }

            for (const [key, hours] of Object.entries(clientTasks)) {
                typeTable.push([key, hours.toFixed(2)]);
                oreTotali += hours;
            }

            const fileName = path.basename(filePath, path.extname(filePath));
            console.log(`Analisi week ${fileName}`.toUpperCase());
            console.log(typeTable.toString());
            console.log(`Ore totali: ${oreTotali.toFixed(2)}`);
            console.log("");

            resolve();
        });
    });
});

// Funzione per stampare le tabelle cumulative alla fine
function printCumulativeTables() {
    // Creare la tabella cumulativa per i gruppi di tipo Type
    const cumulativeTypeTable = new Table({
        head: ["Tipo", "Ore"],
        colWidths: [typeColumnLength, hoursColumnsLength],
        colAligns: ["left", "center"],
    });
    let weeks = paths;
    if (paths.indexOf("print-md") > -1) {
        weeks.splice(paths.indexOf("print-md"), 1);
    }

    let mdResult = `# Analisi Settimane ${weeks.join(", ")}\n\n`;
    let oreTotali = 0;

    for (const [key, hours] of Object.entries(totalTypeTasks)) {
        cumulativeTypeTable.push([key, hours.toFixed(2)]);
        oreTotali += hours;
        mdResult += `* ${key}: ${hours.toFixed(2)} ore\n`;
    }

    for (const [key, hours] of Object.entries(totalClientTasks)) {
        cumulativeTypeTable.push([key, hours.toFixed(2)]);
        oreTotali += hours;
        mdResult += `* ${key}: ${hours.toFixed(2)} ore\n`;
    }

    mdResult += `\nOre totali: ${oreTotali.toFixed(2)} ore\n`;

    console.log("");
    console.log(`ANALISI WEEKS ${weeks.join(", ")}`.toUpperCase());
    console.log(cumulativeTypeTable.toString());
    console.log(`Ore totali: ${oreTotali.toFixed(2)}`);
    console.log("");
    if (printSumAsMd) {
        console.log(mdResult);
    }
}

if (paths.length > 1) {
    // Attendere che tutti i file siano stati letti prima di stampare le tabelle cumulative
    Promise.all(filePromises)
        .then(printCumulativeTables)
        .catch((err) => {
            console.error("Errore durante l'analisi dei file:", err);
        });
}
