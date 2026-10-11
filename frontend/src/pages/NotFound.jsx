import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
    <p className="font-display text-6xl text-ink-800">404</p>
    <h1 className="mt-3 text-xl font-medium text-ink-800">This page has checked out</h1>
    <p className="mt-2 text-sm text-ink-500">
      The page you're looking for doesn't exist or may have moved.
    </p>
    <Link to="/" className="btn-primary mt-6">
      Back to home
    </Link>
  </div>
);

export default NotFound;
