Conversion Summary

Source: coloprok_relaunch.sql (30,818 lines, ~8 MB)
Output: data.json (7.82 MB)

Tables Converted:
arzt (doctors): 530 records
geo (geographic data): 8,181 records
geo_work (geographic work data): 8,181 records
praxis (practices/offices): 582 records
zuordnung_plz_ort (postal code mappings): 12,871 records
Total: 30,345 records


Key Features:
✅ Preserved leading zeros in postal codes (e.g., "01127" instead of 1127)
✅ Correct UTF-8 encoding for German umlauts (ü, ö, ä, ß)
✅ Proper data types (numbers, strings, nulls)
✅ Structured JSON with each table as a top-level key containing an array of objects
The data.json file is now ready to use in your application at: