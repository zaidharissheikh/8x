import { Skeleton } from '@/components/ui';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gallery px-4 py-8 lg:py-12 border-t border-black/10">
      <div className="mx-auto max-w-[1800px]">
        {/* Header Bar Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-6 mb-10 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64 md:w-96" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] items-start">
          {/* Filters Sidebar Skeleton */}
          <aside className="hidden lg:block space-y-10">
            {[1, 2, 3, 4].map((group) => (
              <section key={group}>
                <Skeleton className="h-3 w-24 mb-4" />
                <div className="space-y-3 pt-2 border-t border-black/10">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-3 items-center">
                      <Skeleton className="h-4 w-4 shrink-0" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </aside>

          {/* Main Product Grid Skeleton */}
          <main className="min-w-0">
            <div className="flex items-center justify-end mb-6">
               <Skeleton className="h-10 w-48" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border-t border-l border-black/10">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex flex-col p-6 sm:p-8 border-b border-r border-black/10 bg-white">
                  <Skeleton className="aspect-[4/5] w-full mb-6" />
                  <div className="flex flex-col flex-1">
                    <Skeleton className="h-3 w-24 mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-6" />
                    <Skeleton className="h-3 w-16 mb-8" />
                    <div className="mt-auto flex justify-between items-end gap-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-10 w-[120px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
