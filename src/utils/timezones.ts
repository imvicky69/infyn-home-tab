export interface TimezoneOption {
  label: string
  value: string
}

export const POPULAR_TIMEZONES: TimezoneOption[] = [
  { label: 'Local (Auto-Detect)', value: 'auto' },
  { label: 'UTC / GMT', value: 'UTC' },
  { label: 'New York (EDT/EST)', value: 'America/New_York' },
  { label: 'San Francisco (PDT/PST)', value: 'America/Los_Angeles' },
  { label: 'London (BST/GMT)', value: 'Europe/London' },
  { label: 'Paris / Berlin (CEST/CET)', value: 'Europe/Paris' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'India (IST)', value: 'Asia/Kolkata' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', value: 'Australia/Sydney' },
]
