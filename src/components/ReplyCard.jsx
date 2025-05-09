import Link from 'next/link';

export default function ReplyCard({ content, author, date, id }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-4">
      <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: content }} />
      
      <div className="flex justify-between text-sm text-gray-500">
        <span>By {author}</span>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
