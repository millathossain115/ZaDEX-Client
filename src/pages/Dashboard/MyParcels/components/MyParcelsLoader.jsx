const SkeletonBlock = ({ className = '', tone = 'bg-gray-100' }) => (
    <div className={`rounded-lg ${tone} ${className}`}></div>
);

const MyParcelsLoader = () => (
    <div className="animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <SkeletonBlock className="h-9 w-44 mb-3" />
                <SkeletonBlock className="h-4 w-64 max-w-full" />
            </div>
            <SkeletonBlock className="h-11 w-40 rounded-xl bg-[#03373D]/15" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[0, 1, 2, 3].map(item => (
                <div key={item} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <SkeletonBlock tone="" className={`h-10 w-10 rounded-xl ${
                            item === 0 ? 'bg-[#03373D]/10' :
                            item === 1 ? 'bg-amber-100' :
                            item === 2 ? 'bg-blue-100' :
                            'bg-emerald-100'
                        }`} />
                        <div>
                            <SkeletonBlock className="h-7 w-10 mb-2" />
                            <SkeletonBlock className="h-3 w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="hidden lg:grid grid-cols-8 gap-6 px-6 py-5 bg-gray-50 border-b border-gray-100 rounded-t-2xl">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(item => (
                    <SkeletonBlock key={item} className="h-3 w-full" />
                ))}
            </div>

            {[0, 1, 2, 3].map(row => (
                <div
                    key={row}
                    className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-y-4 gap-x-4 lg:gap-6 p-5 lg:px-6 lg:py-6 border-b border-gray-50 last:border-b-0 ${
                        row % 2 === 1 ? 'bg-gray-50/30' : ''
                    }`}
                >
                    <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-2">
                        <SkeletonBlock className="h-4 w-28" />
                        <SkeletonBlock className="h-5 w-20 rounded-md" />
                    </div>
                    <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-2">
                        <SkeletonBlock className="h-4 w-32" />
                        <SkeletonBlock className="h-3 w-20" />
                    </div>
                    <div className="space-y-2">
                        <SkeletonBlock className="h-4 w-24" />
                        <SkeletonBlock className="h-3 w-20" />
                    </div>
                    <SkeletonBlock className="h-5 w-20 self-center" />
                    <SkeletonBlock className="h-7 w-24 rounded-lg self-center" />
                    <SkeletonBlock className="h-7 w-20 rounded-lg self-center" />
                    <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-2">
                        <SkeletonBlock className="h-4 w-24" />
                        <SkeletonBlock className="h-3 w-16" />
                    </div>
                    <div className="col-span-2 md:col-span-2 lg:col-span-1 flex justify-end gap-3 pt-2 border-t border-gray-100 lg:pt-0 lg:border-t-0 lg:mt-0">
                        <SkeletonBlock className="h-8 w-24 rounded-lg" />
                        <SkeletonBlock className="h-9 w-9 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default MyParcelsLoader;
