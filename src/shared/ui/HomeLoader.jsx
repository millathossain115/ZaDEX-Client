const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse rounded-lg bg-gray-200/80 ${className}`}></div>
);

const HomeLoader = () => (
    <div className="min-h-screen bg-[#F0F0F0]" aria-label="Loading homepage">
        <section className="relative w-full overflow-hidden bg-white">
            <div className="relative h-[42vh] min-h-[240px] w-full sm:h-[52vh] lg:h-[620px]">
                <div className="absolute inset-0 bg-white">
                    <div className="mx-auto grid h-full w-[90%] grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-5">
                            <Skeleton className="h-12 w-4/5 max-w-[520px] sm:h-16" />
                            <Skeleton className="h-12 w-3/5 max-w-[390px] sm:h-16" />
                            <div className="hidden space-y-3 pt-10 sm:block">
                                <Skeleton className="h-4 w-2/3 max-w-[420px]" />
                                <Skeleton className="h-4 w-1/2 max-w-[320px]" />
                            </div>
                        </div>

                        <div className="hidden items-center justify-center lg:flex">
                            <Skeleton className="h-[360px] w-[360px] rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
                    {[0, 1, 2, 3].map((dot) => (
                        <span key={dot} className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#03373D]/35"></span>
                    ))}
                </div>
            </div>
        </section>

        <section className="mx-auto w-[90%] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col items-center gap-3 text-center">
                <Skeleton className="h-10 w-64 max-w-full" />
                <Skeleton className="h-4 w-full max-w-xl" />
                <Skeleton className="h-4 w-4/5 max-w-md" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="aspect-square rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
                        <Skeleton className="mb-5 h-7 w-20 rounded-full bg-[#E6F7F8]" />
                        <Skeleton className="mb-5 h-14 w-14 rounded-xl bg-[#03373D]/20" />
                        <Skeleton className="mb-3 h-5 w-3/4" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-5/6" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="mx-auto w-[90%] rounded-xl bg-[#03373D] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col items-center gap-4 text-center">
                    <Skeleton className="h-10 w-56 bg-white/20" />
                    <Skeleton className="h-4 w-full max-w-2xl bg-white/15" />
                    <Skeleton className="h-4 w-4/5 max-w-xl bg-white/15" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2, 3, 4, 5].map((service) => (
                        <div key={service} className="flex h-80 flex-col items-center justify-center rounded-lg bg-white p-6 text-center">
                            <Skeleton className="mb-5 h-14 w-14 rounded-full bg-gray-200" />
                            <Skeleton className="mb-4 h-6 w-40" />
                            <Skeleton className="mb-2 h-3 w-full max-w-[220px]" />
                            <Skeleton className="h-3 w-4/5 max-w-[180px]" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </div>
);

export default HomeLoader;
