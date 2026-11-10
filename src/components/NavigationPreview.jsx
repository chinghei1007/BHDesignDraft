export const iconPaths = [
  "M3 10 12 3l9 7M5 9v11h14V9M9 20v-7h6v7",
  "M4 4h16v16H4zM8 4v16M11 8h6M11 12h6M11 16h4",
  "M6 3h12v18H6zM9 7h6M9 11h6M9 15h4",
  "M5 5h14v15H5zM8 3v4M16 3v4M5 9h14M8 12h2M13 12h2M8 16h2",
  "M3 6h18v12H3zM3 7l9 7 9-7",
  "M4 4h14a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2zM4 17h16M8 8h8",
  "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M5 21a7 7 0 0 1 14 0",
];
export function NavigationIcon({ index }) {
  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={iconPaths[index % iconPaths.length]} />
    </svg>
  );
}
export function SampleLists({ visible }) {
  return visible ? (
    <section className="sample-lists" aria-label="Sample lists">
      <h4>Unordered list</h4>
      <ul>
        <li>School announcements</li>
        <li>Learning resources</li>
        <li>Community events</li>
      </ul>
      <h4>Ordered list</h4>
      <ol>
        <li>Read the update</li>
        <li>Review the schedule</li>
        <li>Prepare for class</li>
      </ol>
    </section>
  ) : null;
}
