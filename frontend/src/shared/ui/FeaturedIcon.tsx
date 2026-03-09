export function FeaturedIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
    <svg
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"

      {...props}
    >
      <g opacity="0.1">
        <path
          d="M19 1C28.9411 1 37 9.05887 37 19C37 28.9411 28.9411 37 19 37C9.05887 37 1 28.9411 1 19C1 9.05887 9.05887 1 19 1Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>
      <g opacity="0.3">
        <path
          d="M19 6C26.1797 6 32 11.8203 32 19C32 26.1797 26.1797 32 19 32C11.8203 32 6 26.1797 6 19C6 11.8203 11.8203 6 19 6Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>
      <path
        d="M19 15.6667V19M19 22.3334H19.0083M27.3333 19C27.3333 23.6024 23.6023 27.3334 19 27.3334C14.3976 27.3334 10.6666 23.6024 10.6666 19C10.6666 14.3976 14.3976 10.6667 19 10.6667C23.6023 10.6667 27.3333 14.3976 27.3333 19Z"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


