export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
      <p className="mt-4">
        Sorry, we couldn't find what you were looking for.<br/>
        <a href="/" className="text-blue-500 hover:underline">Go back home</a>
      </p>
    </div>
  );
}
