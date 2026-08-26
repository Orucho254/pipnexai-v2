import { MacroEvent } from '../types';

export const MACRO_EVENTS: MacroEvent[] = [
  {
    id: 'evt-1',
    title: 'Treasury Sec Bessent Speaks',
    country: 'US',
    countryFlag: '🇺🇸',
    impact: 'High',
    category: 'Economic',
    dateStr: '8/24/2026, 6:00:00 PM UTC',
    countdown: '1d 0h 10m',
    analysis: 'High volatility expected on USD crosses and US Treasury yields. Key focus on fiscal bond issuance updates and dollar liquidity stance.'
  },
  {
    id: 'evt-2',
    title: 'CB Consumer Confidence',
    country: 'US',
    countryFlag: '🇺🇸',
    impact: 'Medium',
    category: 'Consumer Confidence',
    dateStr: '8/25/2026, 3:00:00 PM UTC',
    countdown: '1d 20h 10m',
    consensus: '99.3',
    previous: '90.8',
    analysis: 'Consumer sentiment gauge above 99.0 suggests resilient retail spending, bolstering hawkish Federal Reserve expectations.'
  },
  {
    id: 'evt-3',
    title: 'Core PCE Price Index m/m',
    country: 'US',
    countryFlag: '🇺🇸',
    impact: 'High',
    category: 'PCE',
    dateStr: '8/26/2026, 3:00:00 PM UTC',
    countdown: '2d 18h 40m',
    consensus: '0.2%',
    previous: '0.1%',
    analysis: 'Fed primary inflation gauge. An upside surprise above 0.3% would drive aggressive USD appreciation across EUR/USD and GBP/USD.'
  },
  {
    id: 'evt-4',
    title: 'Prelim GDP q/q',
    country: 'US',
    countryFlag: '🇺🇸',
    impact: 'Medium',
    category: 'GDP',
    dateStr: '8/26/2026, 3:00:00 PM UTC',
    countdown: '2d 18h 40m',
    consensus: '2.8%',
    previous: '1.4%',
    analysis: 'Second estimate of quarterly growth. Strong annualized print reinforces US economic outperformance vs European zone.'
  },
  {
    id: 'evt-5',
    title: 'Prelim GDP Price Index q/q',
    country: 'US',
    countryFlag: '🇺🇸',
    impact: 'Medium',
    category: 'GDP',
    dateStr: '8/26/2026, 3:00:00 PM UTC',
    countdown: '2d 18h 40m',
    consensus: '2.3%',
    previous: '2.5%',
    analysis: 'Implicit price deflator indicates easing core input prices if printed below 2.3%.'
  },
  {
    id: 'evt-6',
    title: 'Unemployment Claims',
    country: 'US',
    countryFlag: '🇺🇸',
    impact: 'Medium',
    category: 'Unemployment',
    dateStr: '8/27/2026, 3:00:00 PM UTC',
    countdown: '3d 18h 40m',
    consensus: '208K',
    previous: '200K',
    analysis: 'Weekly initial jobless claims. Figures above 225K would exert modest downward pressure on Greenback.'
  },
  {
    id: 'evt-7',
    title: 'Fed Chairman Walsh Speaks',
    country: 'US',
    countryFlag: '🇺🇸',
    impact: 'High',
    category: 'FOMC',
    dateStr: '8/28/2026, 5:00:00 PM UTC',
    countdown: '4d 20h 10m',
    analysis: 'Crucial forward guidance on September FOMC interest rate trajectory. Expect 60-90 pip swings in Gold and Major pairs.'
  },
  {
    id: 'evt-8',
    title: 'Prelim Benchmark Payrolls Revision',
    country: 'US',
    countryFlag: '🇺🇸',
    impact: 'High',
    category: 'NFP',
    dateStr: '8/28/2026, 5:00:00 PM UTC',
    countdown: '4d 20h 10m',
    analysis: 'Annual Bureau of Labor Statistics benchmark revisions. Substantial historical adjustments could reset macro dollar positioning.'
  },
  {
    id: 'evt-9',
    title: 'Revised UoM Consumer Sentiment',
    country: 'US',
    countryFlag: '🇺🇸',
    impact: 'Medium',
    category: 'Economic',
    dateStr: '8/28/2026, 5:00:00 PM UTC',
    countdown: '4d 20h 10m',
    consensus: '31.0',
    previous: '31.0',
    analysis: 'University of Michigan end-of-month revision for consumer outlook and personal finance confidence.'
  },
  {
    id: 'evt-10',
    title: 'Revised UoM Inflation Expectations',
    country: 'US',
    countryFlag: '🇺🇸',
    impact: 'Medium',
    category: 'Economic',
    dateStr: '8/28/2026, 5:00:00 PM UTC',
    countdown: '4d 20h 10m',
    consensus: '2.9%',
    previous: '3.0%',
    analysis: 'Long-term 5-year inflation expectation metric monitored by Fed policy committee.'
  }
];
