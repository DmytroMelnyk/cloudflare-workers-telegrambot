export interface SpreadsheetValues {
    majorDimension: "DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS";
    range: string;
    values: string[][];
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/sheets
export async function getSpreadsheetValues(
    id: string,
    sheet: string,
    access_token: string
): Promise<Record<string, string>[]> {
    let data: SpreadsheetValues;

    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheet}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }
        );
        data = await response.json();
    } catch (e) {
        console.error("Error fetching spreadsheet data:", e);
        return [];
    }

    const rows: Record<string, string>[] = [];
    const rawRows: string[][] = data.values || [[]];
    const headers: string[] = rawRows.shift() || [];

    for (const row of rawRows) {
        const rowData = row.reduce<Record<string, string>>((acc, cell, index) => {
            acc[headers[index]] = cell;
            return acc;
        }, {});

        rows.push(rowData);
    }

    return rows;
}