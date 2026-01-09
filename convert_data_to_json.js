// Convert data.xlsx -> data.json
// Usage: node convert_data_to_json.js
// Requires: npm install xlsx

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const inputPath = path.join(__dirname, "data.xlsx");
const outputPath = path.join(__dirname, "data.json");

function main() {
    if (!fs.existsSync(inputPath)) {
        console.error("❌ Không tìm thấy data.xlsx");
        process.exit(1);
    }

    const workbook = XLSX.readFile(inputPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const normalized = rows
        .map((r) => ({
            date: String(r.date ?? "").trim(),
            Result: String(r.Result ?? "").trim()
        }))
        .filter((r) => r.Result !== "");

    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2), "utf-8");
    console.log(`✅ Đã tạo data.json (${normalized.length} dòng)`);
}

main();
