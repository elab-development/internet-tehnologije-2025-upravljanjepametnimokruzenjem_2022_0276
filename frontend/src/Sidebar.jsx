import React from 'react';
import StanButton from './StanButton';

const Sidebar = ({ stanoviVlasnik, stanoviStanar, onStanSelect, selectedStanId }) => {
    return (
        <aside className="w-72 bg-slate-800/50 border-r border-slate-800 flex flex-col h-full">
            <div className="p-8">
                <h1 className="text-2xl font-black text-blue-500 tracking-tighter italic">SMART.DOM</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                <section className="mb-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Moji Objekti</p>
                    {stanoviVlasnik.map(stan => (
                        <StanButton 
                            key={stan.idStan}
                            stan={stan}
                            isActive={selectedStanId === stan.idStan}
                            onClick={onStanSelect}
                            variant="blue"
                        />
                    ))}
                </section>

                {stanoviStanar.length > 0 && (
                    <section>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Pristup</p>
                        {stanoviStanar.map(stan => (
                            <StanButton 
                                key={stan.idStan}
                                stan={stan}
                                isActive={selectedStanId === stan.idStan}
                                onClick={onStanSelect}
                                variant="emerald"
                            />
                        ))}
                    </section>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;