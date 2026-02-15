export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-[#8888a0] font-mono text-sm">
        <div className="w-5 h-5 border-2 border-[#fb8b1e] border-t-transparent rounded-full animate-spin" />
        Loading data...
      </div>
    </div>
  );
}
