// Konkurrent-benchmark: kanaler vi måler Paper Empires op imod (financial-crime /
// corporate-collapse-niche). handle = YouTube @-handle (channels.list?forHandle).
// Ret/tilføj frit — cron'en springer pænt over handles der ikke kan slås op.

export const COMPETITORS = [
  { name: "Coffeezilla", handle: "@Coffeezilla" },
  { name: "Jake Tran", handle: "@JakeTran" },
  { name: "Patrick Boyle", handle: "@PatrickBoyleOnFinance" },
  { name: "MagnatesMedia", handle: "@MagnatesMedia" },
  { name: "ColdFusion", handle: "@ColdFusion" },
];

// Sentinel-handle for vores egen kanal (så den kan ligge i samme tabel og
// fremhæves i benchmark-visningen).
export const SELF_HANDLE = "__self__";
