import { NextResponse } from "next/server";

export const revalidate = 300; // cache for 5 minutes

export async function GET() {
  // Try Google Finance scrape-style via public proxy
  try {
    // Yahoo Finance API — Info Edge (India) on NSE: NAUKRI.NS
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/NAUKRI.NS?interval=1d&range=1d",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        next: { revalidate: 300 },
      }
    );

    if (res.ok) {
      const json = await res.json();
      const meta = json?.chart?.result?.[0]?.meta;
      const quote =
        json?.chart?.result?.[0]?.indicators?.quote?.[0];

      if (meta) {
        const price = meta.regularMarketPrice ?? 0;
        const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
        const change = price - prevClose;
        const changePercent = prevClose ? (change / prevClose) * 100 : 0;
        const open = quote?.open?.[0] ?? meta.regularMarketPrice ?? 0;
        const high = quote?.high
          ? Math.max(...quote.high.filter((v: number | null) => v !== null))
          : price;
        const low = quote?.low
          ? Math.min(
              ...quote.low.filter((v: number | null) => v !== null)
            )
          : price;

        return NextResponse.json({
          price,
          change,
          changePercent,
          open,
          high,
          low,
          source: "yahoo",
        });
      }
    }
  } catch {
    // Fall through to BSE fallback
  }

  // Fallback: BSE India API
  try {
    const res = await fetch(
      "https://api.bseindia.com/BseIndiaAPI/api/getScripHeaderData/w?Ession=&scripcode=532777",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Referer: "https://www.bseindia.com",
        },
        next: { revalidate: 300 },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const header = data?.Header;
      if (header) {
        const price = parseFloat(header.LTP?.replace(/,/g, "")) || 0;
        const prevClose =
          parseFloat(header.PrevClose?.replace(/,/g, "")) || price;
        const change = price - prevClose;
        const changePercent = prevClose
          ? (change / prevClose) * 100
          : 0;
        const open =
          parseFloat(header.Open?.replace(/,/g, "")) || price;
        const high =
          parseFloat(header.High?.replace(/,/g, "")) || price;
        const low =
          parseFloat(header.Low?.replace(/,/g, "")) || price;

        return NextResponse.json({
          price,
          change,
          changePercent,
          open,
          high,
          low,
          source: "bse",
        });
      }
    }
  } catch {
    // Return fallback
  }

  // Final fallback — static data
  return NextResponse.json({
    price: 972.85,
    change: 0,
    changePercent: 0,
    open: 991.65,
    high: 995.0,
    low: 968.25,
    source: "fallback",
  });
}
