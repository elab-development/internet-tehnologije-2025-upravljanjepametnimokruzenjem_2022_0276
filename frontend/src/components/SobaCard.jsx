const SobaCard = ({ soba, onClick, onDelete, onEdit, isVlasnik }) => {
    return (
        <div 
            onClick={() => onClick(soba)}
            className="relative bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all cursor-pointer group shadow-lg"
        >
            {isVlasnik && (
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    {/* Dugme za EDIT */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(soba);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900/50 text-slate-500 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                    >
                        ✎
                    </button>
                    
                    {/* Dugme za DELETE */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(soba);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900/50 text-slate-500 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🚪
            </div>

            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                {soba.nazivSobe}
            </h3>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">ID: {soba.rbSoba}</span>
                <span className="text-blue-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity italic">
                    Pregledaj uređaje →
                </span>
            </div>
        </div>
    );
};

export default SobaCard;