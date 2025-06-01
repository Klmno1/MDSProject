export default function HomePage() {
  return (
    <div className="mt-20 px-6 max-w-4xl mx-auto">
      <div className="text-center text-4xl font-extrabold mb-8">
        Welcome to the Product Intelligence Dashboard
      </div>

      <p className="text-lg text-gray-300 mb-6 leading-relaxed text-center">
        This dashboard helps you explore and analyze key metrics related to product sales, returns, and trends across various regions and time periods.
      </p>

      <div className="text-left text-gray-200 text-md leading-loose bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">✨ Key Features:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Product Analysis:</strong> Analyze the return rate, sales in different countries and time period.</li>
          <li><strong>Product Group Analysis:</strong> Understand patterns and trends in grouped product behavior.</li>
          <li><strong>Seasonal Trends:</strong> Explore product performance across seasons.</li>
          <li><strong>Holiday Patterns:</strong> Discover how holidays impact sales and returns.</li>
        </ul>
      </div>
    </div>
  );
}
