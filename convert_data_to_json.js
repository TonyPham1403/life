// Convert data.xlsx -> data.json (flat records with date & Result)
// Usage: node convert_data_to_json.js
// Requires: npm install xlsx

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const inputPath = path.join(__dirname, "data.xlsx");
const outputPath = path.join(__dirname, "data.json");

function main() {
    if (!fs.existsSync(inputPath)) {
        console.error("❌ Không tìm thấy data.xlsx cạnh file này.");
        process.exit(1);
    }

    const workbook = XLSX.readFile(inputPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Parse all rows; sheet_to_json will use header row as keys
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // Chuẩn hóa: chỉ giữ cột date & Result nếu tồn tại
    const normalized = rows
        .map((r) => {
            const date = r.date ?? r.Date ?? r.DATE ?? "";
            const Result = r.Result ?? r.RESULT ?? r.result ?? "";
            return { date, Result };
        })
        .filter((r) => r.Result && typeof r.Result === "string");

    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2), "utf-8");
    console.log(`✅ Đã tạo ${outputPath} (${normalized.length} dòng)`);
}

main();
