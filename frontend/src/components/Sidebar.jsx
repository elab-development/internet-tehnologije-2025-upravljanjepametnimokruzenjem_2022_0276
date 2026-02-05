import React from 'react';
import StanButton from './StanButton';

const Sidebar = ({ stanoviVlasnik, stanoviStanar, onStanSelect, selectedStanId, userRole, onCreateStan, onDeleteStan,onEditStan, onManageUsersStan }) => {
    return (
        <aside className="w-72 bg-slate-800/50 border-r border-slate-800 flex flex-col h-full">
            <div className="p-8">
                <h1 className="text-2xl font-black text-blue-500 tracking-tighter italic">SMART.HOME</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                <section className="mb-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">{userRole!='dete'?"Moji Objekti":""}</p>
                    <div className="space-y-1">
                        {stanoviVlasnik.map(stan => (
                            <StanButton
                                key={stan.idStan}
                                stan={stan}
                                isActive={selectedStanId === stan.idStan}
                                onClick={onStanSelect}
                                onDelete={onDeleteStan} 
                                onEdit={onEditStan}
                                variant="blue"
                                onManageUsers={onManageUsersStan}
                            />
                        ))}

                        {/* Dugme za kreiranje novog stana - sakriveno za ulogu 'dete' */}
                        {userRole !== 'dete' && (
                            <button
                                onClick={onCreateStan}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-500 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/5 transition-all group mt-2"
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    +
                                </div>
                                <span className="font-bold text-sm">Dodaj novi stan</span>
                            </button>
                        )}
                    </div>
                </section>

                {stanoviStanar.length > 0 && (
                    <section>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Pristup</p>
                        <div className="space-y-1">
                            {stanoviStanar.map(stan => (
                                <StanButton
                                    key={stan.idStan}
                                    stan={stan}
                                    isActive={selectedStanId === stan.idStan}
                                    onClick={onStanSelect}
                                    variant="emerald"
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;