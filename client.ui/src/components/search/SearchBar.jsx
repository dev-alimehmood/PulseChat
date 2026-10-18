import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search conversations or contacts..." }) => {
  return (
    <div className="relative flex items-center w-full group">
      {/* Search icon */}
      <Search className="absolute left-3.5 w-4 h-4 pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#38bdf8] transition-colors" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-2xl text-sm outline-none border transition-all duration-300 bg-slate-100/90 dark:bg-[#0e1428]/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-200/80 dark:border-white/10 focus:border-[#38bdf8]/50 focus:bg-white dark:focus:bg-[#131b36] focus:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;