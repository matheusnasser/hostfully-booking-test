export default function Loading() {
  return (
    <div className="bg-white rounded-lg p-12 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent mb-4" />
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}
