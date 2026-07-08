import logo from '@/assets/logos/Zadex-fav.svg';

const HomeLoader = ({ progress }) => (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
            <div className="flex items-center justify-center gap-3">
                <img src={logo} alt="Zadex" className="h-10 w-auto" />
                <span className="text-4xl font-black italic tracking-tight">
                    <span className="text-gray-800">Za</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9051] to-emerald-400">DEX</span>
                </span>
            </div>

            <div className="mt-10">
                <div className="mb-3 flex items-end justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#03373D]">
                        Loading
                    </p>
                    <p className="text-3xl font-black tabular-nums text-gray-900">
                        {progress}%
                    </p>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white border border-gray-200 shadow-inner">
                    <div
                        className="h-full rounded-full bg-[#03373D] transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                    <span>Start</span>
                    <span>Ready</span>
                </div>

                <div className="mt-8 flex justify-center gap-2">
                    {[0, 1, 2].map(dot => (
                        <span
                            key={dot}
                            className="h-2 w-2 rounded-full bg-[#03373D] animate-pulse"
                            style={{ animationDelay: `${dot * 160}ms` }}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default HomeLoader;
