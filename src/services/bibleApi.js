import { getData, saveData } from "../utils/storage";
import { localDateStr } from "../utils/date";

const API_KEY = import.meta.env.VITE_API_BIBLE_KEY;
const NIV_BIBLE_ID = "78a9f6124f344018-01";
const BASE_URL = "https://api.scripture.api.bible/v1/bibles";

// 365 curated verses — one unique verse per day of the year before repeating
// Format: [passageId, humanReference]
const VERSE_POOL = [
  ["JHN.3.16",          "John 3:16"],
  ["PSA.23.1",          "Psalm 23:1"],
  ["PRO.3.5-PRO.3.6",   "Proverbs 3:5-6"],
  ["JER.29.11",         "Jeremiah 29:11"],
  ["PHP.4.13",          "Philippians 4:13"],
  ["ROM.8.28",          "Romans 8:28"],
  ["ISA.40.31",         "Isaiah 40:31"],
  ["MAT.6.33",          "Matthew 6:33"],
  ["PSA.46.1",          "Psalm 46:1"],
  ["GAL.5.22-GAL.5.23", "Galatians 5:22-23"],
  ["1CO.13.4-1CO.13.5", "1 Corinthians 13:4-5"],
  ["HEB.11.1",          "Hebrews 11:1"],
  ["JAS.1.2-JAS.1.3",   "James 1:2-3"],
  ["ROM.12.2",          "Romans 12:2"],
  ["PSA.119.105",       "Psalm 119:105"],
  ["MAT.5.16",          "Matthew 5:16"],
  ["2TI.1.7",           "2 Timothy 1:7"],
  ["EPH.2.8-EPH.2.9",   "Ephesians 2:8-9"],
  ["COL.3.23",          "Colossians 3:23"],
  ["PSA.27.1",          "Psalm 27:1"],
  ["ROM.5.3-ROM.5.4",   "Romans 5:3-4"],
  ["1PE.5.7",           "1 Peter 5:7"],
  ["MAT.11.28",         "Matthew 11:28"],
  ["PRO.16.3",          "Proverbs 16:3"],
  ["JOS.1.9",           "Joshua 1:9"],
  ["PHP.4.6-PHP.4.7",   "Philippians 4:6-7"],
  ["2CO.5.17",          "2 Corinthians 5:17"],
  ["ROM.8.1",           "Romans 8:1"],
  ["PSA.37.4",          "Psalm 37:4"],
  ["HEB.12.1",          "Hebrews 12:1"],
  ["LUK.6.38",          "Luke 6:38"],
  ["ISA.41.10",         "Isaiah 41:10"],
  ["1JN.4.19",          "1 John 4:19"],
  ["MAT.22.37-MAT.22.39","Matthew 22:37-39"],
  ["PSA.1.1-PSA.1.2",   "Psalm 1:1-2"],
  ["PRO.4.23",          "Proverbs 4:23"],
  ["JHN.14.6",          "John 14:6"],
  ["PSA.139.14",        "Psalm 139:14"],
  ["PRO.27.17",         "Proverbs 27:17"],
  ["ROM.8.37",          "Romans 8:37"],
  ["MAT.5.9",           "Matthew 5:9"],
  ["1CO.10.13",         "1 Corinthians 10:13"],
  ["EPH.4.32",          "Ephesians 4:32"],
  ["PSA.34.18",         "Psalm 34:18"],
  ["JHN.16.33",         "John 16:33"],
  ["PRO.22.6",          "Proverbs 22:6"],
  ["2CH.7.14",          "2 Chronicles 7:14"],
  ["ISA.43.2",          "Isaiah 43:2"],
  ["MAT.6.14",          "Matthew 6:14"],
  ["ROM.6.23",          "Romans 6:23"],
  ["PHP.1.6",           "Philippians 1:6"],
  ["PSA.46.10",         "Psalm 46:10"],
  ["HEB.4.16",          "Hebrews 4:16"],
  ["JHN.15.13",         "John 15:13"],
  ["PRO.11.14",         "Proverbs 11:14"],
  ["1TH.5.16-1TH.5.18", "1 Thessalonians 5:16-18"],
  ["GAL.6.9",           "Galatians 6:9"],
  ["COL.3.2",           "Colossians 3:2"],
  ["PSA.32.8",          "Psalm 32:8"],
  ["MAT.5.14",          "Matthew 5:14"],
  ["2TI.3.16-2TI.3.17", "2 Timothy 3:16-17"],
  ["ROM.15.13",         "Romans 15:13"],
  ["JHN.10.10",         "John 10:10"],
  ["PRO.18.24",         "Proverbs 18:24"],
  ["PSA.91.1-PSA.91.2", "Psalm 91:1-2"],
  ["ISA.26.3",          "Isaiah 26:3"],
  ["EPH.6.10",          "Ephesians 6:10"],
  ["1JN.1.9",           "1 John 1:9"],
  ["MAT.6.34",          "Matthew 6:34"],
  ["HEB.13.8",          "Hebrews 13:8"],
  ["PRO.3.9-PRO.3.10",  "Proverbs 3:9-10"],
  ["ROM.12.12",         "Romans 12:12"],
  ["JHN.8.32",          "John 8:32"],
  ["PSA.121.1-PSA.121.2","Psalm 121:1-2"],
  ["MIC.6.8",           "Micah 6:8"],
  ["ISA.55.8-ISA.55.9", "Isaiah 55:8-9"],
  ["MAT.7.7",           "Matthew 7:7"],
  ["2CO.12.9",          "2 Corinthians 12:9"],
  ["GAL.2.20",          "Galatians 2:20"],
  ["PRO.16.9",          "Proverbs 16:9"],
  ["PSA.51.10",         "Psalm 51:10"],
  ["ROM.8.38-ROM.8.39", "Romans 8:38-39"],
  ["1PE.4.8",           "1 Peter 4:8"],
  ["JHN.11.25",         "John 11:25"],
  ["EPH.3.20",          "Ephesians 3:20"],
  ["PHP.2.3-PHP.2.4",   "Philippians 2:3-4"],
  ["ISA.40.28-ISA.40.29","Isaiah 40:28-29"],
  ["MAT.5.6",           "Matthew 5:6"],
  ["HEB.10.24-HEB.10.25","Hebrews 10:24-25"],
  ["COL.1.17",          "Colossians 1:17"],
  ["PRO.31.25",         "Proverbs 31:25"],
  ["PSA.73.26",         "Psalm 73:26"],
  ["ROM.1.16",          "Romans 1:16"],
  ["2CO.4.16-2CO.4.17", "2 Corinthians 4:16-17"],
  ["JAS.1.5",           "James 1:5"],
  ["1CO.15.58",         "1 Corinthians 15:58"],
  ["JHN.4.24",          "John 4:24"],
  ["EPH.5.15-EPH.5.16", "Ephesians 5:15-16"],
  ["PRO.14.12",         "Proverbs 14:12"],
  ["PSA.18.2",          "Psalm 18:2"],
  ["ISA.58.11",         "Isaiah 58:11"],
  ["MAT.5.3",           "Matthew 5:3"],
  ["ROM.12.1",          "Romans 12:1"],
  ["1PE.3.15",          "1 Peter 3:15"],
  ["HEB.6.19",          "Hebrews 6:19"],
  ["GAL.5.1",           "Galatians 5:1"],
  ["JHN.6.35",          "John 6:35"],
  ["PRO.17.22",         "Proverbs 17:22"],
  ["PSA.103.1-PSA.103.2","Psalm 103:1-2"],
  ["COL.2.6-COL.2.7",   "Colossians 2:6-7"],
  ["2TI.2.15",          "2 Timothy 2:15"],
  ["ROM.10.17",         "Romans 10:17"],
  ["JHN.15.5",          "John 15:5"],
  ["EPH.1.7",           "Ephesians 1:7"],
  ["ISA.40.4",          "Isaiah 40:4"],
  ["MAT.5.4",           "Matthew 5:4"],
  ["1CO.12.27",         "1 Corinthians 12:27"],
  ["PRO.13.20",         "Proverbs 13:20"],
  ["PSA.42.1-PSA.42.2", "Psalm 42:1-2"],
  ["HEB.11.6",          "Hebrews 11:6"],
  ["GAL.3.28",          "Galatians 3:28"],
  ["ROM.5.8",           "Romans 5:8"],
  ["JHN.13.34",         "John 13:34"],
  ["PHP.3.14",          "Philippians 3:14"],
  ["2CO.9.7",           "2 Corinthians 9:7"],
  ["PRO.10.12",         "Proverbs 10:12"],
  ["PSA.55.22",         "Psalm 55:22"],
  ["ISA.43.18-ISA.43.19","Isaiah 43:18-19"],
  ["MAT.6.9",           "Matthew 6:9"],
  ["EPH.4.29",          "Ephesians 4:29"],
  ["1JN.3.18",          "1 John 3:18"],
  ["COL.4.6",           "Colossians 4:6"],
  ["HEB.12.2",          "Hebrews 12:2"],
  ["JHN.1.14",          "John 1:14"],
  ["ROM.12.10",         "Romans 12:10"],
  ["PRO.25.11",         "Proverbs 25:11"],
  ["PSA.16.11",         "Psalm 16:11"],
  ["GAL.6.2",           "Galatians 6:2"],
  ["2TI.4.7",           "2 Timothy 4:7"],
  ["MAT.5.7",           "Matthew 5:7"],
  ["1PE.2.9",           "1 Peter 2:9"],
  ["ISA.61.1",          "Isaiah 61:1"],
  ["ROM.8.6",           "Romans 8:6"],
  ["JHN.14.27",         "John 14:27"],
  ["EPH.2.10",          "Ephesians 2:10"],
  ["PHP.4.11",          "Philippians 4:11"],
  ["PRO.19.21",         "Proverbs 19:21"],
  ["PSA.100.4-PSA.100.5","Psalm 100:4-5"],
  ["1CO.6.19-1CO.6.20", "1 Corinthians 6:19-20"],
  ["HEB.4.12",          "Hebrews 4:12"],
  ["JAS.2.17",          "James 2:17"],
  ["2CO.1.3-2CO.1.4",   "2 Corinthians 1:3-4"],
  ["MAT.11.29",         "Matthew 11:29"],
  ["ROM.8.14",          "Romans 8:14"],
  ["COL.3.12",          "Colossians 3:12"],
  ["PSA.145.18",        "Psalm 145:18"],
  ["PRO.3.27",          "Proverbs 3:27"],
  ["GAL.6.7",           "Galatians 6:7"],
  ["JHN.14.1",          "John 14:1"],
  ["ISA.40.1",          "Isaiah 40:1"],
  ["EPH.6.4",           "Ephesians 6:4"],
  ["1TI.4.12",          "1 Timothy 4:12"],
  ["ROM.12.19",         "Romans 12:19"],
  ["HEB.3.13",          "Hebrews 3:13"],
  ["PSA.25.4-PSA.25.5", "Psalm 25:4-5"],
  ["PRO.28.13",         "Proverbs 28:13"],
  ["MAT.7.12",          "Matthew 7:12"],
  ["1JN.4.7",           "1 John 4:7"],
  ["PHP.4.8",           "Philippians 4:8"],
  ["2CO.5.7",           "2 Corinthians 5:7"],
  ["JHN.15.16",         "John 15:16"],
  ["ROM.12.15",         "Romans 12:15"],
  ["COL.3.16",          "Colossians 3:16"],
  ["PSA.30.5",          "Psalm 30:5"],
  ["GAL.5.13",          "Galatians 5:13"],
  ["ISA.53.5",          "Isaiah 53:5"],
  ["MAT.6.20",          "Matthew 6:20"],
  ["EPH.4.26",          "Ephesians 4:26"],
  ["PRO.20.7",          "Proverbs 20:7"],
  ["HEB.13.5",          "Hebrews 13:5"],
  ["1PE.5.6",           "1 Peter 5:6"],
  ["ROM.12.3",          "Romans 12:3"],
  ["JHN.3.30",          "John 3:30"],
  ["PSA.37.7",          "Psalm 37:7"],
  ["2TI.1.12",          "2 Timothy 1:12"],
  ["PRO.3.7-PRO.3.8",   "Proverbs 3:7-8"],
  ["MAT.5.8",           "Matthew 5:8"],
  ["1CO.13.13",         "1 Corinthians 13:13"],
  ["EPH.5.25",          "Ephesians 5:25"],
  ["COL.3.20",          "Colossians 3:20"],
  ["ROM.14.8",          "Romans 14:8"],
  ["JHN.15.9",          "John 15:9"],
  ["PSA.119.11",        "Psalm 119:11"],
  ["ISA.40.30-ISA.40.31","Isaiah 40:30-31"],
  ["PRO.23.7",          "Proverbs 23:7"],
  ["HEB.11.3",          "Hebrews 11:3"],
  ["JAS.4.7",           "James 4:7"],
  ["MAT.5.5",           "Matthew 5:5"],
  ["1JN.5.4",           "1 John 5:4"],
  ["GAL.5.16",          "Galatians 5:16"],
  ["2CO.3.17",          "2 Corinthians 3:17"],
  ["PHP.3.8",           "Philippians 3:8"],
  ["PSA.31.24",         "Psalm 31:24"],
  ["ROM.13.8",          "Romans 13:8"],
  ["JHN.17.17",         "John 17:17"],
  ["EPH.3.16-EPH.3.17", "Ephesians 3:16-17"],
  ["PRO.12.18",         "Proverbs 12:18"],
  ["COL.1.11",          "Colossians 1:11"],
  ["1PE.1.13",          "1 Peter 1:13"],
  ["ISA.30.21",         "Isaiah 30:21"],
  ["MAT.18.20",         "Matthew 18:20"],
  ["HEB.12.11",         "Hebrews 12:11"],
  ["1CO.9.24",          "1 Corinthians 9:24"],
  ["ROM.8.26",          "Romans 8:26"],
  ["PSA.37.23-PSA.37.24","Psalm 37:23-24"],
  ["JHN.8.12",          "John 8:12"],
  ["PRO.15.1",          "Proverbs 15:1"],
  ["GAL.4.7",           "Galatians 4:7"],
  ["EPH.6.13",          "Ephesians 6:13"],
  ["2TI.3.12",          "2 Timothy 3:12"],
  ["MAT.7.1",           "Matthew 7:1"],
  ["ROM.12.20",         "Romans 12:20"],
  ["COL.3.17",          "Colossians 3:17"],
  ["PSA.23.4",          "Psalm 23:4"],
  ["HEB.9.22",          "Hebrews 9:22"],
  ["JAS.3.17",          "James 3:17"],
  ["JHN.15.7",          "John 15:7"],
  ["1JN.2.15",          "1 John 2:15"],
  ["ISA.43.1",          "Isaiah 43:1"],
  ["PRO.21.3",          "Proverbs 21:3"],
  ["PHP.2.13",          "Philippians 2:13"],
  ["ROM.11.36",         "Romans 11:36"],
  ["MAT.6.6",           "Matthew 6:6"],
  ["EPH.4.2",           "Ephesians 4:2"],
  ["1PE.1.7",           "1 Peter 1:7"],
  ["PSA.62.1-PSA.62.2", "Psalm 62:1-2"],
  ["2CO.10.5",          "2 Corinthians 10:5"],
  ["COL.1.13",          "Colossians 1:13"],
  ["GAL.6.1",           "Galatians 6:1"],
  ["HEB.11.7",          "Hebrews 11:7"],
  ["ROM.8.5",           "Romans 8:5"],
  ["JHN.6.47",          "John 6:47"],
  ["PRO.29.11",         "Proverbs 29:11"],
  ["PSA.40.1-PSA.40.2", "Psalm 40:1-2"],
  ["MAT.5.10",          "Matthew 5:10"],
  ["EPH.2.14",          "Ephesians 2:14"],
  ["1TH.4.11",          "1 Thessalonians 4:11"],
  ["2TI.2.22",          "2 Timothy 2:22"],
  ["ISA.48.17",         "Isaiah 48:17"],
  ["ROM.7.18",          "Romans 7:18"],
  ["1CO.16.14",         "1 Corinthians 16:14"],
  ["COL.4.2",           "Colossians 4:2"],
  ["JHN.14.15",         "John 14:15"],
  ["PHP.3.10",          "Philippians 3:10"],
  ["PSA.68.19",         "Psalm 68:19"],
  ["PRO.16.24",         "Proverbs 16:24"],
  ["HEB.10.23",         "Hebrews 10:23"],
  ["JAS.1.17",          "James 1:17"],
  ["GAL.5.25",          "Galatians 5:25"],
  ["ROM.12.21",         "Romans 12:21"],
  ["MAT.7.24",          "Matthew 7:24"],
  ["1PE.4.10",          "1 Peter 4:10"],
  ["ISA.40.8",          "Isaiah 40:8"],
  ["EPH.1.4",           "Ephesians 1:4"],
  ["PSA.86.5",          "Psalm 86:5"],
  ["JHN.15.11",         "John 15:11"],
  ["PRO.24.16",         "Proverbs 24:16"],
  ["2CO.8.9",           "2 Corinthians 8:9"],
  ["ROM.8.31",          "Romans 8:31"],
  ["COL.2.10",          "Colossians 2:10"],
  ["HEB.12.14",         "Hebrews 12:14"],
  ["MAT.5.44",          "Matthew 5:44"],
  ["1CO.13.7",          "1 Corinthians 13:7"],
  ["PHP.2.14-PHP.2.15", "Philippians 2:14-15"],
  ["PSA.107.1",         "Psalm 107:1"],
  ["GAL.6.10",          "Galatians 6:10"],
  ["JHN.14.23",         "John 14:23"],
  ["EPH.6.18",          "Ephesians 6:18"],
  ["PRO.3.11-PRO.3.12", "Proverbs 3:11-12"],
  ["ISA.54.10",         "Isaiah 54:10"],
  ["ROM.12.16",         "Romans 12:16"],
  ["1PE.5.10",          "1 Peter 5:10"],
  ["HEB.11.8",          "Hebrews 11:8"],
  ["2TI.4.2",           "2 Timothy 4:2"],
  ["PSA.19.14",         "Psalm 19:14"],
  ["MAT.22.29",         "Matthew 22:29"],
  ["1JN.4.4",           "1 John 4:4"],
  ["COL.3.23-COL.3.24", "Colossians 3:23-24"],
  ["JHN.3.17",          "John 3:17"],
  ["ROM.8.15",          "Romans 8:15"],
  ["PRO.14.29",         "Proverbs 14:29"],
  ["GAL.5.22",          "Galatians 5:22"],
  ["EPH.4.15",          "Ephesians 4:15"],
  ["PSA.27.14",         "Psalm 27:14"],
  ["ISA.43.4",          "Isaiah 43:4"],
  ["MAT.5.13",          "Matthew 5:13"],
  ["1CO.13.11",         "1 Corinthians 13:11"],
  ["HEB.13.1",          "Hebrews 13:1"],
  ["PHP.4.9",           "Philippians 4:9"],
  ["ROM.12.9",          "Romans 12:9"],
  ["JHN.15.4",          "John 15:4"],
  ["PRO.16.18",         "Proverbs 16:18"],
  ["2CO.6.2",           "2 Corinthians 6:2"],
  ["COL.1.28-COL.1.29", "Colossians 1:28-29"],
  ["PSA.119.9",         "Psalm 119:9"],
  ["JAS.5.16",          "James 5:16"],
  ["GAL.3.26",          "Galatians 3:26"],
  ["MAT.6.24",          "Matthew 6:24"],
  ["1PE.2.24",          "1 Peter 2:24"],
  ["EPH.5.1-EPH.5.2",   "Ephesians 5:1-2"],
  ["ROM.13.14",         "Romans 13:14"],
  ["PRO.11.25",         "Proverbs 11:25"],
  ["HEB.11.27",         "Hebrews 11:27"],
  ["PSA.24.3-PSA.24.4", "Psalm 24:3-4"],
  ["JHN.12.46",         "John 12:46"],
  ["ISA.40.3",          "Isaiah 40:3"],
  ["1TI.6.6",           "1 Timothy 6:6"],
  ["2TI.1.9",           "2 Timothy 1:9"],
  ["PHP.1.21",          "Philippians 1:21"],
  ["ROM.12.6",          "Romans 12:6"],
  ["COL.3.1",           "Colossians 3:1"],
  ["MAT.5.16-MAT.5.17", "Matthew 5:16-17"],
  ["PSA.143.10",        "Psalm 143:10"],
  ["EPH.3.12",          "Ephesians 3:12"],
  ["GAL.5.6",           "Galatians 5:6"],
  ["PRO.16.32",         "Proverbs 16:32"],
  ["HEB.4.9-HEB.4.10",  "Hebrews 4:9-10"],
  ["JHN.14.21",         "John 14:21"],
  ["1JN.3.16",          "1 John 3:16"],
  ["ROM.12.4-ROM.12.5", "Romans 12:4-5"],
  ["ISA.45.22",         "Isaiah 45:22"],
  ["MAT.9.29",          "Matthew 9:29"],
  ["2CO.13.14",         "2 Corinthians 13:14"],
  ["PHP.4.19",          "Philippians 4:19"],
  ["PSA.84.11",         "Psalm 84:11"],
  ["PRO.18.10",         "Proverbs 18:10"],
  ["COL.3.8",           "Colossians 3:8"],
  ["EPH.6.1",           "Ephesians 6:1"],
  ["ROM.8.11",          "Romans 8:11"],
  ["JAS.4.8",           "James 4:8"],
  ["HEB.12.28",         "Hebrews 12:28"],
  ["MAT.7.14",          "Matthew 7:14"],
  ["1PE.1.3",           "1 Peter 1:3"],
  ["GAL.1.10",          "Galatians 1:10"],
  ["JHN.17.3",          "John 17:3"],
  ["ISA.41.13",         "Isaiah 41:13"],
  ["PSA.150.6",         "Psalm 150:6"],
  ["PRO.3.13-PRO.3.14", "Proverbs 3:13-14"],
  ["2TI.2.1",           "2 Timothy 2:1"],
  ["ROM.12.17",         "Romans 12:17"],
  ["EPH.5.8",           "Ephesians 5:8"],
  ["PHP.2.11",          "Philippians 2:11"],
  ["MAT.6.26",          "Matthew 6:26"],
  ["COL.4.17",          "Colossians 4:17"],
  ["HEB.11.1",          "Hebrews 11:1"],
  ["1CO.6.12",          "1 Corinthians 6:12"],
  ["PSA.46.7",          "Psalm 46:7"],
  ["JHN.15.17",         "John 15:17"],
  ["ROM.13.10",         "Romans 13:10"],
  ["GAL.6.14",          "Galatians 6:14"],
  ["PRO.15.22",         "Proverbs 15:22"],
  ["ISA.49.16",         "Isaiah 49:16"],
  ["1PE.3.9",           "1 Peter 3:9"],
  ["EPH.1.18",          "Ephesians 1:18"],
  ["MAT.18.3",          "Matthew 18:3"],
  ["PSA.63.1",          "Psalm 63:1"],
  ["HEB.12.15",         "Hebrews 12:15"],
];

function getDailyIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return dayOfYear % VERSE_POOL.length;
}

function getCacheKey() {
  return `daily_verse_${localDateStr()}`;
}

// Hardcoded fallback pool — used when API.Bible is unavailable.
// Each entry includes the verse plus pre-written insight so the full
// meditation experience works with zero API dependency.
const FALLBACK_POOL = [
  {
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16",
    breakdown: "This is the hinge verse of the entire Bible. God didn't send a rule book or a list of requirements — he sent himself, in the form of a person, because love that deep has to show up. The offer is open to everyone, not earned by anyone.",
    applications: [
      "Think of someone in your life you find it hard to extend grace to. This verse says God loved the whole world — including them, and including the version of you that doesn't have it together.",
      "You might be carrying the weight of feeling like you have to earn your place — at work, in your family, with God. This verse says the gift is already given. What would change if you actually believed that today?",
      "When was the last time love cost you something? Not a feeling, but a real sacrifice. This verse is about action, not sentiment."
    ],
    reflectionPrompts: [
      "What does it mean to you personally that God's love is described as active — he gave — not just a feeling?",
      "Is there an area of your life where you're still trying to earn something that's already been freely given?",
      "Who in your world is hardest to love right now, and what would it look like to see them the way this verse says God sees you?"
    ],
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    breakdown: "This isn't a verse about blind obedience — it's about humility. It acknowledges that our own reasoning has limits, and that surrendering control to something bigger than our own perspective is actually the wiser move. It promises direction, not ease.",
    applications: [
      "You're facing a decision and you keep running the numbers, playing out every scenario. At some point the analysis isn't helping — it's avoiding. This verse is the invitation to let go of the outcome.",
      "There's a situation in your life right now that doesn't make sense. You can't see how it's going to resolve. Leaning on your own understanding means white-knuckling it. What does trust actually look like in that specific situation?",
      "Submission sounds like weakness, but it takes more strength to release control than to hold it. Think of a time you tried to force something to work out your way. How did that go?"
    ],
    reflectionPrompts: [
      "What does 'leaning on your own understanding' look like in your daily life — what do you reach for when things get uncertain?",
      "Is there something you're holding tightly right now that this verse is asking you to loosen your grip on?",
      "What would trusting God 'with all your heart' actually require of you in your current season?"
    ],
  },
  {
    text: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    breakdown: "Paul wrote this from prison, not from a mountaintop victory. The 'all things' isn't about achieving anything you set your mind to — it's about enduring anything, including the hard and mundane, because the strength isn't coming from you.",
    applications: [
      "You're exhausted and you don't know how you're going to keep showing up. That's exactly the context Paul was in. The strength this verse points to isn't a burst of motivation — it's something steadier.",
      "There's a task, relationship, or season in front of you that feels beyond what you have to give. What would it look like to approach it not from your own reserves but from a different source?",
      "We often quote this verse about big goals. But Paul meant it about contentment in scarcity. Where in your life do you need endurance more than achievement right now?"
    ],
    reflectionPrompts: [
      "What are the 'all things' in your life right now that feel impossible — and are they about achievement or about endurance?",
      "Where are you relying entirely on your own strength, and what might it look like to actually ask for help — from God or from someone around you?",
      "Paul learned contentment. What is your current season trying to teach you about contentment?"
    ],
  },
  {
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28",
    breakdown: "This verse doesn't say everything that happens is good — it says God works things toward good. That's a different claim. It requires a longer view than today, and it's meant to be an anchor in suffering, not a dismissal of it.",
    applications: [
      "Something happened that hurt you, and someone tried to comfort you with this verse too soon. The comfort in it is real, but it takes time. Where are you in the process of being able to hold both the pain and the promise?",
      "You can't see how the hard thing you're going through right now could possibly serve anything good. That's okay. This verse is for the view from the other side, and also for the walk through the middle.",
      "Think of something painful from your past that has since shaped you in a way you're grateful for. That's not a guarantee the current pain resolves the same way — but it's evidence worth sitting with."
    ],
    reflectionPrompts: [
      "Is there something in your life right now that you're struggling to believe could work toward any good? What makes it hard to hold onto that hope?",
      "What's the difference between believing this verse is true and actually feeling it? Which is harder for you right now?",
      "Has there been a moment in your past where you've seen this verse come true in your own story? What did that look like?"
    ],
  },
  {
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31",
    breakdown: "Isaiah wrote this to people who were exhausted — exiled, beaten down, wondering if God had forgotten them. The image of eagles isn't about being superhuman. It's about being lifted by something outside yourself when you have nothing left to give.",
    applications: [
      "You've been running hard for a long time and you're not sure you have anything left. The invitation in this verse isn't to try harder — it's to stop trying to manufacture your own strength and wait on something bigger to fill you.",
      "Hoping in the Lord isn't passive resignation. It's an active posture — choosing to orient yourself toward something trustworthy when everything around you feels unstable. What does that look like in your day today?",
      "Notice the order: soar, then run, then walk. Sometimes renewal looks like walking without fainting, not soaring. Where are you in that progression right now?"
    ],
    reflectionPrompts: [
      "What does 'hoping in the Lord' actually mean to you in practice — what does it look like on a Tuesday morning when you're tired?",
      "Are you in a soaring season, a running season, or a walking season right now? What does this verse say to you in that specific place?",
      "What in your life is draining your strength faster than it's being renewed, and what might need to change?"
    ],
  },
  {
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    breakdown: "God said this to Joshua right before he had to lead an entire nation into unknown territory. The command to be courageous isn't a suggestion — it's a choice grounded in a promise. Fear is expected. Courage is the response to fear, not the absence of it.",
    applications: [
      "There's something you know you need to do that you've been putting off because you're afraid of how it will go. The fear isn't the problem — letting it make the decision is.",
      "Joshua didn't know how Jericho's walls were going to fall. He just knew he wasn't going alone. What would you attempt if you actually believed you weren't facing it alone?",
      "Discouragement is quieter than fear — it's the slow erosion of belief that things can change. Where has discouragement crept into your life and started making decisions for you?"
    ],
    reflectionPrompts: [
      "What is the thing you're most afraid of right now, and how is that fear affecting your choices?",
      "What's the difference between being commanded to be courageous and actually feeling courageous? Which one does this verse ask of you?",
      "Where in your life do you need to take a step forward even though you can't see what's on the other side?"
    ],
  },
  {
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reference: "Philippians 4:6",
    breakdown: "Paul doesn't say don't feel anxious — he says don't stay there. The prescription is prayer with thanksgiving, which is an act of remembering that God has shown up before. It's redirecting the energy of worry into honest conversation.",
    applications: [
      "Your mind has been running the same loop of worry for days. The loop isn't solving anything — it's just keeping you stuck. This verse isn't telling you to ignore the problem. It's offering you somewhere to bring it.",
      "Thanksgiving in the middle of anxiety sounds counterintuitive. But it's not about pretending things are fine — it's about choosing to notice what is still true and good, even when something is also hard.",
      "There's a difference between presenting your request and demanding an outcome. What would it look like to honestly tell God what you need today without dictating how it has to be answered?"
    ],
    reflectionPrompts: [
      "What are you most anxious about right now, and have you actually brought it to God in prayer or just thought about it more?",
      "What would you thank God for today, even in the middle of what's hard? What's still true that's worth acknowledging?",
      "What's the difference between prayer and worry disguised as prayer? Which one are you doing?"
    ],
  },
  {
    text: "Therefore, if anyone is in Christ, the new creation has come: the old has gone, the new is here!",
    reference: "2 Corinthians 5:17",
    breakdown: "This isn't about pretending the past didn't happen. It's about a fundamental shift in identity — who you are is no longer defined by who you were. The old patterns, the old shame, the old story — they don't get the final word.",
    applications: [
      "You keep returning to an old version of yourself — the one who messed up, who couldn't change, who always ends up here. This verse says that identity has been replaced. The question is which one you're living out of.",
      "Someone in your life is stuck seeing you as who you were before. And sometimes you see yourself that way too. What would it look like to actually believe you're not that person anymore?",
      "New creation doesn't mean easy. It means different. The trajectory has changed even when the daily struggle still shows up. Where do you see evidence of that in your own life?"
    ],
    reflectionPrompts: [
      "What part of your 'old self' do you find it hardest to let go of — either because you're attached to it or because you don't believe you've actually changed?",
      "Is there someone in your life you're struggling to see as capable of real change? What does this verse say to that?",
      "What does 'new creation' actually look like in your life right now — not in theory, but in your daily choices?"
    ],
  },
  {
    text: "Cast all your anxiety on him because he cares for you.",
    reference: "1 Peter 5:7",
    breakdown: "The word 'cast' is active — it's not gently setting something down, it's throwing it. The premise of this verse is that God is not annoyed by your worry, not tired of your needs. He cares. That's the reason you can throw the weight, not just set it politely aside.",
    applications: [
      "You've been carrying something for so long that you've started to think it's just part of you. What if you actually threw it — not suppressed it, not managed it, but let go of it in an act of trust?",
      "It's easy to pray about the big crises. But the low-grade daily anxiety — the background hum of worry about small things — that's what this verse is talking about too. All of it, not just the dramatic stuff.",
      "Caring implies attentiveness. God isn't fielding your anxiety from a distance. What would it feel like to actually believe he's paying attention to the specific things that are weighing on you today?"
    ],
    reflectionPrompts: [
      "What are you carrying right now that you haven't actually given to God — just thought about giving to God?",
      "Do you actually believe God cares about the everyday, specific things that worry you? What makes that easy or hard to believe?",
      "What would your day look like if you started it by casting the weight instead of picking it up and carrying it alone?"
    ],
  },
  {
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    reference: "Matthew 11:28",
    breakdown: "Jesus said this to people exhausted by religion — by the endless pressure of performing well enough, being good enough, carrying the weight of expectations they could never fully meet. Rest here isn't just sleep. It's the relief of no longer having to earn your place.",
    applications: [
      "You are tired in a way that sleep isn't fixing. It's the kind of tired that comes from striving — from proving yourself, managing how people see you, trying to keep everything together. That's exactly who this invitation is for.",
      "Coming to Jesus isn't a transaction — it's not 'come and fix yourself, then I'll give you rest.' It's come as you are, burdened, and rest will come from the relationship itself.",
      "What are you burdened by today that you've been carrying as if it's entirely your responsibility to resolve? What would it mean to bring it to this invitation rather than keep striving?"
    ],
    reflectionPrompts: [
      "What kind of tired are you right now — physical, emotional, spiritual? What is the burden that's heaviest?",
      "Is there a way you've been trying to earn rest — to get through the to-do list first, to fix the problem first — instead of receiving it as something given?",
      "What would it actually look like, practically and specifically, to come to Jesus with what you're carrying today?"
    ],
  },
  {
    text: "The Lord is my shepherd, I lack nothing.",
    reference: "Psalm 23:1",
    breakdown: "A shepherd's job is to lead, protect, and provide for sheep who have no ability to navigate on their own. David — who was himself a shepherd — knew exactly what this image meant. The claim isn't that life is easy. It's that you are not without a guide and you are not without provision.",
    applications: [
      "You're in a season where you feel like something important is missing — a relationship, security, direction, peace. This verse doesn't deny the feeling. It claims that the deepest need is already met, even when surface needs feel unmet.",
      "Sheep don't know where they're going. They trust the one leading them. Where in your life are you resisting being led because you'd rather figure out the route yourself?",
      "David wrote this psalm knowing darkness, danger, and enemies. 'I lack nothing' wasn't written from a comfortable place. It was written as a choice of trust. What does choosing that posture look like for you today?"
    ],
    reflectionPrompts: [
      "What do you feel like you're lacking right now? How does this verse speak to that specific thing?",
      "What does it mean that the Lord is your shepherd — not just a helper, but a guide responsible for your care?",
      "Where in your life are you trying to be your own shepherd, leading yourself rather than being led?"
    ],
  },
  {
    text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.",
    reference: "Romans 12:2",
    breakdown: "Conforming is passive — it happens slowly, by default, without you deciding. Transformation requires something active: a renewed mind. The way you think shapes the way you live. This verse is about becoming someone different from the inside out, not just behaving differently on the outside.",
    applications: [
      "There are patterns in your life that you've absorbed from the culture around you — about what success looks like, what you deserve, how to treat people who wrong you — that you've never examined against a different standard. This verse is the invitation to examine them.",
      "Behavior change without mind change doesn't last. You can white-knuckle a new habit for a while, but the transformation this verse is talking about goes deeper — it changes what you want, not just what you do.",
      "What is the 'pattern of this world' that has the most pull on you right now? Comfort, approval, achievement, control? What would a renewed mind look like in that specific area?"
    ],
    reflectionPrompts: [
      "What patterns have you absorbed from the culture around you that you've never really questioned?",
      "What's the difference between conforming and transforming in your own experience? Where do you see evidence of each in your life?",
      "What does 'renewing your mind' actually mean to you in practice — what habits of thought or attention would it require?"
    ],
  },
  {
    text: "Your word is a lamp for my feet, a light on my path.",
    reference: "Psalm 119:105",
    breakdown: "A lamp for your feet doesn't illuminate the whole road — it shows you the next step. This is a verse for people who want more certainty than they have. The promise isn't a floodlight that reveals everything at once. It's enough light for where you are right now.",
    applications: [
      "You want to know how the whole thing is going to play out before you take the next step. Most of us do. But a lamp for your feet means you take the step, then the next step is lit. What step is lit for you right now that you've been waiting to take until you can see further?",
      "Someone is navigating a hard decision and they want a clear sign before they move. The sign might not come. But the light for the next faithful step might already be there — in something they've read, a conversation they've had, a quiet conviction they keep dismissing.",
      "There's a difference between guidance and certainty. God offers guidance. We want certainty. This verse is an invitation to walk by the light that's actually given, not wait for a light that may never come."
    ],
    reflectionPrompts: [
      "What is the next step in front of you that you can see, but you're waiting to take until you can see further?",
      "Where in your life do you feel like you're walking in the dark right now? What small light do you have, even if it's not as much as you'd like?",
      "How does Scripture actually function as a lamp in your daily life — or does it? What would change if it did?"
    ],
  },
  {
    text: "For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.",
    reference: "Ephesians 2:8",
    breakdown: "Grace means unearned. The starting point of faith isn't what you bring to God — it's what God brings to you. This verse cuts against every instinct we have to be self-sufficient, to earn our standing, to deserve what we receive. It's a gift. Not a reward.",
    applications: [
      "You've been carrying the weight of feeling like you have to be better before God can really use you, or before you deserve to come to him. This verse says the grace came first — before the better version of you showed up.",
      "Receiving a gift without earning it requires humility. For people who are used to being capable and self-reliant, this is actually one of the harder parts of faith. Where does pride or self-sufficiency make it hard for you to receive?",
      "If salvation is a gift and not a wage, what does that mean for how you relate to other people? If you didn't earn what you have, what does that do to how you view people who are struggling?"
    ],
    reflectionPrompts: [
      "In what areas of your life do you still operate as if you're earning your standing — with God, with others, with yourself?",
      "What does it feel like to receive something you didn't earn and can't repay? Is that easy or uncomfortable for you?",
      "How does the reality of grace change the way you see yourself? How does it change the way you see others?"
    ],
  },
];

function getDailyFallback() {
  return FALLBACK_POOL[getDailyIndex() % FALLBACK_POOL.length];
}

export async function getDailyScripture() {
  const cached = getData(getCacheKey());
  if (cached) return cached;

  if (!API_KEY) {
    const fallback = getDailyFallback();
    saveData(getCacheKey(), fallback);
    return fallback;
  }

  const [passageId, reference] = VERSE_POOL[getDailyIndex()];

  try {
    const params = new URLSearchParams({
      "content-type": "text",
      "include-notes": "false",
      "include-titles": "false",
      "include-chapter-numbers": "false",
      "include-verse-numbers": "false",
      "include-verse-spans": "false",
    });

    const res = await fetch(
      `${BASE_URL}/${NIV_BIBLE_ID}/passages/${passageId}?${params}`,
      { headers: { "api-key": API_KEY } }
    );

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data = await res.json();
    const text = data.data?.content?.trim();
    if (!text) throw new Error("empty content");

    const verse = { text, reference };
    saveData(getCacheKey(), verse);
    return verse;
  } catch (err) {
    console.warn("Bible API unavailable:", err.message);
    const fallback = getDailyFallback();
    saveData(getCacheKey(), fallback);
    return fallback;
  }
}
