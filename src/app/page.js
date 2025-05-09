'use client';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Community</h1>
      
      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Recent Topics</h2>
          <div className="space-y-4">
            {/* Topic list will go here */}
            <p className="text-gray-500">No topics yet. Be the first to create one!</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Get Started</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Join our community discussions by creating a new topic or replying to existing ones.
            </p>
            <div className="flex gap-4">
              <a
                href="/create-topic"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create Topic
              </a>
              <a
                href="/create-reply"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Browse Topics
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
