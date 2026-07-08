import SkeletonBlock from './SkeletonBlock';

const KpiCardSkeleton = ({ accent = 'bg-[#03373D]/10' }) => (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
            <SkeletonBlock tone="" className={`h-10 w-10 rounded-xl ${accent}`} />
            <div>
                <SkeletonBlock className="h-7 w-10 mb-2" />
                <SkeletonBlock className="h-3 w-16" />
            </div>
        </div>
    </div>
);

const HeaderSkeleton = ({ title = 'w-48', subtitle = 'w-72', action = false }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <SkeletonBlock className={`h-8 ${title} mb-2`} />
            <SkeletonBlock className={`h-4 ${subtitle} max-w-full`} />
        </div>
        {action && <SkeletonBlock className="h-10 w-32 bg-[#03373D]/15" />}
    </div>
);

export const DashboardTableLoader = ({
    title = 'w-52',
    subtitle = 'w-72',
    tabs = 0,
    stats = 0,
    columns = 6,
    rows = 5,
    search = false,
    showHeader = true,
}) => (
    <div className="space-y-6 animate-pulse">
        {showHeader && <HeaderSkeleton title={title} subtitle={subtitle} />}

        {stats > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: stats }).map((_, item) => (
                    <KpiCardSkeleton
                        key={item}
                        accent={
                            item === 0 ? 'bg-[#03373D]/10' :
                            item === 1 ? 'bg-amber-100' :
                            item === 2 ? 'bg-blue-100' :
                            'bg-emerald-100'
                        }
                    />
                ))}
            </div>
        )}

        {tabs > 0 && (
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: tabs }).map((_, item) => (
                    <SkeletonBlock key={item} className="h-9 w-24 rounded-xl" />
                ))}
            </div>
        )}

        {search && <SkeletonBlock className="h-11 w-full md:w-96 rounded-xl bg-white border border-gray-100" />}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="hidden lg:grid gap-4 px-6 py-5 bg-gray-50 border-b border-gray-100" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {Array.from({ length: columns }).map((_, item) => (
                    <SkeletonBlock key={item} className="h-3 w-full" />
                ))}
            </div>

            {Array.from({ length: rows }).map((_, row) => (
                <div key={row}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-5 gap-y-4 px-6 py-5 items-center">
                        {Array.from({ length: columns }).map((_, item) => (
                            <div key={item} className="space-y-2">
                                <SkeletonBlock className={`${item === 0 ? 'h-4 w-36' : 'h-4 w-24'}`} />
                                {item % 2 === 0 && <SkeletonBlock className="h-3 w-20" />}
                            </div>
                        ))}
                    </div>
                    {row < rows - 1 && <hr className="border-gray-100" />}
                </div>
            ))}
        </div>
    </div>
);

export const RouteGateLoader = () => (
    <div className="min-h-screen bg-[#F0F0F0] p-4 sm:p-6 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <SkeletonBlock className="h-10 w-10 rounded-xl bg-[#03373D]/15" />
                    <SkeletonBlock className="h-7 w-32" />
                </div>
                <SkeletonBlock className="h-10 w-28 rounded-xl" />
            </div>
            <DashboardTableLoader stats={4} tabs={4} search rows={4} />
        </div>
    </div>
);

export const MyParcelsLoader = () => (
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
                <KpiCardSkeleton
                    key={item}
                    accent={
                        item === 0 ? 'bg-[#03373D]/10' :
                        item === 1 ? 'bg-amber-100' :
                        item === 2 ? 'bg-blue-100' :
                        'bg-emerald-100'
                    }
                />
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

export const MyProfileLoader = () => (
    <div className="space-y-4 animate-pulse">
        <HeaderSkeleton title="w-40" subtitle="w-72" action />
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <SkeletonBlock className="h-3 w-28 mb-5" />
                <div className="flex flex-col items-center">
                    <SkeletonBlock className="w-24 h-24 rounded-2xl bg-[#03373D]/15 mb-3" />
                    <SkeletonBlock className="h-5 w-36 mb-2" />
                    <SkeletonBlock className="h-3 w-44" />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {[0, 1].map(item => (
                        <div key={item} className="flex items-center gap-2.5">
                            <SkeletonBlock tone="" className={`w-8 h-8 rounded-lg ${item === 0 ? 'bg-emerald-100' : 'bg-blue-100'}`} />
                            <div className="space-y-2">
                                <SkeletonBlock className="h-3 w-16" />
                                <SkeletonBlock className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {[0, 1].map(section => (
                    <div key={section} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                        <div className="flex items-center gap-2.5 mb-4">
                            <SkeletonBlock className={`w-8 h-8 rounded-lg ${section === 0 ? 'bg-[#03373D]/10' : 'bg-amber-100'}`} />
                            <div>
                                <SkeletonBlock className="h-4 w-40 mb-2" />
                                <SkeletonBlock className="h-3 w-32" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map(item => (
                                <div key={item} className={section === 1 && item === 0 ? 'md:col-span-2' : ''}>
                                    <SkeletonBlock className="h-3 w-24 mb-2" />
                                    <SkeletonBlock className={`${section === 1 && item === 0 ? 'h-16' : 'h-11'} w-full bg-gray-50 border border-gray-100`} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const PaymentHistoryLoader = () => (
    <div className="animate-pulse">
        <div className="mb-6">
            <SkeletonBlock className="h-9 w-56 mb-3" />
            <SkeletonBlock className="h-4 w-72 max-w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-linear-to-br from-[#03373D]/90 to-[#025a63]/90 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center gap-4">
                    <SkeletonBlock className="w-14 h-14 rounded-2xl bg-white/20" />
                    <div className="flex-1">
                        <SkeletonBlock className="h-3 w-24 mb-3 bg-white/25" />
                        <SkeletonBlock className="h-9 w-32 mb-3 bg-white/30" />
                        <SkeletonBlock className="h-3 w-40 bg-white/20" />
                    </div>
                </div>
            </div>
            {[0, 1].map(item => (
                <div key={item} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <SkeletonBlock tone="" className={`w-14 h-14 rounded-2xl ${item === 0 ? 'bg-emerald-100' : 'bg-blue-100'}`} />
                        <div className="flex-1">
                            <SkeletonBlock className="h-3 w-28 mb-3" />
                            <SkeletonBlock className="h-8 w-24 mb-3" />
                            <SkeletonBlock className="h-3 w-36" />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <DashboardTableLoader showHeader={false} columns={8} rows={5} />
    </div>
);

export const BalanceLoader = () => (
    <div className="space-y-4 animate-pulse">
        <div>
            <SkeletonBlock className="h-8 w-40 mb-2" />
            <SkeletonBlock className="h-4 w-80 max-w-full" />
        </div>

        <div className="bg-gradient-to-br from-[#03373D]/90 to-[#025a63]/90 rounded-xl p-5 text-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <SkeletonBlock className="h-3 w-32 mb-3 bg-white/25" />
                    <SkeletonBlock className="h-10 w-44 mb-3 bg-white/30" />
                    <SkeletonBlock className="h-3 w-36 bg-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-2 md:min-w-[300px]">
                    {[0, 1].map(item => (
                        <div key={item} className="bg-white/15 rounded-lg p-3">
                            <SkeletonBlock className="h-3 w-20 mb-3 bg-white/25" />
                            <SkeletonBlock className="h-6 w-24 bg-white/30" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-4 items-start">
            <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <SkeletonBlock className="h-5 w-36 mb-4" />
                    <div className="space-y-4">
                        {[0, 1].map(item => (
                            <div key={item}>
                                <SkeletonBlock className="h-3 w-40 mb-2" />
                                <SkeletonBlock className="h-11 w-full bg-gray-50 border border-gray-100" />
                            </div>
                        ))}
                        <SkeletonBlock className="h-11 w-full bg-[#03373D]/15" />
                    </div>
                </div>
                <MiniListPanel rows={3} />
            </div>
            <MiniListPanel rows={5} footer />
        </div>
    </div>
);

const MiniListPanel = ({ rows = 3, footer = false }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="h-8 w-20 bg-gray-100" />
        </div>
        <div className="space-y-2.5">
            {Array.from({ length: rows }).map((_, item) => (
                <div key={item} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <SkeletonBlock tone="" className={`w-9 h-9 rounded-lg shrink-0 ${item === 0 ? 'bg-blue-100' : item === 1 ? 'bg-green-100' : 'bg-purple-100'}`} />
                        <div className="space-y-2">
                            <SkeletonBlock className="h-4 w-28" />
                            <SkeletonBlock className="h-3 w-36" />
                        </div>
                    </div>
                    <SkeletonBlock className="h-4 w-14" />
                </div>
            ))}
        </div>
        {footer && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between">
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="h-4 w-24 bg-emerald-100" />
                </div>
                <div className="flex justify-between">
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="h-4 w-24 bg-red-100" />
                </div>
            </div>
        )}
    </div>
);

export const RiderDashboardLoader = () => (
    <div className="space-y-4 pb-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
                <SkeletonBlock className="h-8 w-56 mb-2" />
                <SkeletonBlock className="h-4 w-72 max-w-full" />
            </div>
            <SkeletonBlock className="h-4 w-28" />
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map(item => (
                <KpiCardSkeleton key={item} accent={item === 0 ? 'bg-emerald-100' : item === 1 ? 'bg-sky-100' : item === 2 ? 'bg-amber-100' : 'bg-slate-200'} />
            ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-4">
            <div className="space-y-4">
                {[0, 1].map(section => (
                    <section key={section} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <SkeletonBlock className="h-5 w-36" />
                                <SkeletonBlock className="h-5 w-8 rounded-full" />
                            </div>
                            <SkeletonBlock className="hidden sm:block h-3 w-40" />
                        </div>
                        <div className="space-y-3 p-3">
                            {[0, 1].map(row => (
                                <div key={row} className="rounded-xl border border-gray-100 p-3">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                                        <div className="min-w-0 lg:w-44">
                                            <SkeletonBlock className="h-3 w-24 mb-2" />
                                            <SkeletonBlock className="h-5 w-32" />
                                        </div>
                                        <SkeletonBlock className="h-6 w-16 rounded" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 min-w-0">
                                            <SkeletonBlock className="h-14 w-full bg-gray-50 border border-gray-100" />
                                            <SkeletonBlock className="h-14 w-full bg-gray-50 border border-gray-100" />
                                        </div>
                                        <div className="flex gap-2 lg:w-56">
                                            <SkeletonBlock className="h-9 flex-1 bg-[#03373D]/15" />
                                            <SkeletonBlock className="h-9 w-20 bg-red-100" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <section className="bg-gradient-to-br from-[#03373D]/90 to-[#025a63]/90 rounded-xl p-4 text-white shadow-lg">
                <SkeletonBlock className="h-3 w-24 mb-5 bg-white/25" />
                <SkeletonBlock className="h-3 w-28 mb-2 bg-white/20" />
                <SkeletonBlock className="h-9 w-36 mb-5 bg-white/30" />
                <SkeletonBlock className="h-10 w-full mb-5 bg-white/80" />
                <div className="space-y-4">
                    {[0, 1].map(section => (
                        <div key={section}>
                            <SkeletonBlock className="h-3 w-32 mb-3 bg-white/20" />
                            <div className="space-y-2">
                                {[0, 1, 2].map(row => (
                                    <div key={row} className="flex justify-between items-center gap-3">
                                        <div>
                                            <SkeletonBlock className="h-4 w-24 mb-2 bg-white/25" />
                                            <SkeletonBlock className="h-3 w-16 bg-white/20" />
                                        </div>
                                        <SkeletonBlock className="h-4 w-16 bg-white/25" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    </div>
);

const RiderAccessPanelLoader = ({ children }) => (
    <div className="animate-pulse space-y-4">
        <HeaderSkeleton title="w-56" subtitle="w-72" />
        {children}
    </div>
);

const RiderTaskCardSkeleton = ({ detailCount = 5, actions = 2, progress = false }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="min-w-0 lg:w-44 space-y-2">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-5 w-36" />
            </div>
            <SkeletonBlock className="h-6 w-20 rounded-full bg-emerald-100" />
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${detailCount > 4 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-2 flex-1 min-w-0`}>
                {Array.from({ length: detailCount }).map((_, item) => (
                    <div key={item} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                        <SkeletonBlock className="mb-2 h-2 w-14" />
                        <SkeletonBlock className="h-3.5 w-24" />
                    </div>
                ))}
            </div>
            <div className="flex gap-2 lg:w-56">
                {Array.from({ length: actions }).map((_, item) => (
                    <SkeletonBlock key={item} className={`h-9 flex-1 rounded-lg ${item === 0 ? 'bg-[#03373D]/15' : 'bg-red-100'}`} />
                ))}
            </div>
        </div>
        {progress && (
            <div className="mt-3 border-t border-gray-100 pt-3">
                <div className="mb-2 flex justify-between">
                    <SkeletonBlock className="h-3 w-28" />
                    <SkeletonBlock className="h-3 w-16" />
                </div>
                <SkeletonBlock className="h-2 w-full rounded-full bg-emerald-100" />
            </div>
        )}
    </div>
);

export const RiderDeliveryListLoader = () => (
    <RiderAccessPanelLoader>
        <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="flex flex-col gap-2 border-b border-gray-100 px-1 pb-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-36" />
                    <SkeletonBlock className="h-3 w-56 max-w-full" />
                </div>
                <SkeletonBlock className="h-6 w-20 rounded-full bg-[#03373D]/10" />
            </div>
            <div className="mt-3 space-y-3">
                {[0, 1, 2].map(row => <RiderTaskCardSkeleton key={row} detailCount={5} actions={2} />)}
            </div>
        </section>
    </RiderAccessPanelLoader>
);

export const RiderOngoingTasksLoader = () => (
    <RiderAccessPanelLoader>
        <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="flex flex-col gap-2 border-b border-gray-100 px-1 pb-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-36" />
                    <SkeletonBlock className="h-3 w-64 max-w-full" />
                </div>
                <SkeletonBlock className="h-6 w-20 rounded-full bg-blue-100" />
            </div>
            <div className="mt-3 space-y-3">
                {[0, 1, 2].map(row => <RiderTaskCardSkeleton key={row} detailCount={4} actions={2} progress />)}
            </div>
        </section>
    </RiderAccessPanelLoader>
);

export const RiderCompletedLoader = () => (
    <RiderAccessPanelLoader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[0, 1, 2].map(item => (
                <KpiCardSkeleton key={item} accent={item === 0 ? 'bg-emerald-100' : item === 1 ? 'bg-blue-100' : 'bg-amber-100'} />
            ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="hidden grid-cols-[1fr_1.2fr_1fr_1fr_0.9fr_0.8fr_0.8fr] gap-3 bg-gray-50 px-4 py-3 xl:grid">
                {[0, 1, 2, 3, 4, 5, 6].map(item => <SkeletonBlock key={item} className="h-3 w-full" />)}
            </div>
            {[0, 1, 2, 3].map(row => (
                <div key={row}>
                    <div className="grid grid-cols-1 gap-2 px-4 py-3 xl:grid-cols-[1fr_1.2fr_1fr_1fr_0.9fr_0.8fr_0.8fr] xl:items-center xl:gap-3">
                        {[0, 1, 2, 3, 4, 5, 6].map(item => (
                            <div key={item} className="flex items-center justify-between gap-3 xl:block">
                                <SkeletonBlock className="h-3 w-16 xl:hidden" />
                                <SkeletonBlock className={`h-4 ${item === 1 ? 'w-36' : 'w-24'}`} />
                            </div>
                        ))}
                    </div>
                    {row < 3 && <hr className="border-gray-200" />}
                </div>
            ))}
        </div>
    </RiderAccessPanelLoader>
);

export const RiderEarningsLoader = () => (
    <RiderAccessPanelLoader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map(item => (
                <div key={item} className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                    <SkeletonBlock className="mb-3 h-3 w-28" />
                    <SkeletonBlock className="h-7 w-24" />
                </div>
            ))}
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-40" />
                    <SkeletonBlock className="h-3 w-72 max-w-full" />
                </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_0.8fr_1fr_auto] lg:items-end">
                {[0, 1, 2].map(item => (
                    <div key={item}>
                        <SkeletonBlock className="mb-2 h-3 w-28" />
                        <SkeletonBlock className="h-11 w-full bg-gray-50 border border-gray-100" />
                    </div>
                ))}
                <SkeletonBlock className="h-11 w-full rounded-xl bg-[#03373D]/15 lg:w-28" />
            </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-3">
                <SkeletonBlock className="mb-2 h-5 w-32" />
                <SkeletonBlock className="h-3 w-64 max-w-full" />
            </div>
            <div className="hidden grid-cols-[0.85fr_1.2fr_1fr_0.85fr_1.25fr_0.75fr_0.75fr_0.75fr] gap-3 bg-gray-50 px-4 py-3 xl:grid">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(item => <SkeletonBlock key={item} className="h-3 w-full" />)}
            </div>
            {[0, 1, 2, 3].map(row => (
                <div key={row}>
                    <div className="grid grid-cols-1 gap-2 px-4 py-3 xl:grid-cols-[0.85fr_1.2fr_1fr_0.85fr_1.25fr_0.75fr_0.75fr_0.75fr] xl:items-center xl:gap-3">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map(item => (
                            <div key={item} className="flex items-center justify-between gap-3 xl:block">
                                <SkeletonBlock className="h-3 w-16 xl:hidden" />
                                <SkeletonBlock className={`h-4 ${item === 4 ? 'w-36' : 'w-24'}`} />
                            </div>
                        ))}
                    </div>
                    {row < 3 && <hr className="border-gray-200" />}
                </div>
            ))}
        </div>
    </RiderAccessPanelLoader>
);

export const RiderMyReviewsLoader = () => (
    <RiderAccessPanelLoader>
        <section className="rounded-3xl bg-gradient-to-br from-[#03373D]/90 to-[#025a63]/90 p-5 text-white shadow-lg">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                    <SkeletonBlock className="h-3 w-32 bg-white/25" />
                    <SkeletonBlock className="h-10 w-28 bg-white/30" />
                    <SkeletonBlock className="h-3 w-56 max-w-full bg-white/20" />
                </div>
                <div className="grid grid-cols-3 gap-2 sm:min-w-[260px]">
                    {[0, 1, 2].map(item => (
                        <div key={item} className="rounded-xl bg-white/15 p-3">
                            <SkeletonBlock className="mb-2 h-3 w-12 bg-white/25" />
                            <SkeletonBlock className="h-6 w-12 bg-white/30" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[0, 1, 2, 3].map(item => (
                <div key={item} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <SkeletonBlock className="h-11 w-11 rounded-2xl bg-amber-100" />
                            <div className="space-y-2">
                                <SkeletonBlock className="h-4 w-32" />
                                <SkeletonBlock className="h-3 w-24" />
                            </div>
                        </div>
                        <SkeletonBlock className="h-6 w-20 rounded-full bg-amber-100" />
                    </div>
                    <SkeletonBlock className="mb-2 h-3 w-full" />
                    <SkeletonBlock className="mb-2 h-3 w-11/12" />
                    <SkeletonBlock className="h-3 w-2/3" />
                </div>
            ))}
        </div>
    </RiderAccessPanelLoader>
);

export const DetailPageLoader = () => (
    <div className="space-y-5 animate-pulse">
        <HeaderSkeleton title="w-48" subtitle="w-72" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
                <SkeletonBlock className="h-5 w-44" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3, 4, 5].map(item => (
                        <div key={item} className="rounded-lg bg-gray-50 border border-gray-100 p-4">
                            <SkeletonBlock className="h-3 w-24 mb-3" />
                            <SkeletonBlock className="h-5 w-36" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
                <SkeletonBlock className="h-5 w-36" />
                {[0, 1, 2].map(item => (
                    <div key={item} className="flex items-center gap-3">
                        <SkeletonBlock className="h-10 w-10 rounded-xl bg-[#03373D]/10" />
                        <div className="space-y-2">
                            <SkeletonBlock className="h-4 w-32" />
                            <SkeletonBlock className="h-3 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const PaymentPageLoader = () => (
    <div className="space-y-6 animate-pulse">
        <HeaderSkeleton title="w-48" subtitle="w-72" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <SkeletonBlock className="h-5 w-44" />
                {[0, 1, 2, 3].map(item => (
                    <div key={item} className="flex justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0">
                        <SkeletonBlock className="h-4 w-32" />
                        <SkeletonBlock className="h-4 w-40" />
                    </div>
                ))}
            </div>
            <div className="bg-gradient-to-br from-[#03373D]/90 to-[#025a63]/90 rounded-2xl p-6 text-white shadow-xl">
                <SkeletonBlock className="h-4 w-32 mb-4 bg-white/25" />
                <SkeletonBlock className="h-10 w-40 mb-5 bg-white/30" />
                <SkeletonBlock className="h-11 w-full mb-3 bg-white/80" />
                <SkeletonBlock className="h-11 w-full bg-white/25" />
            </div>
        </div>
    </div>
);

export const BeARiderLoader = () => (
    <div className="min-h-[calc(100vh-96px)] bg-[#F0F0F0] p-4 sm:p-6 animate-pulse">
        <div className="max-w-5xl mx-auto space-y-6">
            <HeaderSkeleton title="w-56" subtitle="w-96" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    {[0, 1, 2, 3, 4, 5].map(item => (
                        <div key={item}>
                            <SkeletonBlock className="h-3 w-28 mb-2" />
                            <SkeletonBlock className="h-11 w-full bg-gray-50 border border-gray-100" />
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <SkeletonBlock className="h-5 w-40" />
                    {[0, 1, 2].map(item => (
                        <div key={item} className="flex gap-3">
                            <SkeletonBlock className="h-9 w-9 rounded-xl bg-emerald-100" />
                            <div className="space-y-2">
                                <SkeletonBlock className="h-4 w-32" />
                                <SkeletonBlock className="h-3 w-40" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const AdminDesktopTableSkeleton = ({ columns = 6, rows = 5, template = null, minWidth = '900px' }) => (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div
            className="hidden gap-3 bg-gray-50 px-5 py-4 xl:grid"
            style={{ gridTemplateColumns: template || `repeat(${columns}, minmax(0, 1fr))`, minWidth }}
        >
            {Array.from({ length: columns }).map((_, item) => <SkeletonBlock key={item} className="h-3 w-full" />)}
        </div>
        {Array.from({ length: rows }).map((_, row) => (
            <div key={row}>
                <div
                    className="hidden gap-3 px-5 py-4 xl:grid xl:items-center"
                    style={{ gridTemplateColumns: template || `repeat(${columns}, minmax(0, 1fr))`, minWidth }}
                >
                    {Array.from({ length: columns }).map((_, item) => (
                        <div key={item}>
                            <SkeletonBlock className={`h-4 ${item === 0 ? 'w-36' : 'w-24'}`} />
                            {item === 0 && <SkeletonBlock className="mt-2 h-3 w-44" />}
                        </div>
                    ))}
                </div>
                <div className="space-y-3 px-5 py-4 xl:hidden">
                    <div className="flex items-center justify-between gap-3">
                        <div className="space-y-2">
                            <SkeletonBlock className="h-4 w-36" />
                            <SkeletonBlock className="h-3 w-44 max-w-full" />
                        </div>
                        <SkeletonBlock className="h-6 w-20 rounded-full bg-emerald-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: Math.min(columns - 1, 4) }).map((_, item) => (
                            <SkeletonBlock key={item} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
                {row < rows - 1 && <hr className="border-gray-200" />}
            </div>
        ))}
    </div>
);

export const AdminStatisticsLoader = () => (
    <div className="space-y-6 animate-pulse">
        <HeaderSkeleton title="w-48" subtitle="w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map(item => <KpiCardSkeleton key={item} accent={item === 0 ? 'bg-[#03373D]/20' : item === 1 ? 'bg-blue-100' : item === 2 ? 'bg-emerald-100' : 'bg-amber-100'} />)}
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map(item => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
                    <SkeletonBlock tone="" className={`h-10 w-10 rounded-xl ${item === 0 ? 'bg-purple-100' : item === 1 ? 'bg-amber-100' : item === 2 ? 'bg-blue-100' : 'bg-emerald-100'}`} />
                    <div className="space-y-2">
                        <SkeletonBlock className="h-5 w-14" />
                        <SkeletonBlock className="h-3 w-28" />
                    </div>
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[0, 1, 2].map(item => (
                <div key={item} className="rounded-2xl border-l-4 border-gray-200 bg-gray-50 p-5 shadow-sm">
                    <SkeletonBlock className="mb-2 h-3 w-24" />
                    <SkeletonBlock className="mb-4 h-5 w-36" />
                    <div className="flex items-end justify-between">
                        <SkeletonBlock className="h-9 w-12" />
                        <SkeletonBlock className="h-4 w-24 bg-white/70" />
                    </div>
                </div>
            ))}
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-48" />
                    <SkeletonBlock className="h-3 w-64 max-w-full" />
                </div>
                <SkeletonBlock className="h-10 w-32 rounded-xl" />
            </div>
            <div className="hidden overflow-x-auto lg:block">
                <div className="grid min-w-[760px] grid-cols-[1.3fr_1fr_1fr_0.9fr_0.8fr_0.7fr] gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3">
                    {[0, 1, 2, 3, 4, 5].map(item => <SkeletonBlock key={item} className="h-3 w-full" />)}
                </div>
                {[0, 1, 2].map(row => (
                    <div key={row} className="grid min-w-[760px] grid-cols-[1.3fr_1fr_1fr_0.9fr_0.8fr_0.7fr] gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0">
                        {[0, 1, 2, 3, 4, 5].map(item => <SkeletonBlock key={item} className={`h-4 ${item === 0 ? 'w-36' : 'w-24'}`} />)}
                    </div>
                ))}
            </div>
            <div className="space-y-3 lg:hidden">
                {[0, 1, 2].map(item => (
                    <div key={item} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <SkeletonBlock className="mb-3 h-5 w-40" />
                        <div className="grid grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map(cell => <SkeletonBlock key={cell} className="h-4 w-full" />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const AllParcelsLoader = () => (
    <div className="space-y-8 animate-pulse">
        <HeaderSkeleton title="w-64" subtitle="w-96" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map(item => <KpiCardSkeleton key={item} accent={item === 0 ? 'bg-[#03373D]/10' : item === 1 ? 'bg-amber-100' : item === 2 ? 'bg-blue-100' : 'bg-emerald-100'} />)}
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map(item => <SkeletonBlock key={item} className="h-10 w-28 rounded-xl bg-white border border-gray-100" />)}
            </div>
            <SkeletonBlock className="h-10 w-full rounded-xl md:w-72" />
        </div>
        <AdminDesktopTableSkeleton
            columns={7}
            rows={5}
            minWidth="980px"
            template="1.15fr 1.2fr 1.2fr 0.9fr 0.8fr 0.8fr 0.7fr"
        />
    </div>
);

export const AssignParcelsLoader = () => (
    <div className="space-y-5 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
                <SkeletonBlock className="h-7 w-52 mb-2" />
                <SkeletonBlock className="h-3 w-80 max-w-full" />
            </div>
            <div className="flex gap-2">
                <SkeletonBlock className="h-9 w-28" />
                <SkeletonBlock className="h-9 w-28" />
            </div>
        </div>
        <SkeletonBlock className="h-10 bg-white border border-gray-100 rounded-xl shadow-sm" />
        <div className="space-y-2">
            {[0, 1, 2, 3].map(item => (
                <div key={item} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <SkeletonBlock className="h-4 w-36" />
                                <SkeletonBlock className="h-4 w-10" />
                                <SkeletonBlock className="h-4 w-12" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {[0, 1].map(card => (
                                    <div key={card} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                                        <SkeletonBlock className="h-2 w-16 mb-2" />
                                        <SkeletonBlock className="h-3.5 w-28 mb-1" />
                                        <SkeletonBlock className="h-3 w-44" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-2 lg:pt-0 lg:pl-3 w-full lg:w-32">
                            <SkeletonBlock className="w-full h-8" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const AdminPaymentLogsLoader = () => (
    <div className="space-y-8 animate-pulse">
        <HeaderSkeleton title="w-64" subtitle="w-96" />
        <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
                <SkeletonBlock className="h-14 w-14 rounded-2xl bg-[#03373D]/10" />
                <div className="space-y-3">
                    <SkeletonBlock className="h-3 w-28" />
                    <SkeletonBlock className="h-8 w-32" />
                    <SkeletonBlock className="h-3 w-40" />
                </div>
            </div>
        </div>
        <div className="flex justify-end">
            <SkeletonBlock className="h-12 w-full md:w-80 rounded-xl" />
        </div>
        <AdminDesktopTableSkeleton
            columns={7}
            rows={5}
            minWidth="900px"
            template="1fr 1.1fr 1.15fr 1fr 0.85fr 0.85fr 0.75fr"
        />
    </div>
);

export const ManageUsersLoader = () => (
    <div className="relative space-y-6 animate-pulse">
        <HeaderSkeleton title="w-48" subtitle="w-64" />
        <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4].map(item => <SkeletonBlock key={item} className="h-9 w-28 rounded-xl bg-white border border-gray-100" />)}
        </div>
        <SkeletonBlock className="h-10 w-full rounded-xl bg-white border border-gray-100 md:w-96" />
        <div className="hidden overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm xl:block">
            <div className="grid min-w-[1000px] grid-cols-[2.2fr_0.9fr_0.85fr_0.9fr_0.65fr_0.65fr_0.7fr_0.75fr_0.4fr] gap-2 border-b border-gray-200 bg-gray-50 px-5 py-4">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(item => <SkeletonBlock key={item} className="h-3 w-full" />)}
            </div>
            {[0, 1, 2, 3].map(row => (
                <div key={row} className="grid min-w-[1000px] grid-cols-[2.2fr_0.9fr_0.85fr_0.9fr_0.65fr_0.65fr_0.7fr_0.75fr_0.4fr] gap-2 border-b border-gray-200 px-5 py-4 last:border-b-0">
                    <div className="flex items-center gap-3">
                        <SkeletonBlock className="h-10 w-10 rounded-full bg-[#03373D]/10" />
                        <div className="space-y-2">
                            <SkeletonBlock className="h-4 w-32" />
                            <SkeletonBlock className="h-3 w-44" />
                        </div>
                    </div>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(item => <SkeletonBlock key={item} className="h-4 w-20 self-center" />)}
                </div>
            ))}
        </div>
        <div className="space-y-3 xl:hidden">
            {[0, 1, 2].map(row => (
                <div key={row} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <SkeletonBlock className="h-10 w-10 rounded-full bg-[#03373D]/10" />
                        <div className="flex-1 space-y-2">
                            <SkeletonBlock className="h-4 w-36" />
                            <SkeletonBlock className="h-3 w-48 max-w-full" />
                        </div>
                        <SkeletonBlock className="h-6 w-20 rounded-lg bg-emerald-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pl-13">
                        {[0, 1, 2, 3].map(item => <SkeletonBlock key={item} className="h-4 w-full" />)}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const RiderTableRowSkeleton = ({ columns = 5 }) => (
    <div className={`grid grid-cols-1 gap-4 px-4 py-4 ${columns === 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} lg:items-center lg:gap-5`}>
        <div className="flex items-center gap-3">
            <SkeletonBlock className="h-11 w-11 rounded-full bg-emerald-100" />
            <div className="space-y-2">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-3 w-44 max-w-full" />
            </div>
        </div>
        {Array.from({ length: columns - 1 }).map((_, item) => (
            <div key={item} className="flex items-center justify-between gap-3 lg:block">
                <SkeletonBlock className="h-3 w-16 lg:hidden" />
                <SkeletonBlock className={`h-4 ${item === columns - 2 ? 'w-28' : 'w-24'}`} />
            </div>
        ))}
    </div>
);

export const ActiveRidersLoader = () => (
    <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
        <HeaderSkeleton title="w-44" subtitle="w-72" />
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="hidden grid-cols-5 gap-5 border-b border-gray-100 bg-gray-50 px-4 py-4 lg:grid">
                {[0, 1, 2, 3, 4].map(item => <SkeletonBlock key={item} className="h-3 w-full" />)}
            </div>
            {[0, 1, 2, 3, 4].map(row => (
                <div key={row}>
                    <RiderTableRowSkeleton columns={5} />
                    {row < 4 && <hr className="border-gray-200" />}
                </div>
            ))}
        </div>
    </div>
);

export const PendingRidersLoader = () => (
    <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
        <HeaderSkeleton title="w-64" subtitle="w-80" />
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="hidden grid-cols-6 gap-4 border-b border-gray-100 bg-gray-50 px-4 py-4 lg:grid">
                {[0, 1, 2, 3, 4, 5].map(item => <SkeletonBlock key={item} className="h-3 w-full" />)}
            </div>
            {[0, 1, 2, 3].map(row => (
                <div key={row}>
                    <RiderTableRowSkeleton columns={6} />
                    {row < 3 && <hr className="border-gray-200" />}
                </div>
            ))}
        </div>
    </div>
);

export const ManageRidersLoader = () => (
    <div className="space-y-6 animate-pulse">
        <HeaderSkeleton title="w-44" subtitle="w-72" />
        <div className="flex flex-wrap gap-2">
            <SkeletonBlock className="h-10 w-44 rounded-xl bg-[#03373D]/15" />
            <SkeletonBlock className="h-10 w-32 rounded-xl bg-white border border-gray-100" />
        </div>
        <div className="space-y-3">
            {[0, 1, 2].map(row => (
                <div key={row} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <SkeletonBlock className="h-12 w-12 rounded-full bg-emerald-100" />
                            <div className="space-y-2">
                                <SkeletonBlock className="h-4 w-36" />
                                <SkeletonBlock className="h-3 w-48 max-w-full" />
                            </div>
                        </div>
                        <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:max-w-xl">
                            {[0, 1, 2, 3].map(item => <SkeletonBlock key={item} className="h-10 w-full bg-gray-50 border border-gray-100" />)}
                        </div>
                        <div className="flex gap-2 lg:w-56">
                            <SkeletonBlock className="h-10 flex-1 rounded-xl bg-red-100" />
                            <SkeletonBlock className="h-10 flex-1 rounded-xl bg-emerald-100" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const RiderReviewsLoader = () => (
    <div className="space-y-6 animate-pulse">
        <HeaderSkeleton title="w-64" subtitle="w-80" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map(item => (
                <div key={item} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <SkeletonBlock className="h-12 w-12 rounded-full bg-emerald-100" />
                            <div className="space-y-2">
                                <SkeletonBlock className="h-4 w-32" />
                                <SkeletonBlock className="h-3 w-40" />
                            </div>
                        </div>
                        <SkeletonBlock className="h-7 w-16 rounded-full bg-amber-100" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[0, 1, 2].map(cell => (
                            <div key={cell} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                <SkeletonBlock className="mb-2 h-3 w-10" />
                                <SkeletonBlock className="h-5 w-12" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <div className="mb-2 flex justify-between">
                            <SkeletonBlock className="h-3 w-24" />
                            <SkeletonBlock className="h-3 w-10" />
                        </div>
                        <SkeletonBlock className="h-2 w-full rounded-full bg-emerald-100" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);
