export default function Loading() {
  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='h-10 w-40 bg-gray-200 rounded animate-pulse' />
          <div className='h-10 w-full sm:w-80 bg-gray-200 rounded animate-pulse' />
        </div>

        <div className='mb-8 h-8 w-64 bg-gray-200 rounded animate-pulse' />

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className='border-2 border-gray-200 bg-gray-50 rounded-lg p-6 animate-pulse'
            >
              <div className='space-y-3'>
                <div className='h-4 bg-gray-200 rounded w-full' />
                <div className='h-4 bg-gray-200 rounded w-3/4' />
                <div className='h-4 bg-gray-200 rounded w-1/2' />
              </div>
              <div className='mt-4 flex gap-2'>
                <div className='h-8 bg-gray-200 rounded flex-1' />
                <div className='h-8 bg-gray-200 rounded flex-1' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
